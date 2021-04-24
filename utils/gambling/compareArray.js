const compareArray = (arr1, arr2) => {
  const quantity = arr1.length;
  if (quantity !== arr2.length) { return false; }
  for (let i = 0; i < quantity; i++) {
    if (arr1[i] !== arr2[i]) {
      return false;
    }
  }
  return true;
};

module.exports = compareArray;
