module.exports = {
  name: 'give',
  description: 'give',
  aliases: [],
  execute: async (client, message) => {
    const msgArr = message.content.split(' ');
    const target = message.mentions.members.first() || message.guild.members.cache.get(msgArr[2]);
    const userdata = await client.db.userdata.findOne({ id: message.author.id });
    if (message.author.id === target.id) {
      message.channel.send('YOU CAN\'T GIVE GOLD TO YOURSELF!');
      return;
    }
    const amount = parseInt(msgArr[2], 10);
    if (isNaN(amount)) {
      message.channel.send('Enter a valid amount to give');
      return;
    }
    if (userdata) {
      if (userdata.coins < amount) {
        message.channel.send(`You only have ${userdata.coins} Gold!`);
        return;
      }
      message.channel.send(`✅ ${message.author} YOU HAVE GIVEN ${amount} 🪙 GOLD TO ${target}!`);
      await client.db.userdata.updateOne({ id: target.id }, { $inc: { coins: amount } }, { upsert: true });
      await client.db.userdata.updateOne({ id: message.author.id }, { $inc: { coins: amount * -1 } }, { upsert: true });
    } else {
      message.channel.send('You do not have a profile yet!');
    }
  },
};
