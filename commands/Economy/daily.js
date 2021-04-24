const msToString = require('../../utils/msToString');

module.exports = {
  name: 'daily',
  description: 'daily',
  aliases: [],
  usage: 'daily',
  admin: false,
  execute: async (client, message) => {
    const user = await client.db.userdata.findOne({ id: message.author.id });
    if (!user) {
      await client.db.userdata.updateOne({ id: message.author.id }, { $inc: { daily: 1, coins: 1000 } }, { upsert: true });
      message.channel.send('✅ You have claimed your daily 1000 coins!');
      return;
    }
    if (!user.daily) {
      await client.db.userdata.updateOne({ id: message.author.id }, { $inc: { daily: 1, coins: 1000 } }, { upsert: true });
      message.channel.send('✅ You have claimed your daily 1000 coins!');
      return;
    }
    const lastDaily = new Date();
    const remainingTime = (1000 * 60 * 60 * 24) - (lastDaily.getTime() - (Math.floor((lastDaily.getTime()) / (1000 * 60 * 60 * 24)) * (1000 * 60 * 60 * 24)));
    message.channel.send(`You already claimed your daily! You can claim again after${msToString(remainingTime)}`);
  },
};
