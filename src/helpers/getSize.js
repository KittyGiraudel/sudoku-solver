// Find the size of the grid by analysing the initial values.
// @param {Map} initialValues - Map of initial values
// @return {Number}
const getSize = initialValues => {
  const keys = Array.from(initialValues.keys())
  const numbers = keys.map(key => key.split(':').map(Number)).flat()
  const max = Math.max(...numbers)

  return Math.pow(Math.ceil(Math.sqrt(max + 1)), 2)
}

module.exports = getSize
