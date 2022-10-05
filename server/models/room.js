const Player = require('./player')
const Game = require('./game')


class Room {

  /**
   * Room name
   * 
   * @type {string}
   */
  name = ''

  /**
   * Players list
   * 
   * @type {Array}
   */
  players = []

  /**
   * can the game starts?
   * 
   * @type {Boolean}
   */
  canGameStart = false

  /**
   * is the game full of players?
   * 
   * @type {Boolean}
   */
  isGameFull = false

  /**
   * refresh room data
   * 
   * @type {Function}
   */
  refresh = () => { throw new Error('function is not assigend') }

  /**
   * Init room
   * 
   */
  constructor(name, { refresh }) {
    this.name = name

    // refresh room data
    this.refresh = refresh
    this.game = new Game()
  }

  /**
   * 
   * @param {Boolean} canGameStart 
   * @returns {Room}
   */
  setCanGameStart(canGameStart) {
    this.canGameStart = canGameStart
    return this
  }

  /**
   * 
   * @param {Boolean} isGameFull 
   * @returns 
   */
  setIsGameFull(isGameFull) {
    this.isGameFull = isGameFull
    return this
  }

  /**
   * 
   * @param {String} id 
   * @param {String} name 
   * 
   * @return {Player}
   */
  join(id, name) {
    let player = this.getPlayer(id)

    // check if player exists
    if (player) {
      // update player data
      return player.setName(name).setIsConnected(true).setIsInGame(false)
    }
    else {
      // add new player to room
      player = new Player(id, name)
      this.players.push(player)
    }

    return player
  }

  /**
   * get player by id
   * 
   * @param {String} id player id
   * 
   * @returns {Player}
   */
  getPlayer(id) {
    return this.players.find(p => p.id === id)
  }
  
  /**
   * get players entered the game of this room
   * 
   * @return {Array}
   */
  getInGamePlayers() {
    return this.players.filter(p => p.isInGame)
  }

  /**
   * update can game start
   * 
   * @return {Room}
   */
  updateCanStart() {
    const inGamePlayers = this.getInGamePlayers()
    if (inGamePlayers.length < this.game.min_players) {
      // if in game players less than min allowable players
      // set can start = false
      this.setCanGameStart(false)
    }
    else {
      // if in game players more than min allowable players
      // set can start = true
      this.setCanGameStart(true)
    }
    return this
  }

  /**
   * update is game full
   * 
   * @returns {Room}
   */
  updateIsGameFull() {
    const inGamePlayers = this.getInGamePlayers()
    if (inGamePlayers.length < this.game.max_players) {
      // if in game players leess than max allowable players
      // set is full = false
      this.setIsGameFull(false)
    }
    else {
      // if in game players less than max allowable players
      // set is full = false
      this.setIsGameFull(true)
    }
    return this
  }

  /**
   * enter player to the game of this room by id
   * 
   * @param {String} id player id
   * 
   * @returns {Player}
   */
  enterPlayer(id) {
    // get player
    const player = this.getPlayer(id)

    // check if player existing
    if (player) {
      // set player in game = true
      player.setIsInGame(true)

      // get in game players
      const inGamePlayers = this.getInGamePlayers()


      // update game props
      this.updateCanStart()
      this.updateIsGameFull()

      // set admin if he is the first inGame player
      if (inGamePlayers.length === 1) {
        player.setIsAdmin(true)
      }
    }

    this.refresh()

    return player
  }

  /**
   * handle player disconnection on this room
   * 
   * @param {String} id player id
   * 
   * @return {Player}
   */
  disconnectPlayer(id) {
    // get player
    const player = this.getPlayer(id)

    // check if player existing
    if (player) {
      // set player connection
      player.setIsConnected(false)

      // if player is in game
      if (player.isInGame) {
        // eject player from the game
        player.setIsInGame(false)

        // get in game players
        const inGamePlayers = this.getInGamePlayers()

        // update game props
        this.updateCanStart()
        // always set is full = false
        this.setIsGameFull(false)

        // if player is an admin
        if (player.isAdmin) {
          player.setIsAdmin(false)

          // set first in game player as an admin instead
          if (inGamePlayers[0]) {
            inGamePlayers[0].setIsAdmin(true)
          }
        }
      }
    }

    this.refresh()

    return player
  }

  
  /**
   * instance to json
   * 
   * @param {string} key the only key of object to keep
   * 
   * @return {Object}
   */
  toObject(key) {
    // objectify room
    const { ...object } = this

    // delete refresh functions
    delete object.refresh

    if (key === 'room') {
      delete object.game
      delete object.players
      return object
    }

    // objectify game instance
    if (object.game) {
      object.game = { ...object.game }
    }

    if (key === 'game') {
      return { game: object.game }
    }

    // objectify players instances
    object.players = object.players.map(p => ({ ...p })).filter(p => p.isConnected)

    if (key === 'players') {
      return { players: object.players }
    }

    // return object
    return object
  }
}


module.exports = Room