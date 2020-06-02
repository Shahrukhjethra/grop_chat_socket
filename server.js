const path = require('path');
const http = require('http');
const express = require('express');
const socketio = require('socket.io');
const connectDB = require('./config/db')
const formatMessage = require('./utils/messages');
const {
  userJoin,
  getCurrentUser,
  userLeave,
  getRoomUsers,
  getRoom,
  putChatMessage
} = require('./utils/users');

const app = express();
const server = http.createServer(app);
const io = socketio(server);

// Set static folder
app.use(express.static(path.join(__dirname, 'public')));

const botName = 'ChatCord Bot';

// Run when client connects
io.on('connection', async socket => {
  socket.emit("roomsList", await getRoom())
  socket.on('joinRoom', async ({ username, room }) => {
    const user = await userJoin(socket.id, username, room);
    socket.join(user.room);
 
    // Welcome current user
    socket.emit('message', formatMessage(botName, 'Welcome to ChatCord!'));

    // Broadcast when a user connects
    socket.broadcast
      .to(user.room)
      .emit(
        'message',
        formatMessage(botName, `${user.username} has joined the chat`)
      );

    // Send users and room info
    io.to(user.room).emit('roomUsers', {
      room: user.room,
      users: await getRoomUsers(user.room)
    });
  });

  // Listen for chatMessage
  socket.on('chatMessage', async ({msg, roomName}) => {
    console.log("socket", socket.id);    
    const user = await getCurrentUser(socket.id); 
    putChatMessage({id : socket.id, msg, roomName});
    io.to(user.room).emit('message', formatMessage(user.username, msg));
  });

  // Runs when client disconnects
  socket.on('disconnect', () => {
    const user = userLeave(socket.id);

    if (user) {
      io.to(user.room).emit(
        'message',
        formatMessage(botName, `${user.username} has left the chat`)
      );

      // Send users and room info
      io.to(user.room).emit('roomUsers', {
        room: user.room,
        users: getRoomUsers(user.room)
      });
    }
  });
});

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
