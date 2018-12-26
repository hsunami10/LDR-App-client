export default socket => {
  socket.on('connection-success', () => {
    console.log('socket connected success!');
  });
};
