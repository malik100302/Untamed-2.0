/* eslint-disable no-param-reassign */
/* eslint-disable max-len */
const { MongoClient } = require('mongodb');
const { mongodburi } = require('./config.js');
const config = require('./config');

const uri = mongodburi;
const mongoClient = new MongoClient(uri, { useNewUrlParser: true }, { autoIndex: false }, { useUnifiedTopology: true });

module.exports = {
  connectDB: async (client) => {
    await mongoClient.connect();
    client.db = {};
    client.db.warn = await mongoClient.db().collection(config.collection.warn);
    client.db.ban = await mongoClient.db().collection(config.collection.ban);
    client.db.mute = await mongoClient.db().collection(config.collection.mute);
    client.db.modstats = await mongoClient.db().collection(config.collection.modstats);
    client.db.config = await mongoClient.db().collection(config.collection.config);
    client.db.reactrole = await mongoClient.db().collection(config.collection.reactrole);
    client.db.giveaway = await mongoClient.db().collection(config.collection.giveaway);
    client.db.userdata = await mongoClient.db().collection(config.collection.userdata);
    client.db.userlogs = await mongoClient.db().collection(config.collection.userlogs);
    client.db.lotterysmall = await mongoClient.db().collection(config.collection.lotterysmall);
    client.db.lotterymedium = await mongoClient.db().collection(config.collection.lotterymedium);
    client.db.lotterylarge = await mongoClient.db().collection(config.collection.lotterylarge);
    console.log('mongoDB is now connected!');
    return mongoClient;
  },
};
