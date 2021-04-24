module.exports = {
  name: 'withdraw',
  description: 'withdraw',
  aliases: [],
  execute: async (client, message) => {
    const msgArr = message.content.split(' ');
    const userdata = await client.db.userdata.findOne({ id: message.author.id });
    const amount = parseInt(msgArr[1], 10);
    if (isNaN(amount)) {
      message.channel.send('Enter a valid amount to withdraw');
      return;
    }
    if (userdata) {
      if (userdata.bank < amount) {
        message.channel.send(`You only have ${userdata.coins} Gold in the Bank!`);
        return;
      }
      message.channel.send(`✅ ${message.author} YOU HAVE WITHDRAWN ${amount} 🪙!`);
      await client.db.userdata.updateOne({ id: message.author.id }, { $inc: { coins: amount, bank: amount * -1 } }, { upsert: true });
    } else {
      message.channel.send('You do not have a profile yet!');
    }
  },
};
