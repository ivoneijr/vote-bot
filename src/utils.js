const getRandomIntInclusive = (min = 1, max = 100000) => {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

module.exports = {
  getRandomIntInclusive
};
