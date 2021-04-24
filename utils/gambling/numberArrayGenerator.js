const numberArrayGenerator = (min, max, quantity) => {
  const arr = [];
  let i = 0;
  while (i < quantity) {
    const randNum = Math.floor((Math.random() * (max - min + 1)) + min);
    if (!arr.includes(randNum)) {
      arr.push(randNum);
      i++;
    }
  }
  return arr.sort((a, b) => a - b);
};

module.exports = numberArrayGenerator;
