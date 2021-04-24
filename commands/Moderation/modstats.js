/* eslint-disable no-param-reassign */
/* eslint-disable consistent-return */
/* eslint-disable max-len */
const Discord = require('discord.js');

module.exports = {
  name: 'modstats',
  description: 'check modstats',
  aliases: ['ms'],
  usage: 'modstats/modstats <user>',
  permissions: true,
  admin: true,
  execute: async (client, message) => {
    const msgArr = message.content.split(' ');
    const targetUser = message.mentions.users.first() || client.users.cache.get(msgArr[1]) || message.author;
    const currentDate = Date.now();
    let user;

    if (targetUser) {
      user = await client.db.modstats.findOne({ id: targetUser.id }) || {};
    } else {
      user = await client.db.modstats.findOne({ id: message.author.id }) || {};
    }
    const userWarns = user.warns ? user.warns : [];
    const userMutes = user.mutes ? user.mutes : [];
    const userBans = user.bans ? user.bans : [];
    const userKicks = user.kicks ? user.kicks : [];
    const last7dwarns = user.warns ? user.warns.filter((warn) => currentDate - warn.date <= 1000 * 60 * 60 * 24 * 7) : [];
    const last7dmutes = user.mutes ? user.mutes.filter((mute) => currentDate - mute.date <= 1000 * 60 * 60 * 24 * 7) : [];
    const last7dbans = user.bans ? user.bans.filter((ban) => currentDate - ban.date <= 1000 * 60 * 60 * 24 * 7) : [];
    const last7dkicks = user.kicks ? user.kicks.filter((ban) => currentDate - ban.date <= 1000 * 60 * 60 * 24 * 7) : [];
    const embed = new Discord.MessageEmbed()
      .setTitle('Mod Stats')
      .setAuthor(targetUser.tag, targetUser.avatarURL())
      .addField('Overall Stats', `Warns: ${userWarns.length}\nMutes: ${userMutes.length}\nBans: ${userBans.length}\nKicks: ${userKicks.length}`)
      .addField('Last 7 Days Stats', `Warns: ${last7dwarns.length}\nMutes: ${last7dmutes.length}\nBans: ${last7dbans.length}\nKicks: ${last7dkicks.length}`);
    message.channel.send(embed);
  },
};
