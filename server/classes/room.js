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
   * Get room name
   * 
   * @return {string}
   */
  getName() {
    return this.name
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
      return player.setName(name).setConnected(true).setInGame(false)
    }
    else {
      // add new player to room
      player = new Player(id, name)
      this.players.push(player)
    }

    return player
  }

  /**
   * 
   * @param {String} id player id
   * 
   * @returns {Player}
   */
  getPlayer(id) {
    return this.players.find(p => p.id === id)
  }
  
  getInGamePlayers() {
    return this.players.filter(p => p.isInGame())
  }

  /**
   * 
   * @param {String} id player id
   * @returns {Player}
   */
  enterPlayer(id) {
    // get player
    const player = this.getPlayer(id)

    // check if player existing
    if (player) {
      // get in game players
      const inGamePlayers = this.getInGamePlayers()
      console.log({inGamePlayers})
      // set admin if he is the first inGame player
      if (inGamePlayers.length === 0) {
        player.setAdmin(true)
      }

      // set player in game = true
      player.setInGame(true)
    }

    this.refresh()

    return player
  }

  /**
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
      player.setConnected(false)

      // if player is in game
      if (player.isInGame()) {
        // eject player from the game
        player.setInGame(false)

        // if player is an admin
        if (player.admin) {
          player.setAdmin(false)
          // set first in game player as an admin instead
          const inGamePlayers = this.getInGamePlayers()
          if (inGamePlayers[0]) {
            inGamePlayers[0].setAdmin(true)
          }
        }
      }
    }

    this.refresh()

    return player
  }

  
  /**
   * class to json
   * 
   */
  toObject() {
    // objectify room
    const { ...object } = this

    if (object.game) {
      object.game = { ...object.game }
    }

    // delete refresh functions
    delete object.refresh

    // objectify players
    object.players = object.players.map(p => ({ ...p }))

    // return object
    return object
  }
}


module.exports = Room