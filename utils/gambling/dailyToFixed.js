const helperTime = (time, cooldown) => time - (time % cooldown);

module.exports = helperTime;
