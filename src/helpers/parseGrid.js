const divide = require('./divide')

const parseGrid = line =>
  divide(line.split(''), Math.sqrt(line.length)).map(row =>
    row.map(value => (value === '0' ? '' : value))
  )

module.exports = parseGrid
