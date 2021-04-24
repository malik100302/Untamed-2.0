const msToString = require('../../utils/msToString');

module.exports = {
  name: 'weekly',
  description: 'weekly',
  aliases: [],
  usage: 'weekly',
  admin: false,
  execute: async (client, message) => {
    const user = await client.db.userdata.findOne({ id: message.author.id });
    if (!user) {
      await client.db.userdata.updateOne({ id: message.author.id }, { $inc: { weekly: 1, coins: 5000 } }, { upsert: true });
      message.channel.send('✅ You have claimed your weekly 5000 coins!');
      return;
    }
    if (!user.weekly) {
      await client.db.userdata.updateOne({ id: message.author.id }, { $inc: { weekly: 1, coins: 5000 } }, { upsert: true });
      message.channel.send('✅ You have claimed your weekly 5000 coins!');
      return;
    }
    const lastDaily = new Date();
    const remainingTime = (1000 * 60 * 60 * 24 * 7) - (lastDaily.getTime() - (Math.floor((lastDaily.getTime()) / (1000 * 60 * 60 * 24 * 7)) * (1000 * 60 * 60 * 24 * 7)));
    message.channel.send(`You already claimed your weekly! You can claim again after${msToString(remainingTime)}`);
  },
};
