// Initialise nodejs app
const express = require('express');
const app = express();
const server = require('http').Server(app);
// import uuid version 4
const { v4: uuidv4} = require('uuid')
// setup ejs (embedded javascript)
app.set('view engine', 'ejs');


app.get('/', (req, res) => {
  // res.status(200).send("Hello World");
  // Redirect the user to the unique zoom room
  res.redirect(`/${uuidv4()}`)
});


app.get('/:room', (req, res) => {
    // we are rendering views/room.ejs file (? I think all ejs files are expected to be in views folder)
    // roomId param gets passed to the room.ejs file
  res.render('room', {roomId: req.params.room})
})



server.listen(3000);