

class Game {

  /**
   * default game values
   * 
   */
  max_players = 3
  min_players = 2
  started = false

  /**
   * Init game
   */
  constructor(name = 'flags') {
    this.name = name
  }

}


module.exports = Game