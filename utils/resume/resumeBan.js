module.exports = async (client) => {
  const currentDate = Date.now();

  const pastBan = await client.db.ban.find().toArray();
  pastBan.forEach((ban) => {
    const remainingDuration = ban.duration - (currentDate - ban.start);
    const guild = client.guilds.cache.get(ban.guildID);
    if (remainingDuration < 0) {
      guild.members.unban(ban.id);
      client.db.ban.deleteOne({ id: ban.id });
    } else {
      client.bans[ban.id] = setTimeout(() => {
        guild.members.unban(ban.id);
        client.db.ban.deleteOne({ id: ban.id });
      }, remainingDuration);
    }
  });
};
