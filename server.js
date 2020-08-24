// Initialise nodejs app
const express = require('express');
const app = express();
// This server is required for socket.io
const server = require('http').Server(app);
// pass in the server to the return of require('socket.io)
// socket.io then knows which server to connect to
const io = require('socket.io')(server);
// import uuid version 4
const { v4: uuidv4} = require('uuid');
const { ExpressPeerServer } = require('peer');
// Using PeerServer together with express
const peerServer = ExpressPeerServer(server, {
  debug: true
});
// setup ejs (embedded javascript)
app.set('view engine', 'ejs');
// set the public folder (Very important)
app.use(express.static('public'));

// path for peer to load on our server
app.use('/peerjs', peerServer);
app.get('/', (req, res) => {
  // res.status(200).send("Hello World");
  // Redirect the user to the unique zoom room
  res.redirect(`/${uuidv4()}`)
});


app.get('/:room', (req, res) => {
    // we are rendering views/room.ejs file (? I think all ejs files are expected to be in views folder?)
    // roomId param gets passed to the room.ejs file
  res.render('room', {roomId: req.params.room})
})

// make a socket.io connection
// runs when someone connects to the webpage
// 'socket' is the socket that a user connects to
io.on('connection', (socket) => {
  // events to listen to from frontend

  // listen to 'join-room' emitted from script.js
  socket.on('join-room', (roomId, userId) => {
    // make the socket(user) join a room
    socket.join(roomId);
    // send a message to the room you're currently
    // this message is sent to everyone else in the room except the user
    // who is newly connected
    // 'user-connected' is the event
    socket.to(roomId).broadcast.emit('user-connected', userId);
    // listen to 'message' event
    socket.on('message', (message) => {
      // send message to frontend
      io.to(roomId).
    })
  })
})



server.listen(3000);