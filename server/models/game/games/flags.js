const Game = require('..')


class FlagsGame extends Game {


  /**
   * Init game
   */
  constructor(props) {
    super('flags', 'get the country flag name', props)
  }

}


module.exports = FlagsGame