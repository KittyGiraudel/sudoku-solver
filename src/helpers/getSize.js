const POSSIBLE_SIZES = [4, 9, 16, 25]

// Find the size of the grid by analysing the initial values.
// @param {Map} initialValues - Map of initial values
// @return {Number}
const getSize = initialValues => {
  const highest =
    Math.max(
      ...Array.from(initialValues.keys())
        .map(key => key.split(':').map(Number))
        .flat()
    ) + 1

  return Math.min(...POSSIBLE_SIZES.filter(y => y >= highest))
}

module.exports = getSize
