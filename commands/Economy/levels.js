const { MessageEmbed } = require('discord.js');

module.exports = {
  name: 'levels',
  description: 'display levels',
  aliases: [],
  usage: 'levels',
  admin: false,
  execute: async (client, message, config) => {
    const embed = new MessageEmbed()
      .setTitle('Levels')
      .setDescription(config.levelRoles.map((role, index) => {
        const roleObj = message.guild.roles.cache.get(role);
        if (roleObj) return `${roleObj} - ${config.levels[index]} EXP`;
        return `Unkown - ${config.levels[index]} EXP`;
      }).join('\n'));
    message.channel.send(embed);
  },
};
