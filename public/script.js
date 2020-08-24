// Javascript for frontEnd

// Importing socket
const socket = io('/');

// Create video HTML Tag
const myVideo = document.createElement('video');
// prevent hearing your own audio
myVideo.muted = true;
const users = {}

// create peer
var peer = new Peer(undefined, {
  // path to our server
  path: '/peerjs',
  host: '/',
  port: '443'
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

  // Handling chat messages
  // fetch the message entered by user
  let text = $('input');

  $('html').keydown((e) => {
    if(e.which == 13 && text.val().length !== 0){
      // sending event(emit) 'message' from front-end to server
      socket.emit('message', text.val());
      // clear message fron field
      text.val('');
    }
  });

  // get the chat message from the server
  socket.on('createMessage', (message) => {
    $('.messages').append(`<li class="message"><b>user</b><br/>${message}</li>`)
    scrollToBottom();
  });
})

// listen to user-disconnect from server
// and remove user from call
socket.on('user-disconnected', (userId) => {
  if(users[userId]){
    console.log(userId)
    users[userId].close();
  } 
})

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
  // However this doesn't work well. We use socket event instead
  call.on('close', () => {
    video.remove();
  })

  // every userId is linked to a call made
  users[userId] = call
}

const addVideoStream = (video, stream) => {
  video.srcObject = stream;
  video.addEventListener('loadedmetadata', () => {
    video.play();
  });
  // Append the video to the video-grid div in room.ejs
  videoGrid.append(video);
}

// This function scrolls the chat window to the bottom when overflowing
// This works together with css `overflow-y: scroll;`
const scrollToBottom = () => {
  let d = $('.main__chat__window');
  d.scrollTop(d.prop("scrollHeight"));
}

// change icon and text onclick for mute/unmute
const muteUnmute = () => {
  const enabled = myVideoStream.getAudioTracks()[0].enabled;
  if(enabled){
    myVideoStream.getAudioTracks()[0].enabled = false;
    setUnmuteButton();
  } else {
    setMuteButton();
    myVideoStream.getAudioTracks()[0].enabled = true;
  }
}

const setUnmuteButton = () => {
  const html = `<i class="unmute fas fa-microphone-slash"></i>
                <span>Unmute</span>`
  document.querySelector(".main__mute__button").innerHTML = html;
}

const setMuteButton = () => {
  const html = `<i class="fas fa-microphone"></i>
                <span>Mute</span>`
  document.querySelector(".main__mute__button").innerHTML = html;
}

// change icon and text onclick for play/stop video
const stopPlayVideo = () => {
  const enabled = myVideoStream.getVideoTracks()[0].enabled;
  if(enabled){
    myVideoStream.getVideoTracks()[0].enabled = false;
    setPlayVideo();
  } else {
    setStopVideo();
    myVideoStream.getVideoTracks()[0].enabled = true;
  }
}

const setStopVideo = () => {
  const html = `<i class="fas fa-video"></i>
                <span>Stop Video</span>`
  document.querySelector(".main__video__button").innerHTML = html;
}

const setPlayVideo = () => {
  const html = `<i class="stop fas fa-video-slash"></i>
                <span>Play Video</span>`
  document.querySelector(".main__video__button").innerHTML = html;
}



