

/**
 * get random elements of array
 * 
 */
 module.exports.getRandomElements = (array, length = 1) => {
  return array
    .map(value => ({ value, sort: Math.random() }))
    .sort((a, b) => a.sort - b.sort)
    .map(({ value }) => value)
    .slice(0, length)
}