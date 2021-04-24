const helperTime = (ms) => {
  const DAYS_CONSTANT = 1000 * 60 * 60 * 24;
  const HOURS_CONSTANT = 1000 * 60 * 60;
  let totalMs = ms;
  const msg = [];

  let days = totalMs / DAYS_CONSTANT;
  if (days > 1) {
    days = Math.floor(days);
    totalMs -= days * DAYS_CONSTANT;
    msg.push(`${days}d`);
  }

  let hours = totalMs / HOURS_CONSTANT;
  if (hours > 1) {
    hours = Math.floor(hours);
    totalMs -= hours * HOURS_CONSTANT;
    msg.push(`${hours}h`);
  }
  return msg.join(' ');
};

module.exports = helperTime;
