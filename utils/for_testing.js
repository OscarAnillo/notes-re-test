const reverse = (str) => {
  return str.split("").reverse().join("");
};

const average = (arr) => {
  if (arr.length === 0) return 0;
  return arr.reduce((a, b) => a + b, 0) / arr.length;
};

module.exports = {
  reverse,
  average,
};
