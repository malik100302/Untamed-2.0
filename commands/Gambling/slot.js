/* eslint-disable prefer-destructuring */
/* eslint-disable no-restricted-globals */
/* eslint-disable no-await-in-loop */

const { embed } = require('../../utils');
const slotMachine = require('../../utils/gambling/slotmachine');

module.exports = {
  name: 'slot',
  description: 'Gamble in Slotmachine',
  aliases: [],
  usage: 'slot <amount>',
  admin: false,
  execute: async (client, message) => {
    const msgArr = message.content.split(' ');
    const userdata = await client.db.userdata.findOne({ id: message.author.id });
    const amount = parseInt(msgArr[1], 10);
    if (isNaN(amount)) {
      message.channel.send('Enter a valid amount');
      return;
    }
    if (userdata) {
      if (userdata.coins >= amount) {
        const slotMachineResult = slotMachine();
        message.channel.send(embed(message, 'SLOT MACHINE', `${slotMachineResult[0]}\n\nYou spent ${amount} rubies to play\n__**You got ${(slotMachineResult[1] * amount).toFixed(2)} rubies!**__\n`));
        client.db.userdata.updateOne(
          { id: message.author.id },
          {
            $set: {
              coins: userdata.coins + ((slotMachineResult[1] * amount)) - amount,
            },
          },
          { upsert: true },
        );
        return;
      }
      message.channel.send(embed(message, 'SLOT MACHINE', 'You don\'t have enough rubies to play!'));
      return;
    }
    message.channel.send(embed(message, 'SLOT MACHINE', 'You don\'t have enough rubies to play!'));
  },
};
