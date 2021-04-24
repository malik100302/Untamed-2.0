module.exports = {
  name: 'warn',
  description: 'warns the user',
  aliases: [],
  usage: 'warn <user> <reason>',
  permissions: true,
  admin: true,
  execute: async (client, message, config) => {
    if (!message.member.roles.cache.some((r) => config.permissions.moderation.includes(r.id) || message.member.hasPermission(['ADMINISTRATOR']))) { message.reply('You\'re not allowed to use this command!'); return; }
    message.channel.bulkDelete(1);

    const msgArr = message.content.split(' ');
    const member = message.mentions.members.first() || message.guild.members.cache.get(msgArr[1]);

    if (!member) { message.channel.send('Error! Target user is not a member of this guild!'); return; }

    let reason = msgArr.slice(2).join(' ');
    if (!reason || reason === '') reason = 'Unknown';
    const currentDate = Date.now();
    const user = await client.db.warn.findOne({ id: member.id }) || { warns: [] };
    const modData = await client.db.modstats.findOne({ id: message.author.id }) || {};
    const modWarns = modData.warns || [];

    user.warns.filter((warn) => currentDate - warn.date <= config.warnexpiration);
    user.warns.push({
      reason,
      date: currentDate,
      mod: message.author.tag,
    });
    modWarns.push({
      user: member.id,
      reason,
      date: currentDate,
    });

    member.send(`You have been warned!\nReason: ${reason}`).catch();
    message.channel.send(`${member} has been warned! User currently have **${user.warns.length} ACTIVE WARNS!**`);

    await client.db.warn.updateOne({ id: member.id, guildID: message.guild.id }, { $set: { warns: user.warns } }, { upsert: true });
    await client.db.modstats.updateOne({ id: message.author.id }, { $set: { warns: modWarns } }, { upsert: true });
    await client.db.userlogs.updateOne({ id: member.id, guildID: message.guild.id }, {
      $push: {
        logs: {
          type: 'warn', date: Date.now(), mod: message.author.tag, reason,
        },
      },
    }, { upsert: true });
  },
};
