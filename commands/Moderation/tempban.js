const stringToMs = require('../../utils/stringToMs');

module.exports = {
  name: 'tempban',
  description: 'tempban',
  aliases: ['tb'],
  usage: 'tempban @user 4h <reason>',
  admin: true,
  execute: async (client, message, config) => {
    if (!message.member.roles.cache.some((r) => config.permissions.moderation.includes(r.id) || message.member.hasPermission(['ADMINISTRATOR']))) { message.reply('You\'re not allowed to use this command!'); return; }
    const msgArr = message.content.split(' ');
    let reason = msgArr.slice(3).join(' ');
    if (reason === '' || !reason) {
      reason = 'Unknown';
    }

    const member = message.mentions.members.first() || message.guild.members.cache.get(msgArr[1]);
    if (!member) {
      message.channel.send('You must tag the user you want to ban! `!ban @user 30s <reason>`');
      return;
    }

    if (!msgArr[2]) {
      message.channel.send('You must provide the duration! `!ban @user 30s <reason>`');
      return;
    }

    const duration = stringToMs(msgArr[2]);
    if (duration === -1) {
      message.channel.send('Invalid duration provided! `!mute @user 30s <reason>`');
      return;
    }

    const modData = await client.db.modstats.findOne({ id: message.author.id }) || {};
    const modBans = modData.bans || [];
    modBans.push({
      user: member.id,
      date: Date.now(),
      duration,
    });

    member.ban();
    message.channel.send(`${member} has been temporarily banned for ${msgArr[2]}`);
    member.send(`You have been temporarily banned for ${msgArr[2]}\nReason: ${reason}`);
    client.bans[member.id] = setTimeout(() => {
      message.guild.members.unban(member.id);
      client.db.ban.deleteOne({ id: member.id, guildID: message.guild.id });
    }, duration);

    client.db.ban.updateOne({ id: member.id, guildID: message.guild.id }, { $set: { start: Date.now(), duration, reason } }, { upsert: true });
    client.db.modstats.updateOne({ id: message.author.id, guildID: message.guild.id }, {
      $push: {
        bans: {
          user: member.id,
          date: Date.now(),
          duration,
        },
      },
    }, { upsert: true });
    await client.db.userlogs.updateOne({ id: member.id, guildID: message.guild.id }, {
      $push: {
        logs: {
          type: 'tempban', date: Date.now(), mod: message.author.tag, reason,
        },
      },
    }, { upsert: true });
  },
};
