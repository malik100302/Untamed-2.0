module.exports = {
  name: 'ban',
  description: 'Bans the user',
  aliases: ['b'],
  usage: 'ban/alias <user> <reason (optional)>',
  admin: true,
  execute: async (client, message, config) => {
    if (!message.member.roles.cache.some((r) => config.permissions.moderation.includes(r.id) || message.member.hasPermission(['ADMINISTRATOR']))) { message.reply('You\'re not allowed to use this command!'); return; }

    const msgArr = message.content.split(' ');
    const member = message.mentions.members.first() || message.guild.members.cache.get(msgArr[1]);
    if (!member) { message.reply('Error! Member doens\'t exist!'); return; }
    if (!member.kickable) { message.reply('You can\'t ban that member!'); return; }

    let reason = msgArr.slice(2).join(' ');
    if (!reason) reason = 'No Reason Provided';

    await member.send('You have been banned');
    await member.ban()
      .catch((error) => message.reply(`There was an error ${message.author}! Error: ${error}`));

    await client.db.modstats.updateOne({ id: message.author.id, guildID: message.guild.id }, {
      $push: {
        bans: {
          user: member.id,
          date: Date.now(),
          duration: 0,
        },
      },
    }, { upsert: true });
    await client.db.userlogs.updateOne({ id: member.id, guildID: message.guild.id }, {
      $push: {
        logs: {
          type: 'ban', date: Date.now(), mod: message.author.tag, reason,
        },
      },
    }, { upsert: true });
  },
};
