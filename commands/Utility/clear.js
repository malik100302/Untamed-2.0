/* eslint-disable consistent-return */
/* eslint-disable max-len */
const Discord = require('discord.js');

module.exports = {
  name: 'clear',
  description: 'Clear the channel',
  aliases: ['c', 'del', 'purge'],
  usage: 'clear/alias  <number between 2 - 100>',
  admin: true,
  execute: async (client, message, config) => {
    if (!message.member.roles.cache.some((r) => config.permissions.moderation.includes(r.id) || message.member.hasPermission(['ADMINISTRATOR']))) { message.reply('You\'re not allowed to use this command!'); return; }

    const msgArr = message.content.split(' ');
    const deleteCount = parseInt(msgArr[1], 10);

    if (!deleteCount || deleteCount < 2 || deleteCount > 100) { return message.reply('You have entered an invalid amount!'); }

    const fetched = await message.channel.messages.fetch({ limit: deleteCount });
    message.channel.bulkDelete(fetched)
      .catch((error) => message.reply(`Error encountered: ${error}`));

    const logEmbed = new Discord.MessageEmbed()
      .setColor('#EE33E4')
      .setAuthor(message.author.tag, message.author.avatarURL())
      .setTitle('Clearing Bulk Messages')
      .addField('Moderator', message.author.tag)
      .addField('Channel', message.channel)
      .addField('Message Count', deleteCount)
      .setTimestamp()
      .setFooter(config.footer);
    message.guild.channels.cache.get(config.channels.logChannel).send({ embed: logEmbed });
  },
};
