const SocketIO = require('./socketIO')


class Player extends SocketIO {

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
   * @type {Integer}
   */
  score = 0

  /**
   * Score in single game round
   * 
   * @type {Integer}
   */
  scoreInRound = 0

  /**
   * Init player
   * 
   */
  constructor(id, name, { room, io, socket }) {
    super({ room, io, socket })

    // update 
    this.id = id
    this.name = name
  }

  /**
   * set socket
   * 
   */
  __setSocket(socket) {
    this.__socket = socket
  }

  /**
   * set player name
   * 
   * @param {String} name player name
   * 
   * @returns {Player}
   */
  setName(name) {
    this.name = name
    return this
  }

  /**
   * set player is connected to the room or not
   * 
   * @param {Boolean} isConnected is player connected?
   * 
   * @returns {Player}
   */
  setIsConnected(isConnected) {
    this.isConnected = isConnected
    return this
  }

  /**
   * set player is in the game room or not
   * 
   * @param {Boolean} isInGame is player in the game room
   * 
   * @returns {Player}
   */
  setIsInGame(isInGame) {
    this.isInGame = isInGame
    return this
  }

  /**
   * set player is a game admin or not
   * 
   * @param {Boolean} isAdmin is player a game admin or not
   * 
   * @returns {Player}
   */
  setIsAdmin(isAdmin) {
    this.isAdmin = isAdmin
    return this
  }

  toObject() {
    const { ...object } = this

    // delete private props and methods
    Object.keys(object).forEach(key => {
      if (key.startsWith('__')) {
        delete object[key]
      }
    })

    return object
  }
}


module.exports = Player