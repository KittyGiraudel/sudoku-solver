const getSquareBoundaries = require('./getSquareBoundaries')
const range = require('./range')

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
    const serialisedCoords = [this.row, this.col].join(':')

    return this.getRowCoords()
      .concat(this.getColCoords())
      .concat(this.getSquareCoords())
      .filter(coords => coords.join(':') !== serialisedCoords)
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

  toString() {
    return String(this.value || '')
  }
}

module.exports = Cell
