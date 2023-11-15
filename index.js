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
    socket.on('Data Received from Nano', (nanoData) => {
        console.log('Nano port data received:', nanoData);
        socket.to('control-station-room').emit('forwarded-nano-data', nanoData);
    });
    
    // Forward Pico port data to control station
    socket.on('Data Received from Pico', (picoData) => {
        console.log('Pico port data received:', picoData);
        socket.to('control-station-room').emit('forwarded-pico-data', picoData);
    });
    socket.on('disconnect', () => {
        console.log('Client disconnected:', socket.id);
    });
    socket.on('start-video-stream', () => {
        const libcameraVid = spawn('libcamera-vid', ['-t', '0', '-o', '-']);

        libcameraVid.stdout.on('data', (data) => {
            socket.emit('video-stream', data);
        });

        libcameraVid.stderr.on('data', (data) => {
            console.error(`stderr: ${data}`);
        });

        libcameraVid.on('close', (code) => {
            console.log(`child process exited with code ${code}`);
        });
    });
});


const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log('Cloud server listening on port', PORT);
});