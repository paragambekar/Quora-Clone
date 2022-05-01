
module.exports.chatSockets = function(socketServer){

    const Server = require('socket.io');
    
    let io  = Server(socketServer, {
        cors : {
            origin : 'http://localhost:8000'
        }
    })

    io.sockets.on('connection', function(socket){
        console.log('new connectiion received',socket.id);

        socket.on('disconnect', function(){
            console.log('socket disconnected');
        });

        socket.on('join_room', function(data){
            console.log('Joining request received',data);

            socket.join(data.chatroom);

            // to emit in a specific chatroom 
            io.in(data.chatroom).emit('user_joined',data);
        });

        socket.on('send_message', function(data){
            io.in(data.chatroom).emit('receive_message',data);
        });
    
    });

    
}

// 1. We created a chatServer and passed app to it 
// 2. Define chatsocket and selected its chatSockets fucntion and passed our chatservr to it 
// chat server is listening on port 5000
// 3. we are sending connect request from the frontend and calling the connectionHandler which detects is the connection has be established
// how do it know if connection is established ?
// this file sends and acknowledgement that connection has be established automatically 

// socket.on detects the event that is sent by the client  
