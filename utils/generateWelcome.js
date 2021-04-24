const Canvas = require('canvas');
const Discord = require('discord.js');

const generateWelcome = async (user, guildname) => {
  Canvas.registerFont('fonts/Nexa Bold.otf', { family: 'NexaBold', style: 'Heavy', weight: 'Normal' });
  const canvas = Canvas.createCanvas(1024, 500);
  const ctx = canvas.getContext('2d');

  const background = await Canvas.loadImage('img/welcome.png');
  ctx.drawImage(background, 0, 0, canvas.width, canvas.height);

  // Print name
  ctx.font = '80px NexaBold';
  ctx.fillStyle = '#ffffff';
  ctx.shadowOffsetX = 5;
  ctx.shadowOffsetY = 5;
  ctx.shadowBlur = 5;
  ctx.shadowColor = 'rgba(0, 0, 0, 0.8)';
  ctx.textAlign = 'center';
  ctx.fillText('WELCOME', 512, 380);
  ctx.font = '42px NexaBold';
  ctx.fillText(`${user.username}#${user.discriminator}`, 512, 430);
  ctx.font = '28px NexaBold';
  ctx.fillText(`TO ${guildname}`, 512, 474);

  const profileX = 387;
  const profileY = 50;
  const profileHeight = 250;
  const profileWidth = 250;

  ctx.beginPath();
  ctx.arc(profileX + profileWidth / 2, profileY + profileHeight / 2, profileWidth / 2, 0, Math.PI * 2, true);
  ctx.closePath();
  ctx.clip();

  const avatar = await Canvas.loadImage(user.displayAvatarURL({ format: 'jpg' }));
  ctx.drawImage(avatar, profileX, profileY, profileWidth, profileHeight);

  const attachment = new Discord.MessageAttachment(canvas.toBuffer(), 'welcome-image.png');

  return attachment;
};

module.exports = generateWelcome;
