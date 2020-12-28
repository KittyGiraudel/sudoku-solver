const chunkify = require('./chunkify')
const cache = new Map()

const getSquareBoundaries = size => {
  if (cache.has(size)) return cache.get(size)

  const boundaries = chunkify(
    Array.from({ length: size }, (_, i) => i),
    Math.sqrt(size)
  )

  cache.set(size, boundaries)

  return boundaries
}

module.exports = getSquareBoundaries
