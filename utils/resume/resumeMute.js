module.exports = async (client) => {
  const currentDate = Date.now();

  const pastMute = await client.db.mute.find().toArray();
  pastMute.forEach((mute) => {
    const remainingDuration = mute.duration - (currentDate - mute.start);
    const guild = client.guilds.cache.get(mute.guildID);
    const muteRole = guild.roles.cache.get((r) => r.name.toLowerCase() === 'muted');
    const member = guild.members.cache.get(mute.id);
    if (member) {
      if (remainingDuration < 0) {
        member.roles.remove(muteRole);
        client.db.mute.deleteOne({ id: mute.id });
      } else {
        client.mutes[mute.id] = setTimeout(() => {
          member.roles.remove(muteRole);
          client.db.mute.deleteOne({ id: mute.id });
        }, remainingDuration);
      }
    }
  });
};
