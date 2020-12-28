// Execute given callback on an array of numbers of the given length.
// @param {Number} length - Array length
// @param {Function} callback - Function to execute
// @return {*[]}
const range = (length, callback) =>
  Array.from({ length }, (_, i) => callback(i))

module.exports = range
