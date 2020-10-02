const express = require('express');
const path = require('path');
const app = express();
const server = require('http').Server(app)
const io = require('socket.io').listen(server);
const formatMessage = require('./utils/messages');
const { ExpressPeerServer }  =require('peer')
const PeerServer = ExpressPeerServer(server)
const {v4:uuidV4} = require('uuid')

const {
    userJoin,
    getCurrentUser,
    userLeave,
    getRoomUsers
  } = require('./utils/users');




// Set static folder
app.use(express.static( 'public'));
app.use('/peerjs',PeerServer);




let roomname;
const botName = 'Admin Bot';

// Run when Client Connects
// ? listening to the event i.e. connection
io.on('connection',(socket)=>{
  socket.on('join-room', (roomId, userId) =>{
    socket.join(roomId);
    socket.broadcast.emit('user-connected',userId);
    
    socket.on('disconnect',()=>{
      socket.broadcast.emit('user-disconnected',userId)
    })

})


    socket.on('joinRoom', ({ username, room }) => {

    const user = userJoin(socket.id, username, room);

     socket.join(user.room);
    
    //  ? emiting a msg to myself only
    socket.emit('message',formatMessage(botName, 'Welcome to Chat !'))

    // ? broadcast when a user connects to all the users except me
    socket.broadcast.to(user.room).emit('message',formatMessage(botName,`${user.username} has joined the chat`));
      //for videocall
    socket.on('videocall',({username,room})=>{
      console.log(uuidV4);
      roomname=room;
      io.to(user.room).emit('message',formatMessage(username,`<a target='_blank' href="/${uuidV4()}">click Here to join videocall </a>`))
      console.log(roomname);
    })

    // Send users and room info
    io.to(user.room).emit('roomUsers', {
        room: user.room,
        users: getRoomUsers(user.room)
      });


})
    //  ? Runs when Client disconnects
    socket.on('disconnect',()=>{

        const user = userLeave(socket.id);
        if(user){
        // ? This msg will display to all the users
        io.to(user.room).emit('message',formatMessage(botName,`${user.username} has left the chat`))
    
    // Send users and room info
      io.to(user.room).emit('roomUsers', {
        room: user.room,
        users: getRoomUsers(user.room)
      });
    
    }
    })

    //  ? Listen for chatMessage
    socket.on('chatMessage', msg => {
        const user = getCurrentUser(socket.id);

        io.to(user.room).emit('message',formatMessage(user.username,msg))
    })


})
app.set('view engine', 'ejs');
app.get(`/:roomid`,(req,res)=>{
    const roomid = req.params.roomnm
  res.render('videocall',{roomId :roomid})
  
})
// app.get('/videocall/:videoid',(req,res)=>{
//   res.render('video')
// })


// listening to the server
const port = process.env.PORT || 5000;

server.listen(port, () =>console.log(`Server running on port ${port} 🔥`) )