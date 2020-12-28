// Parse the initial values if they are provided as a string.
// @param {String|Map} initial values - Map or string of initial values
// @return {Map}
const parseInitialValues = initialValues =>
  typeof initialValues === 'string'
    ? initialValues
        .split(';')
        .reduce((acc, chunk) => acc.set(...chunk.split('=')), new Map())
    : initialValues

module.exports = parseInitialValues
