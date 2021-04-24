module.exports = async (client) => {
  client.cooldowns = {};
  const dbConfig = await client.db.config.find().toArray();
  dbConfig.forEach((c) => {
    const currentGuild = client.guilds.cache.get(c.id);
    if (currentGuild) {
      client.guildConfig[c.id] = c;
      client.cooldowns[c.id] = {};
    } else {
      client.db.config.deleteOne({ id: c.id });
    }
  });
};
