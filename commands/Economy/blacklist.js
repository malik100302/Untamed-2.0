const { MessageEmbed } = require('discord.js');

module.exports = {
  name: 'blacklist',
  description: 'blacklist',
  aliases: [],
  usage: 'blacklist @user/@channel/@role',
  admin: true,
  execute: async (client, message, config) => {
    if (!message.member.roles.cache.some((r) => config.permissions.moderation.includes(r.id) || message.member.hasPermission(['ADMINISTRATOR']))) { message.reply('You\'re not allowed to use this command!'); return; }
    const msgArr = message.content.split(' ');
    const blacklistTarget = message.mentions.users.first()
    || message.mentions.channels.first()
    || message.mentions.roles.first()
    || client.users.cache.get(msgArr[1])
    || message.guild.channels.cache.get(msgArr[1])
    || message.guild.roles.cache.get(msgArr[1]);
    if (!blacklistTarget) {
      let list = [];
      if (config.blacklist) {
        config.blacklist.forEach((item) => {
          const target = client.users.cache.get(item)
      || message.guild.channels.cache.get(item)
      || message.guild.roles.cache.get(item);
          if (target) {
            list.push(`> ${target}`);
          }
        });
      } else {
        list = '> None';
      }
      const embed = new MessageEmbed()
        .setTitle('Exp Blacklist')
        .setDescription(list);
      message.channel.send(embed);
      return;
    }
    const blacklistID = blacklistTarget.id;
    if (!config.blacklist) {
      config.blacklist = [];
    }
    const index = config.blacklist.indexOf(blacklistID);
    if (index >= 0) {
      config.blacklist.splice(index, 1);
      message.channel.send(`${blacklistTarget} has been removed from blacklist!`);
    } else {
      config.blacklist.push(blacklistID);
      message.channel.send(`${blacklistTarget} has been blacklisted!`);
    }
    await client.db.config.updateOne({ id: message.guild.id }, { $set: { blacklist: config.blacklist } }, { upsert: true });
  },
};
