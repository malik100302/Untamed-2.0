const Canvas = require('canvas');
const Discord = require('discord.js');
const msToStringProfile = require('../../utils/msToStringProfile');

module.exports = {
  name: 'profile',
  description: 'Print profile',
  aliases: ['p'],
  usage: 'profile',
  admin: false,
  execute: async (client, message, config) => {
    const userdata = await client.db.userdata.findOne({ id: message.author.id }) || {
      exp: 0,
      coins: 0,
      voice: 0,
    };
    if (userdata) {
      const reference = config.levels.findIndex((level) => level > userdata.exp) || 0;
      const currentExp = userdata.exp - config.levels[reference - 1] || userdata.exp;
      const currentLevel = reference;
      const requiredExp = config.levels[reference] - config.levels[reference - 1] || config.levels[reference];
      const expPercent = (((currentExp / requiredExp) * 100) || 0).toFixed(2);

      Canvas.registerFont('fonts/HYWenHei.ttf', { family: 'HYWenHei', style: 'Heavy', weight: 'Normal' });
      Canvas.registerFont('fonts/Century Gothic.ttf', { family: 'Century Gothic', style: 'Normal', weight: 'Normal' });
      Canvas.registerFont('fonts/Intro.otf', { family: 'Intro', style: 'Normal', weight: 'Normal' });
      Canvas.registerFont('fonts/Nexa Bold.otf', { family: 'Nexa Bold', style: 'Normal', weight: 'Normal' });
      const canvas = Canvas.createCanvas(2000, 2000);
      const ctx = canvas.getContext('2d');

      let background;
      if (userdata.banner !== undefined) {
        background = await Canvas.loadImage(`img/banners/banner${userdata.banner}.png`);
        const multiplier = canvas.width / background.width;
        const bannerWidth = background.width * multiplier;
        const bannerHeight = background.height * multiplier;
        const offset = -1 * ((bannerHeight - 600) / 2);
        ctx.drawImage(background, 0, offset, bannerWidth, bannerHeight);
      }

      background = await Canvas.loadImage('img/profile_overlay.png');
      ctx.drawImage(background, 0, 0, canvas.width, canvas.height);

      background = await Canvas.loadImage('img/gradient1.png');
      ctx.drawImage(background, 182, 1440, 1673 * (currentExp / requiredExp), 130);

      // Print name
      ctx.textAlign = 'center';
      ctx.font = '129.58px Century Gothic';
      ctx.fillStyle = 'rgb(255, 255, 255)';
      ctx.shadowOffsetX = 2;
      ctx.shadowOffsetY = 2;
      ctx.shadowColor = 'rgba(0, 0, 0, 0.5)';
      ctx.fillText(message.author.username, 980, 1180);

      // Print discriminator
      ctx.font = '71.55px Century Gothic';
      ctx.fillText(`#${message.author.discriminator}`, 980, 1300);

      // Print exp before
      ctx.textAlign = 'left';
      ctx.font = '55px Intro';
      ctx.fillText(config.levels[reference - 1] || 0, 190, 1418);

      // Print exp after
      ctx.textAlign = 'right';
      ctx.font = '55px Intro';
      ctx.fillText(config.levels[reference] || 0, 1844, 1418);

      // Print exp %
      ctx.textAlign = 'center';
      ctx.font = '89px Nexa Bold';
      ctx.fillText(`${expPercent}%`, 1000, 1536);

      // Print coins
      ctx.textAlign = 'center';
      ctx.font = '84.35px Century Gothic';
      ctx.fillText(`${userdata.coins}`, 427, 1697);

      // Print level
      ctx.fillText(`${currentLevel || 0}`, 1016, 1697);

      // Print bank
      ctx.fillText(`${userdata.bank || 0}`, 1591, 1697);

      ctx.beginPath();
      ctx.arc(984, 733, 300, 0, Math.PI * 2, true);
      ctx.closePath();
      ctx.clip();

      const avatar = await Canvas.loadImage(message.member.user.displayAvatarURL({ format: 'jpg' }));
      ctx.drawImage(avatar, 684, 433, 600, 600);

      const attachment = new Discord.MessageAttachment(canvas.toBuffer(), 'welcome-image.png');

      message.channel.send(`Here is your profile, ${message.member}!`, attachment);
    } else {
      message.channel.send('You do not have a profile yet!');
    }
  },
};
