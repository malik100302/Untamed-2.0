/* eslint-disable max-len */
/* eslint-disable prefer-destructuring */
/* eslint-disable no-restricted-globals */
/* eslint-disable no-await-in-loop */

module.exports = {
  name: 'coinflip',
  description: 'coinflip',
  aliases: ['cf', 'flip'],
  usage: 'coinflip h/t <amount>',
  admin: false,
  execute: async (client, message) => {
    const userdata = await client.db.userdata.findOne({ id: message.author.id });
    const msgArr = message.content.split(' ');
    if (!(msgArr[1].toLowerCase() === 'h' || msgArr[1].toLowerCase() === 't')) {
      message.channel.send('Kindly indicate whether you\'re flipping heads (h) or tails (t)');
      return;
    }
    let choice = 'Heads'
    let win = 'Heads'
    let lose = 'Tails'
    if (msgArr[1].toLowerCase() === 'h') {
      choice = 'Tails'
      win = 'Tails'
      lose = 'Heads'
    }
    if (isNaN(msgArr[2])) {
      message.channel.send('Enter a valid amount to flip');
      return;
    }
    const flipAmount = parseInt(msgArr[2], 10);
    if (isNaN(flipAmount)) {
      message.channel.send('Enter a valid amount to flip');
      return;
    }
    if (userdata) {
      if (userdata.coins < flipAmount) {
        message.channel.send(`You only have ${userdata.coins} rubies!`);
        return;
      } if (flipAmount < 10) {
        message.channel.send('Minimum flip amount is 10 rubies!');
        return;
      }

      if (Math.random() <= 0.50) {
        message.channel.send(`✅ ${message.author} The outcome was **${win}**! You got ${flipAmount} 🪙 rubies!! You now have ${userdata.coins + flipAmount} 🪙 rubies!`);
        await client.db.userdata.updateOne({ id: message.author.id }, { $inc: { coins: flipAmount } }, { upsert: true });
      } else {
        message.channel.send(`❌ ${message.author} The outcome was **${lose}**! You lost ${flipAmount} 🪙 rubies!! You now only have ${userdata.coins - flipAmount} 🪙 rubies!`);
        await client.db.userdata.updateOne({ id: message.author.id }, { $inc: { coins: flipAmount * -1 } }, { upsert: true });
      }
    } else {
      message.channel.send('You do not have a profile yet!');
    }
  },
};
