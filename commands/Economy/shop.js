/* eslint-disable no-await-in-loop */
/* eslint-disable no-constant-condition */
const { MessageEmbed } = require('discord.js');
const fs = require('fs')

let banners;

fs.readdir('img/banners', (err, files) => {
  banners = files;
})

module.exports = {
  name: 'shop',
  description: 'shop',
  aliases: [],
  usage: 'shop',
  admin: true,
  execute: async (client, message) => {
    let index = 0;
    const embed = new MessageEmbed()
      .setDescription(`Background ${index + 1}/${banners.length}`)
      .setImage(`https://Bank-Bot.anigamiyt.repl.co/banners/${banners[index]}`)
      .setFooter('Price: 5000 💵');
    const shop = await message.channel.send(embed);
    await shop.react('⏪');
    await shop.react('◀️');
    await shop.react('💵');
    await shop.react('▶️');
    await shop.react('⏩');

    const filter = (r, u) => u.id === message.author.id;
    while (true) {
      const collected = await shop.awaitReactions((filter), {
        max: 1,
        time: 1000 * 300,
      });
      const reaction = collected.first();
      if (!reaction) {
        shop.delete();
        break;
      }
      if (reaction.emoji.name === '⏪') {
        index = 0;
        embed
          .setDescription(`Background ${index + 1}/${banners.length}`)
      .setImage(`https://Bank-Bot.anigamiyt.repl.co/banners/${banners[index]}`)
        shop.edit(embed);
      } else if (reaction.emoji.name === '◀️' && index > 0) {
        index -= 1;
        embed
          .setDescription(`Background ${index + 1}/${banners.length}`)
      .setImage(`https://Bank-Bot.anigamiyt.repl.co/banners/${banners[index]}`)
        shop.edit(embed);
      } else if (reaction.emoji.name === '▶️' && index < banners.length - 1) {
        index += 1;
        embed
          .setDescription(`Background ${index + 1}/${banners.length}`)
      .setImage(`https://Bank-Bot.anigamiyt.repl.co/banners/${banners[index]}`)
        shop.edit(embed);
      } else if (reaction.emoji.name === '⏩') {
        index = banners.length - 1;
        embed
          .setDescription(`Background ${index + 1}/${banners.length}`)
      .setImage(`https://Bank-Bot.anigamiyt.repl.co/banners/${banners[index]}`)
        shop.edit(embed);
      } else if (reaction.emoji.name === '💵') {
        shop.delete();
        const userdata = await client.db.userdata.findOne({ id: message.author.id });
        if (userdata.coins > 5000) {
          userdata.banner = index;
          message.channel.send(`${message.author}, You have successfully changed your banner!`);
          client.db.userdata.updateOne({ id: message.author.id },
            {
              $set: {
                banner: index,
              },
              $inc: {
                coins: -5000,
              },
            });
          return;
        }
        message.channel.send(`${message.author}, You don't have enought coins!!`);
        return;
      }
      reaction.users.remove(message.author.id);
    }
  },
};
