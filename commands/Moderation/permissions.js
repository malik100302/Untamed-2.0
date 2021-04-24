const { MessageEmbed } = require('discord.js');

module.exports = {
  name: 'permissions',
  description: 'display bot permissions',
  aliases: ['perms'],
  usage: 'permissions',
  admin: true,
  execute: async (client, message, config) => {
    if (!message.member.roles.cache.some((r) => config.permissions.moderation.includes(r.id) || message.member.hasPermission(['ADMINISTRATOR']))) { message.reply('You\'re not allowed to use this command!'); return; }
    const permissionMessage = config.permissions.moderation.map((perm) => `> ${message.guild.roles.cache.get(perm) || message.guild.members.cache.get(perm) || perm}`).join('\n');
    const embed = new MessageEmbed()
      .setTitle('Server Permissions')
      .setThumbnail(`https://cdn.discordapp.com/icons/${message.guild.id}/${message.guild.icon}.png`)
      .setDescription(`**MODERATION**:\n${permissionMessage}`)
      .setFooter(message.member.displayName, message.author.displayAvatarURL({ dynamic: true }))
      .setTimestamp();
    message.channel.send(embed);
  },
};
