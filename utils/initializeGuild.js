module.exports = (client, guildID) => {
  client.guildConfig[guildID] = {
    channels: {
      welcomeChannel: null,
      logChannel: null,
      serverStatsCategory: null,
      serverStatsChannel: null,
    },
    warnexpiration: 86400000,
    permissions: {
      moderation: [],
    },
    automod: [],
    prefix: '!',
    ticketMessage: null,
    ticketCategory: null,
    ticketsOpen: {},
    levels: [],
    levelRoles: [],
    levelSettings: {
      minTime: 60,
      maxTime: 120,
      minExp: 15,
      maxExp: 50,
      minCoins: 10,
      maxCoins: 30,
    },
  };
  client.cooldowns[guildID] = {}; client.db.config.updateOne({ id: guildID }, {
    $set: client.guildConfig[guildID],
  },
  { upsert: true });
};
