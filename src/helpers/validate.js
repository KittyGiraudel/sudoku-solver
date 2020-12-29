const range = require('./range')
const getSquareBoundaries = require('./getSquareBoundaries')

const validate = grid => {
  const size = Math.sqrt(grid.size)
  const squareBoundaries = getSquareBoundaries(size)
  const read = coords => grid.get(coords[0] + ':' + coords[1])

  for (let i = 0; i < size; i++) {
    const row = range(size, col => [i, col])
      .map(read)
      .filter(Boolean)

    if (new Set(row).size !== row.length)
      throw new Error(`Row #${i + 1} has an error.`)

    const col = range(size, row => [row, i])
      .map(read)
      .filter(Boolean)

    if (new Set(col).size !== col.length)
      throw new Error(`Column #${i + 1} has an error.`)
  }

  for (let i = 0; i < squareBoundaries.length; i++) {
    for (let j = 0; j < squareBoundaries.length; j++) {
      const square = squareBoundaries[i]
        .reduce(
          (acc, row) =>
            squareBoundaries[j].reduce(
              (acc, col) => acc.concat([[row, col]]),
              acc
            ),
          []
        )
        .map(read)
        .filter(Boolean)

      if (new Set(square).size !== square.length)
        throw new Error(`Square #${i + 1}/${j + 1} has an error.`)
    }
  }
}

module.exports = validate
