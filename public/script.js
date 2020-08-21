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
    // send our video stream to them
    call.answer(stream);
    // make a video element to show user's video on our page
    const video = document.createElement('video');
    // when we get their stream, we add it to our page inside the new video element
    call.on('stream', (userVideoStream) => {
      addVideoStream(video, userVideoStream);
    });
  })
  

  // This will be listened to by server.js
  // send out video stream to new user
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
// this function runs when the peer server is open and receives userId's
peer.on('open', (id) => {
  // Send event to our server
  // ROOM_ID is passed in from room.ejs
  // id is the userId
  socket.emit('join-room', ROOM_ID, id);
});


const connectToNewUser = (userId, stream) => {
  // call the user with userId and send out stream
  const call = peer.call(userId, stream);
  const video = document.createElement('video');
  // after calling, the user will send their stream to us

  call.on('stream', (userVideoStream) => {
    // Add the user's video to our page to view
    addVideoStream(video, userVideoStream);
  });
  // Remove the user's video from out page if they leave the call
  call.on('close', () => {
    video.remove();
  })
}

