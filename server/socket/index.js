
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
      socket.on('disconnect', handleDisconnectEvent) 
    }
    catch(e) {
      console.log('[ERROR][SOCKET]', e);
      socket.disconnect();
      socket.leave(r.name)
    }
  }
}