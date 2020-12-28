const debug = require('debug')
const chalk = require('chalk')
const Cell = require('./Cell')
const chunkify = require('../helpers/chunkify')
const range = require('../helpers/range')
const getSquareBoundaries = require('../helpers/getSquareBoundaries')
const { COLORS, SYMBOLS, BOXES } = require('./constants')

class Game {
  constructor(size, initialValues, options = {}) {
    this.options = {
      verbose: typeof process.env.DEBUG !== 'undefined',
      colors: 'colors' in options ? Boolean(options.colors) : false,
    }
    this.size = size
    this.initialValues =
      typeof initialValues === 'string'
        ? initialValues
            .split(';')
            .reduce((acc, chunk) => acc.set(...chunk.split('=')), new Map())
        : initialValues
    this.grid = range(size, row =>
      range(
        size,
        col => new Cell(row, col, size, this.initialValues.get(row + ':' + col))
      )
    )
  }

  logger(row, col) {
    return this.options.verbose ? debug(`${row}:${col}`) : () => {}
  }

  colorise(row, col) {
    const value = this.get(row, col).valueOf() || ' '
    if (!this.options.colors) return value
    const color = chalk[COLORS[value - 1]]
    const fn = this.initialValues.has(row + ':' + col) ? color.underline : color
    return fn(value)
  }

  render() {
    console.log(this.toString())
    return this
  }

  renderLine = (cells, ...symbols) => {
    const [thin, thick, left, right] = symbols.map(symbol => chalk.dim(symbol))
    const chunks = chunkify(cells, Math.sqrt(cells.length))

    return left + chunks.map(cells => cells.join(thin)).join(thick) + right
  }

  toString() {
    const squareSize = Math.sqrt(this.size)
    const row = this.grid[0]
    const thicks = row.map(_ => chalk.dim(`━━━`))
    const thins = row.map(_ => chalk.dim(`───`))
    const top = this.renderLine(thicks, ...BOXES.TOP)
    const bottom = this.renderLine(thicks, ...BOXES.BOTTOM)
    const thinLine = this.renderLine(thins, ...BOXES.SEPARATOR)
    const thickLine = this.renderLine(thicks, ...BOXES.THICK_SEPARATOR)

    const renderRow = (row, rowIndex) => {
      const cells = row.map((_, col) => ` ${this.colorise(rowIndex, col)} `)
      const padding =
        rowIndex > 0 ? (rowIndex % squareSize ? thinLine : thickLine) : ''

      return [padding, this.renderLine(cells, ...BOXES.MIDDLE)]
        .filter(Boolean)
        .join('\n')
    }

    return [top, ...this.grid.map(renderRow), bottom].join('\n')
  }

  get(row, col) {
    return this.grid[row][col]
  }

  checkCell(row, col) {
    const log = this.logger(row, col)

    // If the current row index or colum index is out of bound, it means we have
    // reach the bottom right of the grid, and therefore we have fully resolved.
    if (row >= this.size || col >= this.size) return true

    log('starting')

    const nextCol = (col + 1) % this.size
    const nextRow = Math.floor((this.size * row + col + 1) / this.size)
    const cell = this.get(row, col)
    const value = cell.valueOf()

    // If there is already a value in the current cell, we can move on to the
    // next one as it means it was a predefined value which cannot be incorrect.
    if (value) {
      log('predefined', value)
      return this.checkCell(nextRow, nextCol)
    }

    // Retrieve all the values in the row, column and square of the current cell
    // to know which ones *cannot* be set in the current cell.
    const impossibleValues = new Set(
      cell
        .getNeighbours()
        .map(coords => this.get(...coords).valueOf())
        .filter(Boolean)
    )

    // If there are as many impossible values as items in a row, that means the
    // current cell *cannot* be filled, and therefore there was something
    // incorrect prior.
    // Note that this code branch is not technically necessary and is there only
    // to avoid entering the next loop if it is known in advance that no values
    // can possibly fit.
    if (impossibleValues.size === this.size) {
      log('dead end')
      return false
    }

    // Otherwise, go through all the values and for each one…
    for (let i = 0; i < this.size; i++) {
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
      if (this.checkCell(nextRow, nextCol)) {
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
    this.checkCell(0, 0)
    return this
  }

  validate() {
    const squareBoundaries = getSquareBoundaries(this.size)
    const read = coords => this.get(...coords).valueOf()

    for (let i = 0; i < this.size; i++) {
      const row = range(this.size, col => [i, col])
        .map(read)
        .filter(Boolean)

      if (new Set(row).size !== row.length)
        throw new Error(`Row #${i + 1} has an error.`)

      const col = range(this.size, row => [row, i])
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

    return this
  }
}

module.exports = Game
