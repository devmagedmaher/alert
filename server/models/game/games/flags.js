const Game = require('..')


class FlagsGame extends Game {


  /**
   * Init game
   */
  constructor() {
    super('flags', 'get the country flag name')
  }

}


module.exports = FlagsGame