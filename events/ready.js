const lt = require('long-timeout');
const { MessageEmbed } = require('discord.js');
const voiceExp = require('../utils/voice/voiceExp');
const mongoUtil = require('../mongoUtil.js');
const resumeMute = require('../utils/resume/resumeMute');
const resumeBan = require('../utils/resume/resumeBan');
const resumeGiveaways = require('../utils/resume/resumeGiveaways');
const resumeServerStats = require('../utils/resume/resumeServerStats');
const resumeLeaderboards = require('../utils/resume/resumeLeaderboards');
const fetchGuildConfigs = require('../utils/fetchGuildConfigs');
const {
  lotterysmallbase, lotterymediumbase, lotterylargebase, lotterysmallprice, lotterymediumprice, lotterylargeprice,
} = require('../config');

module.exports = async (client) => {
  await mongoUtil.connectDB(client);

  client.reactrolelocal = await client.db.reactrole.find().toArray();
  client.guildConfig = {};
  client.mutes = {};
  client.bans = {};
  client.giveaways = {};
  client.leaderboards = {};

  await fetchGuildConfigs(client);
  await resumeMute(client);
  await resumeBan(client);
  await resumeGiveaways(client);
  await resumeServerStats(client);
  await resumeLeaderboards(client);
  await voiceExp(client);

  const last = new Date();
  const remainingTimeDaily = (1000 * 60 * 60 * 24) - (last.getTime() - (Math.floor((last.getTime()) / (1000 * 60 * 60 * 24)) * (1000 * 60 * 60 * 24)));
  const dailyReset = (time) => lt.setTimeout(() => {
    client.db.userdata.updateMany({}, {
      $set: {
        daily: 0,
      },
    });
    dailyReset(1000 * 60 * 60 * 24);
  }, time);

  const lotteryChannel = client.channels.cache.get('833203375846850600');
  if (lotteryChannel) {
    console.log('Lottery Started!');
    const startLottery = (time) => setTimeout(async () => {
      const smallLottery = await client.db.lotterysmall.find().toArray();
      const mediumLottery = await client.db.lotterymedium.find().toArray();
      const largeLottery = await client.db.lotterylarge.find().toArray();

      const smallWinnerID = smallLottery[Math.floor(Math.random() * smallLottery.length)];
      const mediumWinnerID = mediumLottery[Math.floor(Math.random() * mediumLottery.length)];
      const largeWinnerID = largeLottery[Math.floor(Math.random() * largeLottery.length)];

      const smallWinner = client.users.cache.get(smallWinnerID.id);
      const mediumWinner = client.users.cache.get(mediumWinnerID.id);
      const largeWinner = client.users.cache.get(largeWinnerID.id);

      const embed = new MessageEmbed()
        .setTitle('Lottery Results')
        .addField('Small Lottery', `> Winner: ${smallWinner || smallWinnerID.id} Rubies\n> Entries: ${smallLottery.length}\n> Prize: ${lotterysmallbase + lotterysmallprice * smallLottery.length} Rubies`)
        .addField('Medium Lottery', `> Winner: ${mediumWinner || mediumWinnerID.id} Rubies\n> Entries: ${mediumLottery.length}\n> Prize: ${lotterymediumbase + lotterymediumprice * mediumLottery.length} Rubies`)
        .addField('Large Lottery', `> Winner: ${largeWinner || largeWinnerID.id} Rubies\n> Entries: ${largeLottery.length}\n> Prize: ${lotterylargebase + lotterylargeprice * largeLottery.length} Rubies`);

      lotteryChannel.send(embed);

      client.db.userdata.updateOne({ id: smallWinnerID }, {
        $inc: {
          coins: lotterysmallbase + lotterysmallprice * smallLottery.length,
        },
      });

      client.db.userdata.updateOne({ id: mediumWinnerID }, {
        $inc: {
          coins: lotterymediumbase + lotterymediumprice * mediumLottery.length,
        },
      });

      client.db.userdata.updateOne({ id: largeWinnerID }, {
        $inc: {
          coins: lotterylargebase + lotterylargeprice * largeLottery.length,
        },
      });

      startLottery(1000 * 60 * 60 * 10);
    }, time);

    const initialTime = (1000 * 60 * 60 * 10) - (Date.now() - Math.floor(Date.now() / (1000 * 60 * 60 * 10)) * (1000 * 60 * 60 * 10));
    startLottery(initialTime);
  }

  await dailyReset(remainingTimeDaily);

  client.ready = true;
  console.log('Bot is Ready');
};
