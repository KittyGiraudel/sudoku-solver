const chalk = require('chalk')
const divide = require('../helpers/divide')
const { BOXES, COLORS } = require('./constants')
const { TOP, BOTTOM, THICK_SEPARATOR, SEPARATOR, MIDDLE } = BOXES

class CLIRenderer {
  #grid
  #enableColors

  constructor(grid, colors) {
    this.#enableColors = Boolean(colors) || false
    this.#grid = grid
  }

  renderCell(row, col) {
    const cell = this.#grid[row][col]
    const value = cell.toString() || ' '

    if (!this.#enableColors) return value

    const color = chalk[COLORS[value - 1] || 'white']
    const render = cell.isInitial ? color.underline : color

    return render(value)
  }

  renderLine(cells, [thin, thick, left, right]) {
    return (
      left +
      divide(cells, Math.sqrt(cells.length))
        .map(cells => cells.join(thin))
        .join(thick) +
      right
    )
  }

  format(grid) {
    const dim = value => (this.#enableColors ? chalk.dim(value) : value)
    const squareSize = Math.sqrt(grid.length)
    const thicks = grid[0].map(_ => dim(`━━━`))
    const thins = grid[0].map(_ => dim(`───`))
    const top = this.renderLine(thicks, TOP.map(dim))
    const bottom = this.renderLine(thicks, BOTTOM.map(dim))
    const thickLine = this.renderLine(thicks, THICK_SEPARATOR.map(dim))
    const thinLine = this.renderLine(thins, SEPARATOR.map(dim))

    const renderRow = (row, i) => {
      const cells = row.map((_, col) => ` ${this.renderCell(i, col)} `)
      const padding = i > 0 ? (i % squareSize ? thinLine : thickLine) : ''

      return [padding, this.renderLine(cells, MIDDLE.map(dim))]
        .filter(Boolean)
        .join('\n')
    }

    return [top, ...grid.map(renderRow), bottom].join('\n')
  }

  render(grid) {
    console.log(this.format(grid))
  }
}

module.exports = CLIRenderer
