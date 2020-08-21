// Javascript for frontEnd

// Importing socket
const socket = io('/');

// Create video HTML Tag
const myVideo = document.createElement('video');
myVideo.muted = true;

// create peer
var peer = new Peer(undefined, {
  // path to our server
  path: '/peerjs',
  host: '/',
  port: '3000'
}); 

// get the video-grid html div element
const videoGrid = document.getElementById('video-grid');

// Get the video and audio from chrome
let myVideoStream;
navigator.mediaDevices.getUserMedia({
  video: true,
  audio: true
}).then((stream) => {
  myVideoStream = stream;
  addVideoStream(myVideo, stream);
})

const addVideoStream = (video, stream) => {
  video.srcObject = stream;
  video.addEventListener('loadedmetadata', () => {
    video.play();
  });
  // Append the video to the video-grid div in room.ejs
  videoGrid.append(video);
}

// this id is unique for everyone who is connecting
peer.on('open', (id) => {
  // Send event to our server
  // ROOM_ID is passed in from room.ejs
  socket.emit('join-room', ROOM_ID, id);
})




// This will be listened to by server.js
socket.on('user-connected', () => {
  connectToNewUser();
})

const connectToNewUser = () => {
  console.log('new user');
}

