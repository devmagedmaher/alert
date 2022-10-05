module.exports = {
  /**
   * Check if current environment is development or not
   */
  isDev: process.env.NODE_ENV !== 'production',
};

module.exports.CONST = {
  /**
   * Count down for recipe game (in seconds)
   */
  COUNT_DOWN_RECIPE: 20,
  COUNT_DOWN_ANSWER: 20,
  COUNT_DOWN_FOOD: 15,

  /**
   * Default max rounds of the game
   */
  MAX_ROUNDS: 5,

  /**
   * Default max players inside a game
   */
  MAX_PLAYERS: 16,
}