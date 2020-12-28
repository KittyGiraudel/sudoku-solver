const debug = require('debug')
const chalk = require('chalk')
const Cell = require('./Cell')
const getSize = require('../helpers/getSize')
const parseInitialValues = require('../helpers/parseInitialValues')
const range = require('../helpers/range')
const render = require('../helpers/render')
const validate = require('../helpers/validate')
const { COLORS, SYMBOLS } = require('./constants')

class Game {
  #size
  #grid
  #initialValues
  #options = {}

  constructor(initialValues, options = {}) {
    const values = parseInitialValues(initialValues)
    const size = getSize(values)

    this.#options.verbose = typeof process.env.DEBUG !== 'undefined'
    this.#options.colors = 'colors' in options ? Boolean(options.colors) : false
    this.#initialValues = values
    this.#size = size
    this.#grid = range(size, row =>
      range(size, col => new Cell(row, col, size, values.get(row + ':' + col)))
    )
  }

  get(row, col) {
    return this.#grid[row][col]
  }

  #checkCell(row, col) {
    const size = this.#size
    const log = this.#options.verbose ? debug(`${row}:${col}`) : () => {}

    // If the current row index or colum index is out of bound, it means we have
    // reach the bottom right of the grid, and therefore we have fully resolved.
    if (row >= size || col >= size) return true

    log('starting')

    const nextCol = (col + 1) % size
    const nextRow = Math.floor((size * row + col + 1) / size)
    const cell = this.get(row, col)
    const value = cell.toString()

    // If there is already a value in the current cell, we can move on to the
    // next one as it means it was a predefined value which cannot be incorrect.
    if (value) {
      log('predefined', value)
      return this.#checkCell(nextRow, nextCol)
    }

    // Retrieve all the values in the row, column and square of the current cell
    // to know which ones *cannot* be set in the current cell.
    const impossibleValues = new Set(
      cell.neighbours
        .map(coords => this.get(...coords).toString())
        .filter(Boolean)
    )

    // If there are as many impossible values as items in a row, that means the
    // current cell *cannot* be filled, and therefore there was something
    // incorrect prior.
    // Note that this code branch is not technically necessary and is there only
    // to avoid entering the next loop if it is known in advance that no values
    // can possibly fit.
    if (impossibleValues.size === size) {
      log('dead end')
      return false
    }

    // Otherwise, go through all the values and for each one…
    for (let i = 0; i < size; i++) {
      const symbol = SYMBOLS[i]

      // If the value cannot be set because it is already in the row, column or
      // square, proceed to the next value.
      if (impossibleValues.has(symbol)) continue

      // Set the trial value in the cell.
      cell.set(symbol)
      log(`trying ${symbol}`)

      // Proceed to the next cell. If it eventually returns `true`, that means
      // this cell is correct, and it should return `true` as well to bubble the
      // result up.
      if (this.#checkCell(nextRow, nextCol)) {
        log(`confirming ${symbol}`)
        return true
      }

      // If the current loop value did not yield positive results down the line,
      // unset its value as it was incorrect.
      cell.unset()
    }

    // If none of the possible values yielded positive results down the line,
    // return `false` to indicate that there is an error somewhere up.
    return false
  }

  solve() {
    this.#checkCell(0, 0)
    return this
  }

  validate() {
    validate(this.#grid)
    return this
  }

  render() {
    console.log(this.toString())
    return this
  }

  toString() {
    return render(
      this.#grid,
      (row, col) => {
        const value = this.get(row, col).toString() || ' '

        if (!this.#options.colors) return value

        const isInitial = this.#initialValues.has(row + ':' + col)
        const color = chalk[COLORS[value - 1] || 'white']
        const render = isInitial ? color.underline : color

        return render(value)
      },
      this.#options.colors
    )
  }
}

module.exports = Game
