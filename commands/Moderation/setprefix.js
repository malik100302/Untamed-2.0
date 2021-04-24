module.exports = {
  name: 'setprefix',
  description: 'setprefix',
  aliases: ['sp'],
  usage: 'setprefix <newprefix>',
  admin: true,
  execute: async (client, message, config) => {
    if (!message.member.roles.cache.some((r) => config.permissions.moderation.includes(r.id) || message.member.hasPermission(['ADMINISTRATOR']))) { message.reply('You\'re not allowed to use this command!'); return; }

    const msgArr = message.content.split(' ');
    const newPrefix = msgArr[1] ? msgArr[1][0] : null;
    if (!newPrefix) {
      message.channel.send('You must provide the new prefix!');
      return;
    }

    client.db.config.updateOne({ id: message.guild.id },
      {
        $set: {
          prefix: newPrefix,
        },
      });

    config.prefix = newPrefix;
    message.channel.send(`You have changed your prefix to \`${newPrefix}\`!`);
  },
};
