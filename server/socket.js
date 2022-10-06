const Rooms = require('./models/rooms')

const rooms = new Rooms()

module.exports = io => {
  return async socket => {
    const { room, name, id } = socket.handshake.query;
    console.log(`player: ${name} is joining room: ${room}`)
    try {
      // create/get room by name
      const r = rooms.create(room, { io })

      // check if there is a player connected with the same id
      if (r.getPlayer(id)?.isConnected) {
        console.error(`player: ${name} is already joined to room: ${room}`)
        sendMessage('self', 'You are already connected on different tab or window.', 'error')
        socket.disconnect()
        return
      }

      // join player to room
      r.joinPlayer(id, name, { socket })


      /**
       * EnterGame: handle player enter game
       * 
       */
      function handleEnterGameEvent() {
        console.log(`player: ${name} entered game in room: ${room}`)
        // enter player to the room's game
        r.enterPlayer(id)
      }

      /**
       * ChangeGame: handle change game event
       * 
       * @param {String} gameName game name
       */
      function handleChangeGameEvent(gameName) {
        console.log(`player: ${name} changed game to ${gameName}`)
        r.changeGame(gameName)
      }

      /**
       * StartGame: handle start game event
       * 
       */
      function handleStartGameEvent() {
        console.log(`player: ${name} started game ${r.game.name}`)
        r.game.start()
      }

      /**
       * Disconnect: handle socket disconnection
       * 
       */
      function handleDisconnectEvent() {
        console.log(`player: ${name} is disconnected from room: ${room}`)
        // disconnect player from the room
        r.disconnectPlayer(id)
      }
      
      /**
       * socket listeners
       * 
       */
      socket.on('enterGame', handleEnterGameEvent)
      socket.on('changeGame', handleChangeGameEvent)
      socket.on('startGame', handleStartGameEvent)
      socket.on('disconnect', handleDisconnectEvent)


      /**
       * send message via socket
       * 
       * @param {String} to self|cast|room
       * @param {String} text text message 
       * @param {String} type success|error|warning|info|NULL
       */
      function sendMessage(to, text, type) {
        switch(to) {
          case 'self':
            socket.emit('message', { text, type })
            break
          
          case 'cast':
            socket.broadcast.to(room).emit('message', { text, type })
            break
          
          case 'room':
            io.to(room).emit('message', { text, type })
            break
          
          default:
            console.erro(`Unsupported "to" param ${to}`)
        }
      }
    }
    catch(e) {
      console.log('[ERROR][SOCKET]', e);
      socket.disconnect();
      socket.leave(room)
    }
  }
}