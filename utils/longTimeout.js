const distance = 1000 * 60 * 60 * 24;

const longTimeout = (callback, duration) => {
  if (duration < distance) {
    setTimeout(callback(), duration);
  } else {
    setTimeout(longTimeout(callback, duration - distance), distance);
  }
};

module.exports = longTimeout;
