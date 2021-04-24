const { MessageEmbed } = require('discord.js');

module.exports = {
  name: 'automod',
  description: 'set guild banned words',
  aliases: ['banword', 'bannedwords'],
  usage: 'automod/automod <word>',
  admin: true,
  execute: async (client, message, config) => {
    if (!message.member.roles.cache.some((r) => config.permissions.moderation.includes(r.id) || message.member.hasPermission(['ADMINISTRATOR']))) { message.reply('You\'re not allowed to use this command!'); return; }

    const msgArr = message.content.split(' ');

    if (msgArr.length === 1) {
      const embed = new MessageEmbed()
        .setTitle('AUTOMOD')
        .addField('List of Banned Words', config.automod.map((word) => `> ${word}`).join('\n') || 'None');
      message.channel.send(embed);
      return;
    }

    const wordIndex = config.automod.findIndex((word) => word.toLowerCase() === msgArr[1].toLowerCase());
    if (wordIndex >= 0) {
      config.automod.splice(wordIndex, 1);
      message.channel.send(`${message.author}, you have successfully removed ${msgArr[1]} from forbidden words!`);
    } else {
      config.automod.push(msgArr[1]);
      message.channel.send(`${message.author}, you have successfully added ${msgArr[1]} from forbidden words!`);
    }
    client.db.config.updateOne({ id: message.guild.id }, {
      $set: {
        automod: config.automod,
      },
    }, { upsert: true });
  },
};
