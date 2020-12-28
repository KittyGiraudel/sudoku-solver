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

  _solve(row, col) {
    const log = this.logger(row, col)

    if (row >= this.size || col >= this.size) return true

    log('starting')
    const nextCol = (col + 1) % this.size
    const nextRow = Math.floor((this.size * row + col + 1) / this.size)
    const cell = this.get(row, col)
    const value = cell.valueOf()

    if (value) {
      log('predefined', value)
      return this._solve(nextRow, nextCol)
    }

    const impossibleValues = new Set(
      cell
        .getNeighbours()
        .map(coords => this.get(...coords).valueOf())
        .filter(Boolean)
    )

    if (impossibleValues.size === this.size) {
      log('dead end')
      return false
    }

    for (let i = 0; i < this.size; i++) {
      const symbol = SYMBOLS[i]
      if (impossibleValues.has(symbol)) continue

      log(`trying ${symbol}`)
      cell.set(symbol)

      if (this._solve(nextRow, nextCol)) {
        log(`confirming ${symbol}`)
        return true
      }

      cell.unset()
    }

    return false
  }

  solve() {
    this._solve(0, 0)
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
