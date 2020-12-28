const getSquareBoundaries = require('../helpers/getSquareBoundaries')
const range = require('../helpers/range')

class Cell {
  #value = ''
  #row
  #col
  #gridSize
  #neighbours

  constructor(row, col, gridSize, value) {
    this.#value = String(value || '')
    this.#row = row
    this.#col = col
    this.#gridSize = gridSize
    this.#neighbours = [
      ...this.#getRowCoords(),
      ...this.#getColCoords(),
      ...this.#getSquareCoords(),
    ].filter(([row, col]) => !(row === this.#row && col === this.#col))

    this.isInitial = this.#value !== ''
  }

  #getRowCoords() {
    return range(this.#gridSize, i => [this.#row, i])
  }

  #getColCoords() {
    return range(this.#gridSize, i => [i, this.#col])
  }

  #getSquareCoords() {
    const squareBoundaries = getSquareBoundaries(this.#gridSize)
    const cols = squareBoundaries.find(cols => cols.includes(this.#col))
    const rows = squareBoundaries.find(rows => rows.includes(this.#row))

    return rows.reduce(
      (acc, row) => cols.reduce((acc, col) => acc.concat([[row, col]]), acc),
      []
    )
  }

  get neighbours() {
    return this.#neighbours
  }

  set(value) {
    this.#value = value
  }

  unset() {
    this.#value = ''
  }

  toString() {
    return this.#value
  }
}

module.exports = Cell
