/* eslint-disable consistent-return */
/* eslint-disable max-len */
const fs = require('fs');

module.exports = {
  name: 'addrole',
  description: 'add shop role',
  aliases: [],
  usage: 'addrole <name> <cost>',
  admin: true,
  execute: async (client, message, config) => {
    if (!message.member.roles.cache.some((r) => config.permissions.moderation.includes(r.id) || message.member.hasPermission(['ADMINISTRATOR']))) { message.reply('You\'re not allowed to use this command!'); return; }

    const roles = require('../../constants/roles');

    const msgArr = message.content.split(' ');
    const name = msgArr[1];
    const cost = parseInt(msgArr[2], 10);

    if (!name) {
      message.channel.send('You must input the role name!');
      return;
    }
    if (isNaN(cost)) {
      message.channel.send('You must input a valid cost!');
      return;
    }

    const promptMessage = await message.channel.send('Kindly react the reaction you want to associate with this role');
    const filter = (r, u) => u.id === message.author.id;
    const collected = await promptMessage.awaitReactions(filter, {
      max: 1,
      time: 1000 * 60,
    });
    const newReaction = collected.first();
    if (!newReaction) {
      message.channel.send('Time out');
    }
    roles[name.toLowerCase()] = {
      name,
      cost,
      emoji: newReaction.emoji.name,
    };
    fs.writeFileSync('constants/roles.json', JSON.stringify(roles, null, 4));
    message.channel.send('Role has been added to shop!');
  },
};
