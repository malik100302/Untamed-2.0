/* eslint-disable max-len */
/* eslint-disable prefer-destructuring */
/* eslint-disable no-restricted-globals */
/* eslint-disable no-await-in-loop */

const { MessageEmbed } = require('discord.js');

module.exports = {
  name: 'roll',
  description: 'roll',
  aliases: [],
  usage: 'roll <amount>',
  admin: false,
  execute: async (client, message) => {
    const userdata = await client.db.userdata.findOne({ id: message.author.id });
    const msgArr = message.content.split(' ');
    const rollAmount = parseInt(msgArr[1], 10);
    if (isNaN(rollAmount)) {
      message.channel.send('Enter a valid amount to roll');
      return;
    }
    if (userdata) {
      if (userdata.coins < rollAmount) {
        message.channel.send(`You only have ${userdata.coins} rubies!`);
        return;
      } if (rollAmount < 10) {
        message.channel.send('Minimum roll amount is 10 rubies!');
        return;
      }

      const userRoll = Math.floor(Math.random() * 101);
      const botRoll = Math.floor(Math.random() * 101);

      if (userRoll > botRoll) {
        const embed = new MessageEmbed()
          .setAuthor('You\'ve won!', client.user.avatarURL())
          .setDescription(`${message.author} rolled a ${userRoll} and ${client.user} rolled a ${botRoll}`)
          .addField('Amount won', rollAmount)
          .addField('New balance', userdata.coins + rollAmount);
        message.channel.send(embed);
        await client.db.userdata.updateOne({ id: message.author.id }, { $inc: { coins: rollAmount } }, { upsert: true });
      } else if (botRoll > userRoll) {
        const embed = new MessageEmbed()
          .setAuthor('You\'ve lost!', client.user.avatarURL())
          .setDescription(`${message.author} rolled a ${userRoll} and ${client.user} rolled a ${botRoll}`)
          .addField('Amount lost', rollAmount)
          .addField('New balance', userdata.coins + rollAmount);
        message.channel.send(embed);
        await client.db.userdata.updateOne({ id: message.author.id }, { $inc: { coins: rollAmount * -1 } }, { upsert: true });
      } else {
        const embed = new MessageEmbed()
          .setAuthor('It\'s a draw!', client.user.avatarURL())
          .setDescription(`${message.author} rolled a ${userRoll} and ${client.user} rolled a ${botRoll}`);
        message.channel.send(embed);
      }
    } else {
      message.channel.send('You do not have a profile yet!');
    }
  },
};
