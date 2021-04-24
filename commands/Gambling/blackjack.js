/* eslint-disable no-plusplus */
/* eslint-disable max-len */
/* eslint-disable prefer-destructuring */
/* eslint-disable no-restricted-globals */
/* eslint-disable no-await-in-loop */

const { MessageEmbed } = require('discord.js');
const generateCard = require('../../utils/gambling/generateCard');

const cards = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K']

const getBlackjackValue = (hand) => {
  let value = 0;
  let aces = 0;
  hand.forEach((item) => {
    if (item[1] <= 10) {
      value += item[1];
      if (item[1] === 1) {
        aces += 1;
      }
    } else if (item[1] > 10) {
      value += 10;
    }
  });
  while (aces > 0 && value <= 11) {
    value += 10;
    aces--;
  }
  return value;
};

module.exports = {
  name: 'blackjack',
  description: 'blackjack',
  aliases: ['bj'],
  usage: 'blackjack <amount>',
  admin: false,
  execute: async (client, message) => {
    let fold = 0;
    let amountChange = 0;
    const userdata = await client.db.userdata.findOne({ id: message.author.id });
    const msgArr = message.content.split(' ');
    if (isNaN(msgArr[1])) {
      message.channel.send('Enter a valid amount to blackjack');
      return;
    }
    let amount = parseInt(msgArr[1], 10);
    if (isNaN(amount)) {
      message.channel.send('Enter a valid amount to blackjack');
      return;
    }
    if (userdata) {
      if (userdata.coins < amount) {
        message.channel.send(`You only have ${userdata.coins} rubies!`);
        return;
      } if (amount < 0) {
        message.channel.send('Minimum blackjack amount is 0 rubies!');
        return;
      }

      // BLACK JACK PART
      const playerHand = [];
      const dealerHand = [];

      playerHand.push(generateCard(playerHand));
      playerHand.push(generateCard(playerHand));
      dealerHand.push(generateCard(dealerHand));
      dealerHand.push(generateCard(dealerHand));

      while (getBlackjackValue(dealerHand) < 17) {
        dealerHand.push(generateCard(dealerHand));
      }

      let promptMessage;
      while (getBlackjackValue(playerHand) < 21) {
        const embedMessage = new MessageEmbed()
          .setTitle('Blackjack')
          .setColor('#ffff88')
          .addField('Your hand', `${playerHand.map((item) => `${cards[item[1]]} ${item[0]}`).join(', ')}\nTotal: **${getBlackjackValue(playerHand)}**`)
          .addField('Dealer hand', `${dealerHand.slice(0, 1).map((item) => `${cards[item[1]]} ${item[0]}`).join(', ')}\nTotal: **${getBlackjackValue(dealerHand.slice(0, 1))}**`)
          .addField('Commands', '🎯 | **stand** to see dealers cards\n🖐️ | **hit** draw another card')
          .setFooter('You have 90 seconds');

        if (!promptMessage) promptMessage = await message.channel.send(embedMessage);
        else promptMessage.edit(embedMessage);
        promptMessage.react('🎯')
        promptMessage.react('🖐️')

        const filter = (r, u) => {
          const isAuthor = u.id === message.author.id;
          const isCommand = r.emoji.name === '🎯' || r.emoji.name === '🖐️';
          if (isAuthor && isCommand) {
            r.users.remove(u.id)
            return true;
          }
          return false;
        };
        const collected = await promptMessage.awaitReactions(filter, {
          max: 1,
          time: 1000 * 90,
        });
        const response = collected.first();
        if (response.emoji.name === '🎯') {
          break;
        } else if (response.emoji.name === '🖐️') {
          playerHand.push(generateCard(playerHand));
        }
      }
      const playerValue = getBlackjackValue(playerHand);
      const dealerValue = getBlackjackValue(dealerHand);
      if (fold === 1) {
        const embedMessage = new MessageEmbed()
          .setTitle('Blackjack (You Folded)')
          .setColor('#ff8888')
          .addField('Your hand', `${playerHand.map((item) => `${cards[item[1]]} ${item[0]}`).join(', ')}\nTotal: **${playerValue}**`)
          .addField('Dealer hand', `${dealerHand.map((item) => `${cards[item[1]]} ${item[0]}`).join(', ')}\nTotal: **${dealerValue}**`)
          .addField('Profit', `-${Math.ceil(amount / 2)} rubies`)
          .addField('Rubies', `${userdata.coins - Math.ceil(amount / 2)} rubies`);
        message.channel.send(embedMessage);
        amountChange = Math.ceil(amount / 2) * -1;
      } else if (playerValue > 21) {
        const embedMessage = new MessageEmbed()
          .setTitle('Blackjack (You Bust)')
          .setColor('#ff8888')
          .addField('Your hand', `${playerHand.map((item) => `${cards[item[1]]} ${item[0]}`).join(', ')}\nTotal: **${playerValue}**`)
          .addField('Dealer hand', `${dealerHand.map((item) => `${cards[item[1]]} ${item[0]}`).join(', ')}\nTotal: **${dealerValue}**`)
          .addField('Profit', `-${amount} rubies`)
          .addField('Rubies', `${userdata.coins - amount} rubies`);
        message.channel.send(embedMessage);
        amountChange = amount * -1;
      } else if (dealerValue > 21) {
        const embedMessage = new MessageEmbed()
          .setTitle('Blackjack (You Won)')
          .setColor('#88ff88')
          .addField('Your hand', `${playerHand.map((item) => `${cards[item[1]]} ${item[0]}`).join(', ')}\nTotal: **${playerValue}**`)
          .addField('Dealer hand', `${dealerHand.map((item) => `${cards[item[1]]} ${item[0]}`).join(', ')}\nTotal: **${dealerValue}**`)
          .addField('Profit', `${amount} rubies`)
          .addField('Rubies', `${userdata.coins + amount} rubies`);
        message.channel.send(embedMessage);
        amountChange = amount;
      } else if (playerValue > dealerValue) {
        const embedMessage = new MessageEmbed()
          .setTitle('Blackjack (You Won)')
          .setColor('#88ff88')
          .addField('Your hand', `${playerHand.map((item) => `${cards[item[1]]} ${item[0]}`).join(', ')}\nTotal: **${playerValue}**`)
          .addField('Dealer hand', `${dealerHand.map((item) => `${cards[item[1]]} ${item[0]}`).join(', ')}\nTotal: **${dealerValue}**`)
          .addField('Profit', `${amount} rubies`)
          .addField('Rubies', `${userdata.coins + amount} rubies`);
        message.channel.send(embedMessage);
        amountChange = amount;
      } else if (playerValue === dealerValue) {
        const embedMessage = new MessageEmbed()
          .setTitle('Blackjack (Draw)')
          .setColor('#ffff88')
          .addField('Your hand', `${playerHand.map((item) => `${cards[item[1]]} ${item[0]}`).join(', ')}\nTotal: **${playerValue}**`)
          .addField('Dealer hand', `${dealerHand.map((item) => `${cards[item[1]]} ${item[0]}`).join(', ')}\nTotal: **${dealerValue}**`)
          .addField('Profit', '0 rubies')
          .addField('Rubies', `${userdata.coins} rubies`);
        message.channel.send(embedMessage);
        amountChange = 0;
      } else {
        const embedMessage = new MessageEmbed()
          .setTitle('Blackjack (You Lost)')
          .setColor('#ff8888')
          .addField('Your hand', `${playerHand.map((item) => `${cards[item[1]]} ${item[0]}`).join(', ')}\nTotal: **${playerValue}**`)
          .addField('Dealer hand', `${dealerHand.map((item) => `${cards[item[1]]} ${item[0]}`).join(', ')}\nTotal: **${dealerValue}**`)
          .addField('Profit', `-${amount} rubies`)
          .addField('Rubies', `${userdata.coins - amount} rubies`);
        message.channel.send(embedMessage);
        amountChange = amount * -1;
      }
      if (amountChange !== 0) { await client.db.userdata.updateOne({ id: message.author.id }, { $inc: { coins: amountChange } }, { upsert: true }); }
    } else {
      message.channel.send('You do not have a profile yet!');
    }
  },
};
