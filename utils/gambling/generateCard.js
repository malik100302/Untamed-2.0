/* eslint-disable no-loop-func */
/* eslint-disable max-len */
/* eslint-disable linebreak-style */
const suits = ['♥️', '♦️', '♣️', '♠️'];
const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13];

module.exports = (hand) => {
  let newCard = [suits[Math.floor(Math.random() * suits.length)], numbers[Math.floor(Math.random() * numbers.length)]];
  while (hand.find((item) => item[0] === newCard[0] && item[1] === newCard[1])) {
    newCard = [suits[Math.floor(Math.random() * suits.length)], numbers[Math.floor(Math.random() * numbers.length)]];
  }
  return newCard;
};
