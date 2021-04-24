/* eslint-disable max-len */
/* eslint-disable no-plusplus */
const cherry = {
  name: 'cherry',
  display: '🍒',
  points: 0.1,
  weight: 1,
};

const money = {
  name: 'money',
  display: '💰',
  points: 0.5,
  weight: 0.5,
};

const party = {
  name: 'party',
  display: '🎉',
  points: 0.2,
  weight: 0.5,
};

const gift = {
  name: 'gift',
  display: '🎁',
  points: 0.3,
  weight: 1,
};

const slotMachineItems = [cherry, money, party, gift];

const generateOutput = () => {
  const slotMachineOutput = [];
  let slotMachineMessage = '';
  let points = 0;
  for (let i = 0; i < 9; i++) {
    const randomResult = slotMachineItems[Math.floor(Math.random() * 4)];
    slotMachineOutput.push(randomResult);
    slotMachineMessage += `${randomResult.display} `;
    if ((i + 1) % 3 === 0 && i < 8) {
      slotMachineMessage += '\n---------------\n';
    } else if (i < 8) {
      slotMachineMessage += '| ';
    }
  }
  points += slotMachineOutput[3].points + slotMachineOutput[4].points + slotMachineOutput[5].points;
  if (slotMachineOutput[3].name === slotMachineOutput[4].name && slotMachineOutput[4].name === slotMachineOutput[5].name) {
    points += slotMachineOutput[3].weight;
  }
  return [slotMachineMessage, points];
};

module.exports = generateOutput;
