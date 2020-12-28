const getSquareBoundaries = require('../helpers/getSquareBoundaries')
const range = require('../helpers/range')

class Cell {
  constructor(row, col, gridSize, value) {
    this.value = String(value || '')
    this.row = row
    this.col = col
    this.gridSize = gridSize
    this.neighbours = this.getNeighbours()
  }

  getRowCoords() {
    return range(this.gridSize, i => [this.row, i])
  }

  getColCoords() {
    return range(this.gridSize, i => [i, this.col])
  }

  getSquareCoords() {
    const squareBoundaries = getSquareBoundaries(this.gridSize)
    const cols = squareBoundaries.find(cols => cols.includes(this.col))
    const rows = squareBoundaries.find(rows => rows.includes(this.row))

    return rows.reduce(
      (acc, row) => cols.reduce((acc, col) => acc.concat([[row, col]]), acc),
      []
    )
  }

  getNeighbours() {
    return [
      ...this.getRowCoords(),
      ...this.getColCoords(),
      ...this.getSquareCoords(),
    ].filter(([row, col]) => !(row === this.row && col === this.col))
  }

  set(value) {
    this.value = value
  }

  unset() {
    this.value = undefined
  }

  valueOf() {
    return this.value
  }
}

module.exports = Cell
