const chalk = require('chalk')
const divide = require('./divide')
const { BOXES } = require('../core/constants')
const { TOP, BOTTOM, THICK_SEPARATOR, SEPARATOR, MIDDLE } = BOXES

const renderLine = (cells, [thin, thick, left, right]) =>
  left +
  divide(cells, Math.sqrt(cells.length))
    .map(cells => cells.join(thin))
    .join(thick) +
  right

const render = (grid, renderValue, withColors) => {
  const dim = value => (withColors ? chalk.dim(value) : value)
  const squareSize = Math.sqrt(grid.length)
  const thicks = grid[0].map(_ => dim(`━━━`))
  const thins = grid[0].map(_ => dim(`───`))
  const top = renderLine(thicks, TOP.map(dim))
  const bottom = renderLine(thicks, BOTTOM.map(dim))
  const thickLine = renderLine(thicks, THICK_SEPARATOR.map(dim))
  const thinLine = renderLine(thins, SEPARATOR.map(dim))

  const renderRow = (row, i) => {
    const cells = row.map((_, col) => ` ${renderValue(i, col)} `)
    const padding = i > 0 ? (i % squareSize ? thinLine : thickLine) : ''

    return [padding, renderLine(cells, MIDDLE.map(dim))]
      .filter(Boolean)
      .join('\n')
  }

  return [top, ...grid.map(renderRow), bottom].join('\n')
}

module.exports = render
