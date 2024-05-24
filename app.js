const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);
app.use(express.static('public'));

let socketsConected = new Set()

io.on('connection', (socket) => {
  console.log('Socket connected', socket.id)
  socketsConected.add(socket.id)
  io.emit('clients-total', socketsConected.size)

  socket.on('disconnect', () => {
    console.log('Socket disconnected', socket.id)
    socketsConected.delete(socket.id)
    io.emit('clients-total', socketsConected.size)
  })

  socket.on('joinRoom', (room) => {
    socket.join(room);
    socket.room = room;
  });

  socket.on('chat-message', (data) => {
    data.sender = socket.id
    io.to(socket.room).emit('chat-message', data)
  })
})
server.listen(4000, () => console.log(`💬 server on port 4000`))