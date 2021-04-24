module.exports = {
  name: 'deposit',
  description: 'deposit',
  aliases: [],
  execute: async (client, message) => {
    const msgArr = message.content.split(' ');
    const userdata = await client.db.userdata.findOne({ id: message.author.id });
    const amount = parseInt(msgArr[1], 10);
    if (isNaN(amount)) {
      message.channel.send('Enter a valid amount to deposit');
      return;
    }
    if (userdata) {
      if (userdata.coins < amount) {
        message.channel.send(`You only have ${userdata.coins} Gold!`);
        return;
      }
      message.channel.send(`✅ ${message.author} YOU HAVE DEPOSITED ${amount} 🪙!`);
      await client.db.userdata.updateOne({ id: message.author.id }, { $inc: { coins: amount * -1, bank: amount } }, { upsert: true });
    } else {
      message.channel.send('You do not have a profile yet!');
    }
  },
};
