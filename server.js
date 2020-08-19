// Initialise nodejs app
const express = require('express');
const app = express();
const server = require('http').Server(app)

// setup ejs (embedded javascript)
app.set('view engine', 'ejs');
app.get('/', (req, res) => {
  // res.status(200).send("Hello World");
  res.render('room')
});




server.listen(3000);