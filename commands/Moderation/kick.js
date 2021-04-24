module.exports = {
  name: 'kick',
  description: 'Kicks the user',
  aliases: ['k'],
  usage: 'kick/alias <user> <reason (optional)>',
  admin: true,
  execute: async (client, message, config) => {
    if (!message.member.roles.cache.some((r) => config.permissions.moderation.includes(r.id) || message.member.hasPermission(['ADMINISTRATOR']))) { message.reply('You\'re not allowed to use this command!'); return; }

    const msgArr = message.content.split(' ');
    const member = message.mentions.members.first() || message.guild.members.cache.get(msgArr[1]);
    message.channel.bulkDelete(1);
    if (!member) { message.reply('Member doesn\'t exist!'); return; }
    if (!member.kickable) { message.reply('You can\'t kick that member!'); return; }

    let reason = msgArr.slice(2).join(' ');
    if (!reason) reason = 'No Reason Provided';

    await member.send(`You have been kicked because of the following reason: **${reason}**`);
    await member.kick(reason)
      .catch((error) => message.reply(`There was an error ${message.author}! Error: ${error}`));

    await client.db.modstats.updateOne({ id: message.author.id, guildID: message.guild.id }, {
      $push: {
        kicks: {
          user: member.id,
          date: Date.now(),
          duration: 0,
        },
      },
    }, { upsert: true });
    await client.db.userlogs.updateOne({ id: member.id, guildID: message.guild.id }, {
      $push: {
        logs: {
          type: 'kick', date: Date.now(), mod: message.author.tag, reason,
        },
      },
    }, { upsert: true });
  },
};
