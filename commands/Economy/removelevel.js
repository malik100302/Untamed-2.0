module.exports = {
  name: 'removelevel',
  description: 'remove level role',
  aliases: [],
  usage: 'removelevel @role',
  admin: true,
  execute: async (client, message, config) => {
    if (!message.member.roles.cache.some((r) => config.permissions.moderation.includes(r.id) || message.member.hasPermission(['ADMINISTRATOR']))) { message.reply('You\'re not allowed to use this command!'); return; }
    const msgArr = message.content.split(' ');
    const target = message.mentions.roles.first() || message.guild.roles.cache.get(msgArr[1]);
    if (!target) {
      message.channel.send('Enter a valid role!');
      return;
    }
    if (!config.levelRoles.includes(target.id)) {
      message.channel.send('This role is not found as level reward!');
      return;
    }
    const levelRoleIndex = config.levelRoles.findIndex((r) => r === target.id);
    config.levelRoles.splice(levelRoleIndex, 1);
    config.levels.splice(levelRoleIndex, 1);
    message.channel.send('You have removed the role!');
    await client.db.config.updateOne({ id: message.guild.id }, {
      $set: {
        level: config.levels,
        levelRoles: config.levelRoles,
      },
    }, { upsert: true });
  },
};
