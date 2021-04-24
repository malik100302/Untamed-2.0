const { MessageEmbed } = require('discord.js');
const msToString = require('../msToString.js');

const cd = 1000 * 60 * 10;

module.exports = (client, config, reaction, user) => {
  if (!client.cooldowns[config.id].ticket) {
    client.cooldowns[config.id].ticket = {};
  }
  const ticketCD = client.cooldowns[config.id].ticket;
  const server = reaction.message.guild.channels;
  reaction.users.remove(user.id);
  if (ticketCD[user.id]) {
    const timeRemaining = cd - (Date.now() - ticketCD[user.id]);
    user.send(`You are on cooldown! You must wait${msToString(timeRemaining)} before you can open another ticket!`);
    return;
  }

  ticketCD[user.id] = Date.now();
  server.create(`ticket-${user.tag}`, {
    type: 'text',
    parent: config.ticketCategory,
  }).then((createdChannel) => {
    const exampleEmbed = new MessageEmbed()
      .setColor('#EE33E4')
      .setTitle('SUPPORT')
      .setDescription('React on the :lock: to close this ticket.');
    createdChannel.send('@everyone', { embed: exampleEmbed }).then((curMsg) => {
      curMsg.channel.updateOverwrite(user, {
        SEND_MESSAGES: true,
        VIEW_CHANNEL: true,
        READ_MESSAGE_HISTORY: true,
      });
      curMsg.channel.updateOverwrite(reaction.message.guild.roles.everyone, {
        SEND_MESSAGES: false,
        VIEW_CHANNEL: false,
        READ_MESSAGE_HISTORY: false,
      });
      curMsg.react('🔒');
      config.ticketsOpen[createdChannel.id] = curMsg.id;
      client.db.config.updateOne({ id: config.id }, {
        $set: {
          ticketsOpen: config.ticketsOpen,
        },
      });
    });
  });
};
