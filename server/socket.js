const Utils = require('./utils')
const Rooms = require('./models/rooms')

const rooms = new Rooms()

module.exports = io => {
  return async socket => {
    const { room, name, id } = socket.handshake.query;
    console.log(`player: ${name} is joining room: ${room}`)
    try {
      // create/get room by name
      const r = rooms.create(room, { refresh })

      // join player to room and get player instance
      const p = r.join(id, name)

      // join socket to room
      socket.join(room)

      /**
       * refresh room object
       * 
       */
      function refresh(key) {
        // objectify room
        const roomObject = r.toObject(key)
        console.log('REFRESH', roomObject)

        // emit updated room data to room players
        io.to(room).emit('refresh', roomObject)
      }
      refresh()

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
       * Disconnect: handle socket disconnection
       * 
       */
      function handleDisconnectEvent() {
        console.log(`player: ${name} is disconnected from room: ${room}`)
        // disconnect player from the room
        r.disconnectPlayer(id)
      }
      
      socket.on('enterGame', handleEnterGameEvent) 
      socket.on('disconnect', handleDisconnectEvent) 
    }
    catch(e) {
      console.log('[ERROR][SOCKET]', e);
      socket.disconnect();
      socket.leave(room)
    }
  }
}