const mapMessageType = {
  error: '\x1b[31m',
  success: '\x1b[32m',
  warning: '\x1b[33m',
  info: '\x1b[34m',
  default: '\x1b[37m',
};

const consoleWrite = (message = '', type = 'default') => {
  console.log(`${mapMessageType[type]}%s\x1b[0m`, message);
};

const exitScript = (message = 'Process ended unexpectedly', type = 'error') => {
  consoleWrite(message, type);
  process.exit(1);
};

const padTo2Digits = (num) => {
  return num.toString().padStart(2, '0');
};

const formatDate = (date) => {
  return (
    [
      date.getFullYear(),
      padTo2Digits(date.getMonth() + 1),
      padTo2Digits(date.getDate()),
    ].join('') +
    [
      padTo2Digits(date.getHours()),
      padTo2Digits(date.getMinutes()),
      padTo2Digits(date.getSeconds()),
    ].join('')
  );
};

module.exports = {
  mapMessageType,
  consoleWrite,
  exitScript,
  padTo2Digits,
  formatDate,
};
