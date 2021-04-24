/* eslint-disable no-restricted-syntax */
const Canvas = require('canvas');
const Discord = require('discord.js');

module.exports = async (client, page, top) => {
  Canvas.registerFont('fonts/Nexa Bold.otf', { family: 'NexaBold', style: 'Heavy', weight: 'Normal' });
  const canvas = Canvas.createCanvas(589, 916);
  const ctx = canvas.getContext('2d');

  let background = await Canvas.loadImage('img/leaderboards/leaderboardsbg1.png');
  ctx.drawImage(background, 0, 0, canvas.width, canvas.height);

  background = await Canvas.loadImage('img/leaderboards/leaderboards1.png');
  ctx.drawImage(background, 0, 0, canvas.width, canvas.height);

  let i = 0;

  for (const user of top) {
    const currentUser = client.users.cache.get(user.id);

    // Print Name
    ctx.font = '32px NexaBold';
    ctx.fillStyle = 'rgb(236, 229, 216)';
    ctx.fillText(currentUser ? currentUser.tag : 'Member Left', 147, 154 + i * 78.2);

    // Print Exp
    ctx.font = '20px NexaBold';
    ctx.fillStyle = 'rgb(236, 229, 216)';
    ctx.fillText(`${user.exp} EXP`, 147, 184 + i * 78.2);

    // Print Rank
    ctx.font = '34px NexaBold';
    ctx.fillStyle = 'rgb(39, 39, 39)';
    ctx.fillText(`#${i + 1 + page * 10}`, 30, 170 + i * 78.2);

    i += 1;
  }
  const attachment = new Discord.MessageAttachment(canvas.toBuffer(), 'welcome-image.png');
  return attachment;
};
