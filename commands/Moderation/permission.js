module.exports = {
  name: 'permission',
  description: 'add bot command permissions to specified user/role',
  aliases: [],
  usage: '!permission @role/@user',
  admin: true,
  execute: async (client, message, config) => {
    if (!message.member.roles.cache.some((r) => config.permissions.moderation.includes(r.id) || message.member.hasPermission(['ADMINISTRATOR']))) { message.reply('You\'re not allowed to use this command!'); return; }

    const msgArr = message.content.split(' ');

    const target = message.mentions.roles.first() || message.guild.roles.cache.get(msgArr[1]) || message.mentions.members.first() || message.guild.members.cache.get(msgArr[1]);

    if (target) {
      const exists = config.permissions.moderation.findIndex((i) => i === target.id);
      if (exists < 0) {
        config.permissions.moderation.push(target.id);
        client.db.config.updateOne({ id: message.guild.id }, {
          $set: {
            permissions: config.permissions,
          },
        }, { upsert: true });
        message.channel.send(`${message.author}, you have successfully added permission moderation to ${target}`);
      } else {
        config.permissions.moderation.splice(exists, 1);
        client.db.config.updateOne({ id: message.guild.id }, {
          $set: {
            permissions: config.permissions,
          },
        }, { upsert: true });
        message.channel.send(`${message.author}, you have successfully removed permission moderation to ${target}`);
      }
    } else {
      message.channel.send('Specified target not found!');
    }
  },
};
