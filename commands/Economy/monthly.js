const msToString = require('../../utils/msToString');

module.exports = {
  name: 'monthly',
  description: 'monthly',
  aliases: [],
  usage: 'monthly',
  admin: false,
  execute: async (client, message) => {
    const user = await client.db.userdata.findOne({ id: message.author.id });
    if (!user) {
      await client.db.userdata.updateOne({ id: message.author.id }, { $inc: { monthly: 1, coins: 20000 } }, { upsert: true });
      message.channel.send('✅ You have claimed your monthly 20000 coins!');
      return;
    }
    if (!user.monthly) {
      await client.db.userdata.updateOne({ id: message.author.id }, { $inc: { monthly: 1, coins: 20000 } }, { upsert: true });
      message.channel.send('✅ You have claimed your monthly 20000 coins!');
      return;
    }
    const lastDaily = new Date();
    const remainingTime = (1000 * 60 * 60 * 24 * 30) - (lastDaily.getTime() - (Math.floor((lastDaily.getTime()) / (1000 * 60 * 60 * 24 * 30)) * (1000 * 60 * 60 * 24 * 30)));
    message.channel.send(`You already claimed your monthly! You can claim again after${msToString(remainingTime)}`);
  },
};
