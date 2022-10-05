

class Player {

  /**
   * Unique string id
   * 
   * @type {String}
   */
  id = ''

  /**
   * Player name
   * 
   * @type {String}
   */
  name = ''

  /**
   * Is admin
   * 
   * @type {Boolean}
   */
  admin = false

  /**
   * Is player client connected to server
   * 
   * @type {Boolean}
   */
  connected = true

  /**
   * Is player inside a game or a spectator
   * 
   * @type {Boolean}
   */
  inGame = false

  /**
   * Total game score
   * 
   */
  score = 0

  /**
   * Score in single game round
   * 
   */
  scoreInRound = 0


  /**
   * Init player
   * 
   */
  constructor(id, name) {
    this.id = id
    this.name = name
  }


  isConnected() {
    return this.connected
  }

  isInGame() {
    return this.inGame
  }

  isSpectator() {
    return !this.inGame
  }

  setName(name) {
    this.name = name
    return this
  }

  setConnected(connected) {
    this.connected = connected
    return this
  }

  setInGame(inGame) {
    this.inGame = inGame
    return this
  }

  setAdmin(admin) {
    this.admin = admin
    return this
  }

}


module.exports = Player