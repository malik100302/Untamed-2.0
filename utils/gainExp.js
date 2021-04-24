const { embed } = require('../utils');
const roleChange = require('./roleChange');

module.exports = async (client, message, config) => {
  if (config.blacklist) {
    if (config.blacklist.includes(message.author.id) || config.blacklist.includes(message.channel.id) || config.blacklist.some((roleID) => {
      const role = message.member.roles.cache.get(roleID);
      if (role) {
        return true;
      }
      return false;
    })) {
      return;
    }
  }
  let boost = 1;
  if (config.blacklist) {
    if (config.blacklist.includes(message.author.id) || config.blacklist.includes(message.channel.id) || config.blacklist.some((roleID) => {
      const role = message.member.roles.cache.get(roleID);
      if (role) {
        return false;
      }
      return true;
    })) {
      boost = 2;
    }
  }
  if (!client.cooldowns[message.guild.id].chatExp) {
    client.cooldowns[message.guild.id].chatExp = {};
  }
  const chatCooldown = client.cooldowns[message.guild.id].chatExp;
  const {
    minTime, maxTime, minExp, maxExp, minCoins, maxCoins,
  } = config.levelSettings;
  const isXpBanned = message.member.roles.cache.some((r) => r.name === 'XP Banned');
  if (!chatCooldown[message.author.id] && !isXpBanned) {
    const randomTime = Math.floor(Math.random() * (maxTime - minTime) + minTime);
    const randomExp = Math.floor(Math.random() * (maxExp - minExp) + minExp) * boost;
    const randomCoins = Math.floor(Math.random() * (maxCoins - minCoins) + minCoins);
    await client.db.userdata.updateOne(
      { id: message.author.id, guildID: message.guild.id },
      {
        $inc: {
          exp: randomExp,
          coins: randomCoins,
        },
      },
      { upsert: true },
    );
    const userdata = await client.db.userdata.findOne({ id: message.author.id, guildID: message.guild.id });
    if (userdata) {
      let nextLevel = (config.levels.findIndex((explevel) => userdata.exp < explevel) - 1);
      if (nextLevel === -1) {
        nextLevel = config.levels.length;
      }
      const userLevelRole = nextLevel;
      if (userLevelRole >= 0) {
        config.levelRoles.forEach((role, index) => {
          const targetRole = message.guild.roles.cache.find((r) => r.id === role);
          if (index !== userLevelRole) {
            if (targetRole) {
              roleChange.remove(message.member, targetRole.name);
            }
          } else if (!message.member.roles.cache.some((r) => r.id === role)) {
            roleChange.add(message.member, targetRole.name);
            message.channel.send(embed(message, 'LEVEL UP', `Congratulations ${message.author}! You are now ${targetRole}!`));
          }
        });
      }
    }
    chatCooldown[message.author.id] = true;
    setTimeout(() => {
      delete chatCooldown[message.author.id];
    }, 1000 * randomTime);
  }
};
