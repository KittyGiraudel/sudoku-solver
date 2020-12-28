const divide = require('./divide')
const range = require('./range')
const cache = new Map()

// Get an array of array of indices matching squares.
// @param {Number} length - Grid size
// @return {Number[][]}
const getSquareBoundaries = gridSize => {
  if (cache.has(gridSize)) return cache.get(gridSize)

  const boundaries = divide(
    range(gridSize, i => i),
    Math.sqrt(gridSize)
  )

  cache.set(gridSize, boundaries)

  return boundaries
}

module.exports = getSquareBoundaries
