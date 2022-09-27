

module.exports = async socket => {
  try {
    const { room, name } = socket.handshake.query;
    console.log(`player: ${name} joined room: ${room}`)

    socket.on('disconnect', () => {
      console.log(`player: ${name} disconnected from room: ${room}`)
    })
  }
  catch(e) {
    console.log('[ERROR][SOCKET]', e);
    socket.disconnect();
  }
}