module.exports = {
  name: 'add',
  description: 'add',
  aliases: [],
  usage: 'add @user <amount>',
  admin: true,
  execute: async (client, message, config) => {
    if (!message.member.roles.cache.some((r) => config.permissions.moderation.includes(r.id) || message.member.hasPermission(['ADMINISTRATOR']))) { message.reply('You\'re not allowed to use this command!'); return; }
    const msgArr = message.content.split(' ');
    const target = message.mentions.members.first() || message.guild.members.cache.get(msgArr[2]);
    const amount = parseInt(msgArr[2], 10);
    if (isNaN(amount)) {
      message.channel.send('Enter a valid amount to add');
      return;
    }
    message.channel.send(`✅ ${message.author} gave ${target} ${amount} rubies!`);
    await client.db.userdata.updateOne({ id: target.id }, { $inc: { coins: amount } }, { upsert: true });
  },
};
