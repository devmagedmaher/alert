

class Game {

  /**
   * default game values
   * 
   */
  max_players = 16
  min_players = 3
  started = false
  canStart = false
  isFull = false

  /**
   * Init game
   */
  constructor(name) {
    this.name = 'chef-recipe'
  }


}


module.exports = Game