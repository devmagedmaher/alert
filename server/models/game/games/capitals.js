const Game = require('..')


class CapitalsGame extends Game {


  /**
   * Init game
   */
  constructor(props) {
    super('capitals', 'get the country capital name', props)

    // set default game settings
    this.min_players = 3
    this.max_players = 4
  }

}


module.exports = CapitalsGame