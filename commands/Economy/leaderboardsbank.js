/* eslint-disable no-restricted-syntax */
/* eslint-disable prefer-destructuring */
/* eslint-disable no-restricted-globals */
/* eslint-disable no-await-in-loop */

const generateLeaderboards = require('../../utils/generateLeaderboardsBank');

module.exports = {
  name: 'leaderboardsbank',
  description: 'Print leaderboards bank',
  aliases: ['lbb'],
  execute: async (client, message, config) => {
    const page = 0;
    if (!message.member.roles.cache.some((r) => config.permissions.moderation.includes(r.id) || message.member.hasPermission(['ADMINISTRATOR']))) { message.reply('You\'re not allowed to use this command!'); return; }
    if (client.leaderboards[message.guild.id]) {
      clearInterval(client.leaderboards[message.guild.id]);
    }
    const data = await client.db.userdata.find().toArray();
    const overall = data.filter((u) => !isNaN(u.bank)).sort((a, b) => b.bank - a.bank).slice(0 + page * 10, 10 + page * 10);

    const attachment = await generateLeaderboards(client, page, overall);
    await message.channel.send(attachment);
  },
};
