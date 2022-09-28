
let rooms = {}

module.exports = io => {
  return async socket => {
    try {
      const { room, name, id } = socket.handshake.query;
      console.log(`player: ${name} connected to room: ${room}`)
      socket.on('test', () => console.log('test event emitted'))

      /**
       * Initialize room if it doesn't exist
       * 
       */
      if (!rooms[room]) {
        // initial room object
        rooms[room] = {
          name: room,
          players: [],
        }
      }
      const r = rooms[room]

      socket.join(r.name)

      /**
       * Update room players with newer game data
       * 
       */
      const refreshGameData = () => {
        io.to(room).emit('refresh', r)
        console.log('game', room, 'data', r)
      }
      refreshGameData()

      /**
       * EnterGame: Enter player into the game
       * 
       */
      const handleEnterGameEvent = () => {
        console.log(`player: ${name} enter game ${room} with id: ${id}`)

        if (r.players.every(player => player.id !== id)) {
          const player = {
            id,
            name,
            score: 0,
          }
          r.players = [ ...r.players, player ]
        }
        refreshGameData()
      }
      /**
       * StartGame: start the game
       * 
       */
      const handleStartGameEvent = () => {
        startGame(io, socket, { room, name, id })
      }

      /**
       * Disconnect: announce an player disconnection
       * 
       */
      const handleDisconnectEvent = () => {
        console.log(`player: ${name} disconnected from room: ${room}`)

        r.players = r.players.filter(player => player.id !== id)
        refreshGameData()
        socket.leave(r.name)
      }


      /**
       * Listen to events
       * 
       */
      socket.on('enterGame', handleEnterGameEvent)
      socket.on('startGame', handleStartGameEvent)
      socket.on('disconnect', handleDisconnectEvent) 
    }
    catch(e) {
      console.log('[ERROR][SOCKET]', e);
      socket.disconnect();
      socket.leave(r.name)
    }
  }
}

function startGame(io, socket, { room, name, id }) {
  const g = rooms[room]
  g.started = true

  /**
   * Update room players with newer game data
   * 
   */
  const refreshGameData = () => {
    io.to(room).emit('refresh', g)
    console.log('game', room, 'data', g)

    // pause game if not enough players around
    if (g.players.length < 2) {
      pauseGame()
    }
  }
  refreshGameData()
  io.to(room).emit('gameStarted')

  /**
   * Close room if there are no players in the room
   */
  const pauseGame = () => {
    console.log('pause room', room)
    g.started = false
  }
}