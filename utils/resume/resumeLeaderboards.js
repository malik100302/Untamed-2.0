const generateLeaderboards = require('../generateLeaderboards');

module.exports = async (client) => {
  Object.keys(client.guildConfig).forEach(async (guildID) => {
    const config = client.guildConfig[guildID];
    if (config.leaderboards) {
      const leaderboardChannel = client.channels.cache.get(config.leaderboards.channelID);
      if (leaderboardChannel) {
        let leaderboardMessage;
        try {
          leaderboardMessage = await leaderboardChannel.messages.fetch(config.leaderboards.id);
        } catch {
          console.log('Leaderboard Message not Found!');
          return;
        }
        if (leaderboardMessage) {
          const page = 0;
          client.leaderboards[guildID] = setInterval(async () => {
            const data = await client.db.userdata.find().toArray();
            const overall = data.sort((a, b) => b.exp - a.exp).slice(0 + page * 10, 10 + page * 10);
            const attachment = await generateLeaderboards(client, page, overall);
            leaderboardMessage.delete();
            leaderboardMessage = await leaderboardChannel.send(attachment);
          }, 1000 * 60 * 10);
        }
      }
    }
  });
};
