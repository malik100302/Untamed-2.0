module.exports = {
  name: 'rob',
  description: 'rob',
  aliases: [],
  cooldown: 1000 * 60 * 60 * 12,
  execute: async (client, message) => {
    const msgArr = message.content.split(' ');
    const target = message.mentions.members.first() || message.guild.members.cache.get(msgArr[1]);
    const userdata = await client.db.userdata.findOne({ id: message.author.id });
    if (!target) {
      message.channel.send('You should specify a valid user to rob!');
      return;
    }
    if (message.author.id === target.id) {
      message.channel.send('YOU CAN\'T ROB YOURSELF!');
      return;
    }
    const amount = 1000;
    if (userdata) {
      if (Math.random() < 0.6) {
        message.channel.send(`✅ ${message.author} YOU HAVE SUCCESSFULLY ROBBED ${amount} RUBIES FROM ${target}!`);
        await client.db.userdata.updateOne({ id: target.id }, { $inc: { coins: amount * -1 } }, { upsert: true });
        await client.db.userdata.updateOne({ id: message.author.id }, { $inc: { coins: amount } }, { upsert: true });
      } else {
        message.channel.send(`⛔ ${message.author} YOU FAILED TO ROB ${target} AND LOST ${amount} RUBIES!`);
        await client.db.userdata.updateOne({ id: message.author.id }, { $inc: { coins: amount * -1 } }, { upsert: true });
      }
    } else {
      message.channel.send('You do not have a profile yet!');
    }
    client.cooldowns[message.guild.id].rob[message.author.id] = Date.now();
  },
};
