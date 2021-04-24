module.exports = async (client) => {
  setInterval(() => {
    client.guilds.cache.forEach((guild) => {
      const config = client.guildConfig[guild.id];
      guild.members.cache.forEach((member) => {
        if (member.voice.channel) {
          if (config.blacklist) {
            if (config.blacklist.includes(member.id) || config.blacklist.includes(member.voice.channel.id) || config.blacklist.some((roleID) => {
              const role = member.roles.cache.get(roleID);
              if (role) {
                return true;
              }
              return false;
            })) {
              return;
            }
            client.db.userdata.updateOne({ id: member.id }, {
              $inc: {
                coins: Math.floor(Math.random() * 5) + 5,
                voice: 60 * 1000,
              },
            });
          }
        }
      });
    });
  }, 60 * 1000);
};
