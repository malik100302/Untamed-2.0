/* eslint-disable no-plusplus */
/* eslint-disable max-len */
/* eslint-disable prefer-destructuring */
/* eslint-disable no-restricted-globals */
/* eslint-disable no-await-in-loop */

const { MessageEmbed } = require('discord.js');
const generateCard = require('../../utils/gambling/generateCard');

const numberEmoji = ['1⃣', '2⃣', '3⃣', '4⃣', '5⃣', '6⃣', '7⃣'];

const hasTwoPairs = (hand) => {
  let pairs = 0;
  const marker = [0, 0, 0, 0, 0];
  for (let i = 0; i < hand.length; i++) {
    if (marker[i] === 0) {
      const currentHand = hand[i][1];
      for (let j = i + 1; j < hand.length; j++) {
        if (hand[j][1] === currentHand && marker[j] === 0) {
          pairs++;
          marker[i] = 1;
          marker[j] = 1;
          if (pairs === 2) return true;
        }
      }
    }
  }
  return false;
};

const hasThrees = (hand) => {
  for (let i = 0; i < hand.length; i++) {
    const currentHand = hand[i][1];
    for (let j = i + 1; j < hand.length; j++) {
      if (hand[j][1] === currentHand) {
        for (let k = j + 1; k < hand.length; k++) {
          if (hand[k][1] === currentHand) {
            return true;
          }
        }
      }
    }
  }
  return false;
};

const hasFours = (hand) => {
  for (let i = 0; i < hand.length; i++) {
    const currentHand = hand[i][1];
    for (let j = i + 1; j < hand.length; j++) {
      if (hand[j][1] === currentHand) {
        for (let k = j + 1; k < hand.length; k++) {
          if (hand[k][1] === currentHand) {
            for (let l = k + 1; l < hand.length; l++) {
              if (hand[l][1] === currentHand) {
                return true;
              }
            }
          }
        }
      }
    }
  }
  return false;
};

const hasStraight = (hand) => {
  const cards = hand.map((item) => item[1]);
  const sortedCards = cards.sort((a, b) => a - b);
  if (cards.some((item) => item[1] === 1)) {
    if (cards.some((item) => item[1] === 10) && cards.some((item) => item[1] === 11) && cards.some((item) => item[1] === 12) && cards.some((item) => item[1] === 13)) {
      return true;
    }
  }
  for (let i = 0; i < hand.length - 1; i++) {
    if (sortedCards[i] !== sortedCards[i + 1] - 1) {
      return false;
    }
  }
  return true;
};

const hasFlush = (hand) => {
  for (let i = 0; i < hand.length - 2; i++) {
    if (hand[i][0] !== hand[i + 1][0]) {
      return false;
    }
  }
  return true;
};

const hasRoyalFlush = (hand) => {
  const cards = hand.map((item) => item[1]);
  if (cards.some((item) => item[1] === 1)) {
    if (cards.some((item) => item[1] === 10) && cards.some((item) => item[1] === 11) && cards.some((item) => item[1] === 12) && cards.some((item) => item[1] === 13)) {
      if (hasFlush(hand)) {
        return true;
      }
    }
  }
  return false;
};

const hasFull = (hand) => {
  let triad = 0;
  const marker = [0, 0, 0, 0, 0];
  for (let i = 0; i < hand.length; i++) {
    if (marker[i] === 0) {
      const currentHand = hand[i][1];
      for (let j = i + 1; j < hand.length; j++) {
        if (hand[j][1] === currentHand && marker[j] === 0) {
          for (let k = j + 1; k < hand.length; k++) {
            if (hand[k][1] === currentHand && marker[k] === 0) {
              marker[i] = 1;
              marker[j] = 1;
              marker[k] = 1;
              triad = 1;
            }
          }
        }
      }
    }
  }
  if (triad) {
    const firstNumberIndex = marker.findIndex((item) => item === 0);
    marker[firstNumberIndex] = 1;
    const secondNumberIndex = marker.findIndex((item) => item === 0);
    if (hand[firstNumberIndex][1] === hand[secondNumberIndex][1]) {
      return true;
    }
  }
  return false;
};

