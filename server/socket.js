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

      // // join socket to room
      // socket.join(room)

      // // send message to room about this player connection
      // sendMessage('self', `You have connected to "${room}" room successfully`, 'success')
      // sendMessage('cast', `${name} has connected to this room`, 'success')

      /**
       * 
       * @param {String} func function name
       * @param  {...any} args function arguments
       */
      function call(func, ...args) {
        // console.log({func, args})
        switch(func) {
          case 'refresh':
            refresh(...args)
            break;
          
          case 'selfMessage':
            sendMessage('self', ...args)
            break;

          case 'castMessage':
            sendMessage('cast', ...args)
            break;

          case 'roomMessage':
            sendMessage('room', ...args)
            break;

          default:
            console.error(`Unsupported function ${func}`)
        }
      }

      /**
       * refresh room object
       * 
       */
      function refresh(key) {
        // objectify room
        const roomObject = r.toObject(key)
        // console.log('REFRESH', roomObject)

        // emit updated room data to room players
        io.to(room).emit('refresh', roomObject)
      }
      refresh('games')

      /**
       * EnterGame: handle player enter game
       * 
       */
      function handleEnterGameEvent() {
        console.log(`player: ${name} entered game in room: ${room}`)
        // enter player to the room's game
        r.enterPlayer(id)
      }

      function handleGameChangedEvent(gameName) {
        r.changeGame(gameName)
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
      socket.on('gameChanged', handleGameChangedEvent)
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