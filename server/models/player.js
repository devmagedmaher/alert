

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
  isAdmin = false

  /**
   * Is player client connected to server
   * 
   * @type {Boolean}
   */
  isConnected = true

  /**
   * Is player inside a game or a spectator
   * 
   * @type {Boolean}
   */
  isInGame = false

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

  setName(name) {
    this.name = name
    return this
  }

  setIsConnected(isConnected) {
    this.isConnected = isConnected
    return this
  }

  setIsInGame(isInGame) {
    this.isInGame = isInGame
    return this
  }

  setIsAdmin(isAdmin) {
    this.isAdmin = isAdmin
    return this
  }

}


module.exports = Player