const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const {Server} = require('socket.io');
const ACTIONS = require('./src/Actions');

const io= new Server(server);
const userSocketMap={

};
function getAllConnectedClients(roomId) {
    // Map
    return Array.from(io.sockets.adapter.rooms.get(roomId) || []).map(
        (socketId) => {
            return {
                socketId,
                username: userSocketMap[socketId],
            };
        }
    );
    
}
io.on('connection', (socket) => {
    console.log('socket connected', socket.id);

    socket.on(ACTIONS.JOIN, ({ roomId, username }) => {
        console.log("Socket on ACTIONS.JOIN");
        userSocketMap[socket.id] = username;
        console.log("User Socket Map after");
        socket.join(roomId);
        console.log("User Socket Map after");
        console.log("Before Clients Call ");
        const clients = getAllConnectedClients(roomId);
        console.log("This one : ", clients);
        // console.log("That one :", clients.socketId);
        clients.forEach(({ socketId }) => {
            // console.log(socketId);
            io.to(socketId).emit(ACTIONS.JOINED, {
                clients,
                username,
                socketId: socket.id,
            });
        });
    });

    socket.on(ACTIONS.CODE_CHANGE, ({roomId, code}) =>{
        console.log('receiving', code);
        socket.in(roomId).emit(ACTIONS.CODE_CHANGE, {
            code
        })
    })

    socket.on('disconnecting', () => {
        const rooms=[...socket.rooms];
        rooms.forEach((roomId) => {
            socket.in(roomId).emit(ACTIONS.DISCONNECTED, {
                socketId: socket.id,
                username: userSocketMap[socket.id],
            });
        
        } );
        delete userSocketMap[socket.id];
        socket.leave();
    })
});
const PORT=process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Listening on port ${PORT}`));