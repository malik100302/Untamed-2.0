/* eslint-disable no-restricted-syntax */
/* eslint-disable prefer-destructuring */
/* eslint-disable no-restricted-globals */
/* eslint-disable no-await-in-loop */

const generateLeaderboards = require('../../utils/generateLeaderboardsCoins');

module.exports = {
  name: 'leaderboards',
  description: 'Print leaderboards',
  aliases: ['lb'],
  execute: async (client, message, config) => {
    const page = 0;
    if (!message.member.roles.cache.some((r) => config.permissions.moderation.includes(r.id) || message.member.hasPermission(['ADMINISTRATOR']))) { message.reply('You\'re not allowed to use this command!'); return; }
    if (client.leaderboards[message.guild.id]) {
      clearInterval(client.leaderboards[message.guild.id]);
    }
    const data = await client.db.userdata.find().toArray();
    const overall = data.filter((u) => !isNaN(u.coins)).sort((a, b) => b.coins - a.coins).slice(0 + page * 10, 10 + page * 10);

    const attachment = await generateLeaderboards(client, page, overall);
    await message.channel.send(attachment);
  },
};
