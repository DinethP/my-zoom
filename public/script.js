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
  audio: false
}).then((stream) => {
  myVideoStream = stream;
  addVideoStream(myVideo, stream);

  // answer the call recieved from other users
  peer.on('call', (call) => {
    call.answer(stream);
    const video = document.createElement('video');
    // send our video stream to them
    call.on('stream', (userVideoStream) => {
      addVideoStream(video, userVideoStream);
    });
  })
  

  // This will be listened to by server.js
  // add the stream of other users
  socket.on('user-connected', (userId) => {
    connectToNewUser(userId, stream);
  });
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
  // id is the userId
  socket.emit('join-room', ROOM_ID, id);
});


const connectToNewUser = (userId, stream) => {
  const call = peer.call(userId, stream);
  const video = document.createElement('video');
  // get the user's stream and show it to us
  call.on('stream', (userVideoStream) => {
    addVideoStream(video, userVideoStream);
  });
}

