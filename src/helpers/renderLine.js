const chalk = require('chalk')
const divide = require('./divide')

const renderLine = (cells, symbols) => {
  const [thin, thick, left, right] = symbols
  const chunks = divide(cells, Math.sqrt(cells.length))

  return left + chunks.map(cells => cells.join(thin)).join(thick) + right
}

module.exports = renderLine
