module.exports = async (client) => {
  Object.keys(client.guildConfig).forEach((guildID) => {
    const config = client.guildConfig[guildID];
    if (config.channels.serverStatsChannel) {
      const channel = client.channels.cache.get(config.channels.serverStatsChannel);
      if (channel) {
        channel.setName(`Member Count: ${channel.guild.memberCount}`);
        setInterval(() => {
          channel.setName(`Member Counts: ${channel.guild.memberCount}`);
        }, 1000 * 60 * 15);
      }
    }
  });
};
