// const express = require('express');
// const http = require('http');
// const socketIo = require('socket.io');

// const app = express();
// const server = http.createServer(app);
// const io = socketIo(server);

// io.on('connection', (socket) => {
//     console.log('Client connected:', socket.id);

//     // Listen for drone connection
//     socket.on('drone-connected', () => {
//         console.log('Drone connected');
//         socket.join('drone-room');
//     });

//     socket.on('send-number', (number) => {
//         console.log('Received number:', number);
//     });

//     socket.on('disconnect', () => {
//         console.log('Client disconnected:', socket.id);
//     });
// });

// server.listen(3000, () => {
//     console.log('Cloud server listening on port 3000');
// });

const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

io.on('connection', (socket) => {
    console.log('Client connected:', socket.id);

    // Listen for drone connection
    socket.on('drone-connected', () => {
        console.log('Drone connected');
        socket.join('drone-room');
    });

    // Listen for pilot connection
    socket.on('pilot-connected', () => {
        console.log('Pilot connected');
        socket.join('pilot-room');
    });

    // Listen for control station connection
    socket.on('control-station-connected', () => {
        console.log('Control station connected');
        socket.join('control-station-room');
    });

    // Forward & log the received number to control station client
    socket.on('send-number', (number) => {
        socket.to('control-station-room').emit('forwarded-number', number);
    });

    // Forward the command from the pilot to the drone
    socket.on('send-command', (command) => {
        socket.to('drone-room').emit('forwarded-command', command);
    });

    // Forward the confirmation from the drone to the pilot
    socket.on('send-confirmation', (confirmation) => {
        socket.to('pilot-room').emit('forwarded-confirmation', confirmation);
    });

    socket.on('disconnect', () => {
        console.log('Client disconnected:', socket.id);
    });
});

server.listen(3000, () => {
    console.log('Cloud server listening on port 3000');
});
