const { MessageEmbed } = require('discord.js');
const msToString = require('../msToString');

const giveawayUpdateInterval = 1000 * 60;

module.exports = async (client) => {
  client.giveawayMessages = {};
  const giveaway = await client.db.giveaway.find({});
  giveaway.forEach(async ({
    prize, winners, duration, start, messageID, channelID, guildID,
  }) => {
    client.giveawayMessages[messageID] = true;
    let giveawayMessage;
    const giveawayGuild = client.guilds.cache.get(guildID);
    if (!giveawayGuild) {
      await client.db.giveaway.deleteOne({ guildID });
      return;
    }
    const giveawayChannel = giveawayGuild.channels.cache.get(channelID);
    if (!giveawayChannel) {
      await client.db.giveaway.deleteOne({ channelID });
      return;
    }
    let messageObj;
    try {
      messageObj = await giveawayChannel.messages.fetch(messageID);
    } catch (err) {
      console.log('error in fetching message');
    }
    if (!messageObj) {
      await client.db.giveaway.deleteOne({ messageID });
      return;
    }
    const messageInterval = setInterval(() => {
      giveawayMessage = new MessageEmbed()
        .setTitle('GIVEAWAY')
        .setDescription(`PRIZE: ${prize}\nWINNERS: ${winners}\nREMAINING TIME: ${msToString(duration - (Date.now() - start))}`);
      messageObj.edit(giveawayMessage);
    }, giveawayUpdateInterval);
    await messageObj.reactions.cache.get('🎉').users.fetch();
    const users = messageObj.reactions.cache.get('🎉').users.cache.array();
    setTimeout(async () => {
      const giveawayWinners = [];
      delete client.giveawayMessages[messageID];
      for (let i = 0; i < winners; i += 1) {
        if (giveawayWinners.length === users.length - 1) { break; }
        let currentWinner = users[Math.floor(Math.random() * users.length)];
        while (giveawayWinners.includes(currentWinner) || currentWinner.bot) {
          currentWinner = users[Math.floor(Math.random() * users.length)];
        }
        giveawayWinners.push(currentWinner);
      }
      giveawayChannel.send(`Congratulations!\n${giveawayWinners}\nYou just won ${prize}!`);
      client.db.giveaway.deleteOne({ messageID, guildID, channelID });
      clearInterval(messageInterval);
    }, duration - (Date.now() - start));
  });
};
