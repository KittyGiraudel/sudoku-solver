const range = require('./range')

// Divide an array into a series of array of the expect size.
// @param {*[]} array - Array to break down
// @param {Number} size - Expected length of arrays
// @return {*[][]}
const divide = (array = [], size = 1) => {
  const clone = array.slice(0)
  const length = Math.ceil(array.length / size)

  return range(length, () => clone.splice(0, size))
}

module.exports = divide
