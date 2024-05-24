// server.js
const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

// Create an Express app
const app = express();
// Create an HTTP server
const server = http.createServer(app);
// Integrate Socket.io
const io = socketIo(server);
// Serve static files from the public directory
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
    // io.to(room).emit('message', `User has joined room ${room}`);
  });

  socket.on('chat-message', (data) => {
    
    data.sender = socket.id
    console.log('=== socket.id:', socket.id)
    console.log('==data:', data)
    io.to(socket.room).emit('chat-message', data)

    // socket.broadcast.emit('chat-message', data)
  })
})

server.listen(4000, () => console.log(`💬 server on port 4000`))