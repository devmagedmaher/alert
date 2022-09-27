

module.exports = async socket => {
  try {
    const { room, name } = socket.handshake.query;
    console.log(`player: ${name} joined room: ${room}`)
  }
  catch(e) {
    console.log('[ERROR][SOCKET]', e);
    socket.disconnect();
  }
}