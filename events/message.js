const gainExp = require('../utils/gainExp');
const initializeGuild = require('../utils/initializeGuild');
const msToString = require('../utils/msToString');

module.exports = async (client, distube, message) => {
  if (!client.ready) return;

  if (message.author.bot) return;

  const msg = message.content.toLowerCase();
  const commandName = msg.split(' ')[0].substring(1);

  if (!message.member) {
    return;
  }

  if (!client.guildConfig[message.guild.id]) {
    await initializeGuild(client, message.guild.id);
  }

  if (message.content.startsWith(client.guildConfig[message.guild.id].prefix)) {
    const command = client.commands.get(commandName);
    if (!command) {
      return;
    }
    try {
      if (command.cooldown) {
        if (!client.cooldowns[message.guild.id][commandName]) {
          client.cooldowns[message.guild.id][commandName] = {};
        }
        if (client.cooldowns[message.guild.id][commandName][message.author.id]) {
          message.channel.send(`You're on cooldown! You can use this command again after${msToString(command.cooldown - (Date.now() - client.cooldowns[message.guild.id][commandName][message.author.id]))}`);
          return;
        }
      }
      command.execute(client, message, client.guildConfig[message.guild.id], distube);
    } catch (error) {
      console.error(error);
    }
  } else if (client.guildConfig[message.guild.id].automod.some((word) => message.content.toLowerCase().includes(word))) {
    message.reply('Your message was deleted because it contains forbidden words!');
    message.delete();
  } else {
    gainExp(client, message, client.guildConfig[message.guild.id]);
  }
};
