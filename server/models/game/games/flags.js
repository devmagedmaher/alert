const Game = require('..')


class FlagsGame extends Game {

  /**
   * is game active?
   * 
   * @type {Boolean}
   */
  static __isActive = false

  /**
   * Init game
   */
  constructor(props) {
    super('flags', 'get the country flag name', props)
  }

}


module.exports = FlagsGame