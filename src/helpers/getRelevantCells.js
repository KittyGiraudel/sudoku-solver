const range = require('../helpers/range')
const getSquareBoundaries = require('../helpers/getSquareBoundaries')

const getRowCoords = (row, gridSize) => {
  return range(gridSize, i => [row, i])
}

const getColCoords = (col, gridSize) => {
  return range(gridSize, i => [i, col])
}

const getSquareCoords = (row, col, gridSize) => {
  const squareBoundaries = getSquareBoundaries(gridSize)
  const cols = squareBoundaries.find(cols => cols.includes(col))
  const rows = squareBoundaries.find(rows => rows.includes(row))

  return rows.reduce(
    (acc, row) => cols.reduce((acc, col) => acc.concat([[row, col]]), acc),
    []
  )
}

const getRelevantCells = (row, col, gridSize) =>
  [
    ...getRowCoords(row, gridSize),
    ...getColCoords(col, gridSize),
    ...getSquareCoords(row, col, gridSize),
  ].filter(coords => !(coords[0] === row && coords[1] === col))

module.exports = getRelevantCells
