const debug = require('debug')
const getRelevantCells = require('../helpers/getRelevantCells')
const getSize = require('../helpers/getSize')
const parseInitialValues = require('../helpers/parseInitialValues')
const range = require('../helpers/range')
const validate = require('../helpers/validate')
const CLIRenderer = require('./CLIRenderer')

const SYMBOLS = '123456789ABCDEFGHIJKLMNOP'.split('')
const noop = () => {}
class Game {
  // The verbose mode is enabled if the `DEBUG` environment variable is provided
  // and uses the `debug` package to scope output by coordinates.
  #verbose = typeof process.env.DEBUG !== 'undefined'

  // The grid is bi-dimensional array, initialised in the constructor, used to
  // store the value of all cells.
  #grid

  // The renderer can be provided as an option to the constructor, otherwise
  // defaults to a CLI renderer.
  #renderer

  // The cache is used to store the coordinates of the relevant cells (row,
  // column and square) for every given cell in the grid so they are computed
  // only once.
  #cache = new Map()

  constructor(initialValues, options = {}) {
    const values = parseInitialValues(initialValues)
    const size = getSize(values)

    this.#grid = range(size, row =>
      range(size, col => String(values.get(`${row}:${col}`) || ''))
    )
    this.#renderer =
      options.renderer || new CLIRenderer(this.#grid, values, options.colors)
  }

  getRelevantCells(row, col) {
    const key = row + ':' + col

    if (this.#cache.has(key)) return this.#cache.get(key)

    const relevantCells = getRelevantCells(row, col, this.#grid.length)

    this.#cache.set(key, relevantCells)

    return relevantCells
  }

  solve(row = 0, col = 0) {
    const size = this.#grid.length
    const log = this.#verbose ? debug(`${row}:${col}`) : noop

    // If the current row index or colum index is out of bound, it means we have
    // reach the bottom right of the grid, and therefore we have fully resolved.
    if (row >= size || col >= size) return true

    log('starting')

    const nextCol = (col + 1) % size
    const nextRow = Math.floor((size * row + col + 1) / size)
    const value = this.#grid[row][col]

    // If there is already a value in the current cell, we can move on to the
    // next one as it means it was a predefined value which cannot be incorrect.
    if (value) {
      log('predefined', value)
      return this.solve(nextRow, nextCol)
    }

    // Retrieve all the values in the row, column and square of the current cell
    // to know which ones *cannot* be set in the current cell.
    const impossibleValues = new Set(
      this.getRelevantCells(row, col)
        .map(([row, col]) => this.#grid[row][col])
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
      this.#grid[row][col] = String(symbol)
      log(`trying ${symbol}`)

      // Proceed to the next cell. If it eventually returns `true`, that means
      // this cell is correct, and it should return `true` as well to bubble the
      // result up.
      if (this.solve(nextRow, nextCol)) {
        log(`confirming ${symbol}`)
        return true
      }

      // If the current loop value did not yield positive results down the line,
      // unset its value as it was incorrect.
      this.#grid[row][col] = ''
    }

    // If none of the possible values yielded positive results down the line,
    // return `false` to indicate that there is an error somewhere up.
    return false
  }

  validate() {
    validate(this.#grid)
  }

  render() {
    this.#renderer.render(this.#grid)
  }
}

module.exports = Game
