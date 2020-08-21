// Javascript for frontEnd

const { connect } = require("http2");

// Importing socket
const socket = io('/');

// Create video HTML Tag
const myVideo = document.createElement('video');
myVideo.muted = true;

// get the video-grid html div element
const videoGrid = document.getElementById('video-grid');

// Get the video and audio from chrome
let myVideoStream;
navigator.mediaDevices.getUserMedia({
  video: true,
  audio: true
}).then(stream => {
  myVideoStream = stream;
  addVideoStream(myVideo, stream);
})

// Send event to our server
// ROOM_ID is passed in from room.ejs
socket.emit('join-room', ROOM_ID);

// This will be listened to by server.js
socket.on('user-connected', () => {
  connectToNewUser();
})

const connectToNewUser = () => {
  console.log('new user');
}

const addVideoStream = (video, stream) => {
  video.srcObject = stream;
  video.addEventListener('loadedmetadata', () => {
    video.play();
  });
  // Append the video to the video-grid div in room.ejs
  videoGrid.append(video);
}