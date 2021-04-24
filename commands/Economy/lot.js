const { MessageEmbed } = require('discord.js');
const msToString = require('../../utils/msToString');
const {
  lotterysmallbase, lotterymediumbase, lotterylargebase, lotterysmallprice, lotterymediumprice, lotterylargeprice,
} = require('../../config');

module.exports = {
  name: 'lot',
  description: 'lot',
  aliases: [],
  usage: 'lot small/medium/large <amount>',
  admin: true,
  execute: async (client, message, config) => {
    if (!message.member.roles.cache.some((r) => config.permissions.moderation.includes(r.id) || message.member.hasPermission(['ADMINISTRATOR']))) { message.reply('You\'re not allowed to use this command!'); return; }
    const msgArr = message.content.split(' ');
    const type = msgArr[1] ? msgArr[1].toLowerCase() : null;
    const amount = parseInt(msgArr[2], 10);

    if (!(type === 'small' || type === 'medium' || type === 'large')) {
      const smallLottery = await client.db.lotterysmall.find().toArray();
      const mediumLottery = await client.db.lotterymedium.find().toArray();
      const largeLottery = await client.db.lotterylarge.find().toArray();
      const embed = new MessageEmbed()
        .setTitle('Lottery')
        .addField('Small Lottery', `> Cost: ${lotterysmallprice} Rubies\n> Entries: ${smallLottery.length}\n> Prize: ${lotterysmallbase + lotterysmallprice * smallLottery.length} Rubies`)
        .addField('Medium Lottery', `> Cost: ${lotterymediumprice} Rubies\n> Entries: ${mediumLottery.length}\n> Prize: ${lotterymediumbase + lotterymediumprice * mediumLottery.length} Rubies`)
        .addField('Large Lottery', `> Cost: ${lotterylargeprice} Rubies\n> Entries: ${largeLottery.length}\n> Prize: ${lotterylargebase + lotterylargeprice * largeLottery.length} Rubies`)
        .addField('Draw Time', `> ${msToString((1000 * 60 * 60 * 10) - (Date.now() - Math.floor(Date.now() / (1000 * 60 * 60 * 10)) * (1000 * 60 * 60 * 10)))}`);
      message.channel.send(embed);
      return;
    }

    if (isNaN(amount)) {
      message.channel.send('Enter a valid quantity of tickets you want to buy.');
      return;
    }

    if (amount < 1) {
      message.channel.send('Enter a valid quantity of tickets you want to buy.');
      return;
    }

    const userdata = await client.db.userdata.findOne({ id: message.author.id });
    if (!userdata) {
      message.channel.send('Not enough rubies.');
      return;
    }

    if (type === 'small') {
      if (userdata.coins < lotterysmallprice * amount) {
        message.channel.send('Not enough rubies.');
        return;
      }
      const entries = [];
      [...new Array(amount)].forEach(() => entries.push({ id: message.author.id }));
      message.channel.send(`You have successfully bought ${amount} tickets in ${type} lottery.`);
      client.db.lotterysmall.insertMany(entries);
      client.db.userdata.updateOne({ id: message.author.id }, {
        $inc: {
          coins: lotterysmallprice * amount * -1,
        },
      });
    }

    if (type === 'medium') {
      if (userdata.coins < lotterymediumprice * amount) {
        message.channel.send('Not enough rubies.');
        return;
      }
      const entries = [];
      [...new Array(amount)].forEach(() => entries.push({ id: message.author.id }));
      message.channel.send(`You have successfully bought ${amount} tickets in ${type} lottery.`);
      client.db.lotterymedium.insertMany(entries);
      client.db.userdata.updateOne({ id: message.author.id }, {
        $inc: {
          coins: lotterymediumprice * amount * -1,
        },
      });
    }

    if (type === 'large') {
      if (userdata.coins < lotterylargeprice * amount) {
        message.channel.send('Not enough rubies.');
        return;
      }
      const entries = [];
      [...new Array(amount)].forEach(() => entries.push({ id: message.author.id }));
      message.channel.send(`You have successfully bought ${amount} tickets in ${type} lottery.`);
      client.db.lotterylarge.insertMany(entries);
      client.db.userdata.updateOne({ id: message.author.id }, {
        $inc: {
          coins: lotterylargeprice * amount * -1,
        },
      });
    }
  },
};
