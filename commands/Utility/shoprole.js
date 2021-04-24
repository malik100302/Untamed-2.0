/* eslint-disable consistent-return */
/* eslint-disable max-len */
const Discord = require('discord.js');

module.exports = {
  name: 'shoprole',
  description: 'Setup shop role',
  aliases: [],
  usage: 'shoprole',
  admin: true,
  execute: async (client, message, config) => {
    if (!message.member.roles.cache.some((r) => config.permissions.moderation.includes(r.id) || message.member.hasPermission(['ADMINISTRATOR']))) { message.reply('You\'re not allowed to use this command!'); return; }

    const roles = require('../../constants/roles');
    const rolesKeys = Object.keys(roles);

    const embed = new Discord.MessageEmbed()
      .setColor('#EE33E4')
      .setThumbnail(client.user.avatarURL())
      .setTitle('Role Shop')
      .setDescription(rolesKeys.map((key) => `> ${roles[key].emoji} - ${roles[key].name} - ${roles[key].cost} points`));

    const embedMessage = await message.channel.send(embed);
    rolesKeys.forEach((key) => embedMessage.react(roles[key].emoji));
    config.shoprole = embedMessage.id;
    client.db.config.updateOne({ id: message.guild.id }, {
      $set: {
        shoprole: embedMessage.id,
      },
    }, { upsert: true });
  },
};
