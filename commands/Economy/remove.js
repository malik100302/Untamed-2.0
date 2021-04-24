module.exports = {
  name: 'remove',
  description: 'remove',
  aliases: [],
  usage: 'remove @user <amount>',
  admin: true,
  execute: async (client, message, config) => {
    if (!message.member.roles.cache.some((r) => config.permissions.moderation.includes(r.id) || message.member.hasPermission(['ADMINISTRATOR']))) { message.reply('You\'re not allowed to use this command!'); return; }
    const msgArr = message.content.split(' ');
    const target = message.mentions.members.first() || message.guild.members.cache.get(msgArr[2]);
    const amount = parseInt(msgArr[2], 10);
    if (isNaN(amount)) {
      message.channel.send('Enter a valid amount to remove');
      return;
    }
    message.channel.send(`✅ ${message.author} removed ${amount} coins from ${target}!`);
    await client.db.userdata.updateOne({ id: target.id }, { $inc: { coins: amount * -1 } }, { upsert: true });
  },
};
