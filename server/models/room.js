const SocketIO = require('./socketIO')
const Player = require('./player')
const Game = require('./game')
const gamesList = require('../games-list')


class Room extends SocketIO {

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
   * is game overflowed
   * 
   * @type {Boolean}
   */
  isGameOverflowed = false

  /**
   * Init room
   * 
   */
  constructor(name, { call, io }) {
    super({ room: name, io })
    
    this.name = name
    this.game = new Game()
    this.games = gamesList
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
   * @param {Boolean} isGameOverflowed 
   * @returns 
   */
  setIsGameOverflowed(isGameOverflowed) {
    this.isGameOverflowed = isGameOverflowed
    return this
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
   * get admin of the room
   * 
   */
  getAdmin() {
    return this.players.find(p => p.isAdmin)
  }

  /**
   * update can game start
   * 
   * @return {Room}
   */
  updateCanStart() {
    if (this.game.name === undefined) {
      // if game is not selected yet
      // set can start = false
      this.setCanGameStart(false)
      return this
    }

    const inGamePlayers = this.getInGamePlayers()
    if (inGamePlayers.length < this.game.min_players) {
      // if in game players less than min allowable players
      // set can start = false
      this.setCanGameStart(false)
    }
    else if (inGamePlayers.length > this.game.max_players) {
      // if in game players more than max allowable players
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
      // if in game players less than max allowable players
      // set is full = false
      this.setIsGameFull(false)
    }
    else {
      // if in game players less than max allowable players
      // set is full = true
      this.setIsGameFull(true)
    }
    return this
  }

  /**
   * update is game overflowed
   * 
   * @returns {Room}
   */
  updateIsGameOverflowed() {
    const inGamePlayers = this.getInGamePlayers()
    if (inGamePlayers.length > this.game.max_players) {
      // if in game players more than max allowable players
      // set is overflowed = true
      this.setIsGameOverflowed(true)
    }
    else {
      // if in game players less than max allowable players
      // set is full = false
      this.setIsGameFull(false)
    }
    return this
  }

  /**
   * Join player to this room
   * 
   * @param {String} id 
   * @param {String} name 
   * 
   * @return {Player}
   */
  joinPlayer(id, name, { socket }) {
    let player = this.getPlayer(id)

    // check if player exists
    if (player) {
      // update player data
      player.setName(name).setIsConnected(true).setIsInGame(false)
      // update socket client
      .__setSocket(socket)
    }
    else {
      // add new player to room
      player = new Player(id, name, { room: this.name, io: this.__io, socket })
      this.players.push(player)
    }

    // join socket room
    player.joinRoom()

    // announce player connection
    player.selfMessage(`You have connected to "${this.name}" room successfully`, 'success')
    player.castMessage(`${player.name} has connected to this room`, 'success')

    return player
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
      this.updateIsGameOverflowed()
      this.updateIsGameFull()

      // set admin if he is the first inGame player
      if (inGamePlayers.length === 1) {
        player.setIsAdmin(true)
      }

      player.selfMessage(`You have entered the game room`, 'info')
      player.castMessage(`${player.name} has entered the game room`, 'info')
    }

    // this.__call('refresh')
    this.refresh(this.toObject())

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
        this.updateIsGameOverflowed()
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

      player.selfMessage(`You have disconnected from the room`, 'error')
      player.castMessage(`${player.name} has disconnected from the room`, 'error')
    }
    
    player.leaveRoom()
    this.refresh(this.toObject())

    return player
  }

  /**
   * change room game
   * 
   * @param {String} name game name
   * 
   * @return {Game}
   */
  changeGame(name) {
    const game = this.games.find(g => g.data.name === name)
    this.game = new game.Class()

    // update game props
    this.updateCanStart()
    this.updateIsGameOverflowed()
    this.updateIsGameFull()

    this.refresh(this.toObject())

    const admin = this.getAdmin()
    if (admin) {
      admin.selfMessage(`You have selected "${this.game.name}" game`, 'info')
      admin.castMessage(`${admin.name} has selected "${this.game.name}" game`, 'info')
    }

    return game
  }
  
  /**
   * instance to json
   * 
   * @param {string} key the only key of object to keep
   * 
   * @return {Object}
   */
  toObject() {
    // objectify instance
    const { ...object } = this

    // delete private props and methods
    Object.keys(object).forEach(key => {
      if (key.startsWith('__')) {
        delete object[key]
      }
    })

    // mutate games list
    object.games = object.games.map(g => g.data)

    // objectify game instance
    object.game = object.game.toObject()

    // mutate players list instances to list of objects
    object.players = object.players
    // filter disconnected players
    .filter(p => p.isConnected)
    // objectify player instance
    .map(p => p.toObject())


    // return object
    return object
  }
}


module.exports = Room