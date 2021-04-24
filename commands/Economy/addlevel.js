module.exports = {
  name: 'addlevel',
  description: 'add level role',
  aliases: [],
  usage: 'addlevel @role <exp_requirement>',
  admin: true,
  execute: async (client, message, config) => {
    if (!message.member.roles.cache.some((r) => config.permissions.moderation.includes(r.id) || message.member.hasPermission(['ADMINISTRATOR']))) { message.reply('You\'re not allowed to use this command!'); return; }
    const msgArr = message.content.split(' ');
    const target = message.mentions.roles.first() || message.guild.roles.cache.get(msgArr[1]);
    const expRequirement = parseInt(msgArr[2], 10);
    if (!target) {
      message.channel.send('Enter a valid role!');
      return;
    }
    if (isNaN(expRequirement)) {
      message.channel.send('Enter a valid amount of exp required!');
      return;
    }
    if (config.levelRoles.includes(target.id)) {
      message.channel.send('This role already exists as reward!');
      return;
    }
    const levelIndex = config.levels.findIndex((val) => val > expRequirement);
    if (levelIndex >= 0) {
      config.levels.splice(levelIndex, 0, expRequirement);
      config.levelRoles.splice(levelIndex, 0, target.id);
    } else {
      config.levels.push(expRequirement);
      config.levelRoles.push(target.id);
    }
    message.channel.send('You have successfully added a new level requirement!');
    await client.db.config.updateOne({ id: message.guild.id }, {
      $set: {
        levels: config.levels,
        levelRoles: config.levelRoles,
      },
    }, { upsert: true });
  },
};
