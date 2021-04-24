const pagination = 10;

module.exports = {
  name: 'logs',
  description: 'display logs of the user',
  aliases: [],
  usage: 'logs <user>/logs',
  permissions: true,
  admin: true,
  execute: async (client, message, config) => {
    if (!message.member.roles.cache.some((r) => config.permissions.moderation.includes(r.id) || message.member.hasPermission(['ADMINISTRATOR']))) { message.reply('You\'re not allowed to use this command!'); return; }
    const msgArr = message.content.split(' ');

    let page = parseInt(msgArr[2], 10);
    if (isNaN(page)) {
      page = 1;
    }

    let targetUser = message.mentions.users.first() || client.users.cache.get(msgArr[1]) || message.author;
    let user;

    if (targetUser) {
      user = await client.db.userlogs.findOne({ id: targetUser.id });
    } else {
      user = await client.db.userlogs.findOne({ id: message.author.id });
      targetUser = client.users.cache.get(user.id);
    }
    if (user) {
      if (user.logs.length > 0) {
        const maxPage = Math.floor((user.logs.length - 1) / pagination) + 1;
        if (maxPage < page) {
          page = maxPage;
        }
        message.channel.send(`**${targetUser.tag}'s ACTIVE LOGS:**\`\`\`\n\n${user.logs.reverse().slice((page - 1) * pagination, page * pagination).map((log, index) => {
          const logDate = new Date(log.date);
          return `#${index + 1 + ((page - 1) * 10)} - ${logDate.getUTCMonth() + 1}/${logDate.getUTCDate()}/${logDate.getUTCFullYear()} - ${log.type} - ${log.reason || 'None'} - ${log.mod}`;
        }).join('\n')}\n\nPage ${page} of ${maxPage}\`\`\``);
      } else {
        message.channel.send(`**${targetUser.tag}** don't have logs!`);
      }
    } else {
      message.channel.send(`**${targetUser.tag}** don't have logs!`);
    }
  },
};
