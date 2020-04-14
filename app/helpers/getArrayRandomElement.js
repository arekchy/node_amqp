/**
 * returns random element from array
 * @param {*} arr - Array of any elements
 * @return {*|undefined} - random element from array
 */
const getArrayRandomElement = (arr) => {
  if (arr && arr.length) {
    return arr[Math.floor(Math.random() * arr.length)];
  }
};

module.exports = getArrayRandomElement;
