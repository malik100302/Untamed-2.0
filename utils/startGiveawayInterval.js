const { MessageEmbed } = require('discord.js');
const msToString = require('./msToString');

const giveawayUpdateInterval = 1000 * 60;

module.exports = (client, messageObj, giveawayObj) => {
  const messageInterval = setInterval(() => {
    if (giveawayObj.duration - (Date.now() - giveawayObj.start) > 0) {
      const giveawayMessage = new MessageEmbed()
        .setTitle('GIVEAWAY')
        .setDescription(`PRIZE: ${giveawayObj.prize}\nWINNERS: ${giveawayObj.winners}\nREMAINING TIME: ${msToString(giveawayObj.duration - (Date.now() - giveawayObj.start))}`);
      messageObj.edit(giveawayMessage);
    } else {
      const users = messageObj.reactions.cache.get('🎉').users.cache.array();
      const giveawayWinners = [];
      for (let i = 0; i < giveawayObj.winners; i += 1) {
        if (giveawayWinners.length === users.length - 1) { break; }
        let currentWinner = users[Math.floor(Math.random() * users.length)];
        while (giveawayWinners.includes(currentWinner) || currentWinner.bot) {
          currentWinner = users[Math.floor(Math.random() * users.length)];
        }
        giveawayWinners.push(currentWinner);
      }
      messageObj.channel.send(`Congratulations!\n${giveawayWinners}\nYou just won ${giveawayObj.prize}!`);
      client.db.giveaway.deleteOne({ messageID: messageObj.id, guildID: messageObj.guild.id, channelID: messageObj.channel.id });
      clearInterval(messageInterval);
    }
  }, giveawayUpdateInterval);
};
