const socket = io();
const chatForm = document.getElementById('chat-form');
const roomName = document.getElementById('room-name');
const userList = document.getElementById('users');
const chatMessages = document.querySelector('.chat-messages');
const videocall = document.querySelector('.fas');


videocall.addEventListener('click',()=>{
  console.log('video chat on')
  socket.emit('videocall', { username, room });

})

// ?    A querystring parser that supports nesting and arrays, with a depth limit
//  ? window.location.search ==> ?username=Sahil&room=JavaScript
// Get username and room from URL using Qs library
const { username, room } = Qs.parse(location.search, {
    ignoreQueryPrefix: true
  });

console.log(username,room);


// Join chatroom
socket.emit('joinRoom', { username, room });


// Get room and users for sidebar
socket.on('roomUsers', ({ room, users }) => {
    outputRoomName(room);
    outputUsers(users);
  });


// Message from server
socket.on('message',msg =>{
    console.log(msg);
    outputMessage(msg);

    // every time we get a msg we want to scroll down to that message
    chatMessages.scrollTop = chatMessages.scrollHeight;

})

// Message submit
chatForm.addEventListener('submit', e => {
    e.preventDefault();
    
  // Get message text
  let msg = e.target.elements.msg.value;
//   console.log(msg);

   // Emit message to server
  socket.emit('chatMessage',msg);
  
  // Clear input
  e.target.elements.msg.value = '';
  e.target.elements.msg.focus();
})


// Output message to DOM
function outputMessage(message) {
    const div = document.createElement('div');
    div.classList.add('message');
    // const p = document.createElement('p');
    div.innerHTML = `<p class="meta">${message.username} <span>${message.time}</span></p>
    <p class="text">
        ${message.text}
    </p>`
    document.querySelector('.chat-messages').appendChild(div);

}


// ? for sidebar

// Add room name to DOM
function outputRoomName(room) {
    roomName.innerText = room;
  }
  
  // Add users to DOM
  function outputUsers(users) {
    userList.innerHTML = `
    ${users.map(user => `<li>${user.username}</li>`).join('')}`;
    // users.forEach(user=>{
    //   const li = document.createElement('li');
    //   li.innerText = user.username;
    //   userList.appendChild(li);
    // });
   }
  