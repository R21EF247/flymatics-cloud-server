
const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

io.on('connection', (socket) => {
    console.log('Client connected:', socket.id);

    // Handle drone, pilot, and control station connections
    setupConnectionHandlers(socket);

    socket.on('video-stream', (base64Data) => {
        // Forward the base64 video data to control station
        io.in('control-station-room').emit('video-stream', base64Data);
    });

    socket.on('disconnect', () => {
        console.log('Client disconnected:', socket.id);
    });
});

const setupConnectionHandlers = (socket) => {
    socket.on('drone-connected', () => {
        console.log('Drone connected');
        socket.join('drone-room');
    });


    socket.on('control-station-connected', () => {
        console.log('Control station connected');
        socket.join('control-station-room');
    });

    // Additional handlers can be added here
};

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log('Cloud server listening on port', PORT);
});
