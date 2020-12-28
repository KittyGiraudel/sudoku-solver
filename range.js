const range = (length, callback) =>
  Array.from({ length }, (_, i) => callback(i))

module.exports = range
