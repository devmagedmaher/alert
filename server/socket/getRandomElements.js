

/**
 * get random array elements
 * 
 */
module.exports = (array, length = 1) => {
  return array
    .map(value => ({ value, sort: Math.random() }))
    .sort((a, b) => a.sort - b.sort)
    .map(({ value }) => value)
    .slice(0, length)
}