module.exports = {
  name: 'poker',
  description: 'poker',
  aliases: [],
  usage: 'poker <amount>',
  admin: false,
  execute: async (client, message) => {
    const userdata = await client.db.userdata.findOne({ id: message.author.id });
    const msgArr = message.content.split(' ');
    if (isNaN(msgArr[1])) {
      message.channel.send('Enter a valid amount to poker');
      return;
    }
    const amount = parseInt(msgArr[1], 10);
    if (isNaN(amount)) {
      message.channel.send('Enter a valid amount to poker');
      return;
    }
    if (userdata) {
      if (userdata.coins < amount) {
        message.channel.send(`You only have ${userdata.coins} rubies!`);
        return;
      } if (amount < 0) {
        message.channel.send('Minimum poker amount is 0 rubies!');
        return;
      }

      // POKER PART
      const playerHand = [generateCard([])];
      for (let i = 0; i < 4; i++) {
        playerHand.push(generateCard(playerHand));
      }

      const embedMessage = new MessageEmbed()
        .setTitle('Poker')
        .setColor('#ffff88')
        .addField('Current hand', `${playerHand.map((item) => `${item[1]} ${item[0]}`).join(', ')}`, true)
        .addField('Commands', '**!draw** to see if you won\n**Lock** Use reactions to lock the card')
        .setFooter('You have 90 seconds');

      const promptMessage = await message.channel.send(embedMessage);
      await promptMessage.react(numberEmoji[0]);
      await promptMessage.react(numberEmoji[1]);
      await promptMessage.react(numberEmoji[2]);
      await promptMessage.react(numberEmoji[3]);
      await promptMessage.react(numberEmoji[4]);

      const filter = (m) => {
        if (m.author.id === message.author.id && m.content.toLowerCase() === '!draw') return true;
        return false;
      };

      await message.channel.awaitMessages(filter, {
        max: 1,
        time: 1000 * 90,
      });

      for (let i = 0; i < 5; i++) {
        if (promptMessage.reactions.cache.get(numberEmoji[i])) {
          if (!promptMessage.reactions.cache.get(numberEmoji[i]).users.cache.get(message.author.id)) {
            playerHand[i] = generateCard(playerHand);
          }
        }
      }

      let reward = 0;
      let rewardType = '';

      const isRoyalFlush = hasRoyalFlush(playerHand);
      const isStraight = hasStraight(playerHand);
      const isFlush = hasFlush(playerHand);
      const isFours = hasFours(playerHand);
      const isFull = hasFull(playerHand);
      const isThrees = hasThrees(playerHand);
      const isTwoPairs = hasTwoPairs(playerHand);

      if (isRoyalFlush) {
        reward = (amount * 100);
        rewardType = 'Royal Flush';
      } else if (isStraight && isFlush) {
        reward = (amount * 50);
        rewardType = 'Straight Flush';
      } else if (isFours) {
        reward = (amount * 7);
        rewardType = 'Four of a Kind';
      } else if (isFull) {
        reward = (amount * 5);
        rewardType = 'Full House';
      } else if (isFlush) {
        reward = (amount * 4.5);
        rewardType = 'Flush';
      } else if (isStraight) {
        reward = (amount * 4);
        rewardType = 'Straight';
      } else if (isThrees) {
        reward = (amount * 2.5);
        rewardType = 'Three of a Kind';
      } else if (isTwoPairs) {
        reward = (amount * 2);
        rewardType = 'Two Pairs';
      }

      if (rewardType !== '') {
        const rewardMessage = new MessageEmbed()
          .setTitle('Poker')
          .setColor('#88ff88')
          .addField('Current hand', `${playerHand.map((item) => `${item[1]} ${item[0]}`).join(', ')}`)
          .addField(`You won! (${rewardType})`, `You won ${reward.toFixed(2)} rubies`)
          .addField('Credits', `You have ${userdata.coins + reward} rubies`);
        message.channel.send(rewardMessage);
        await client.db.userdata.updateOne({ id: message.author.id }, { $inc: { coins: reward } }, { upsert: true });
      } else {
        const rewardMessage = new MessageEmbed()
          .setTitle('Poker')
          .setColor('#ff8888')
          .addField('Current hand', `${playerHand.map((item) => `${item[1]} ${item[0]}`).join(', ')}`)
          .addField('You lost!', `You lost ${reward} rubies`)
          .addField('Credits', `You have ${userdata.coins - amount} rubies`);
        message.channel.send(rewardMessage);
        await client.db.userdata.updateOne({ id: message.author.id }, { $inc: { coins: amount * -1 } }, { upsert: true });
      }
    } else {
      message.channel.send('You do not have a profile yet!');
    }
  },
};
