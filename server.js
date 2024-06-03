const express = require('express');
const https = require('https');
const socketIo = require('socket.io');
const fs = require('fs');

const app = express();

const server = https.createServer({
    key: fs.readFileSync('./ssl/server.key'),
    cert: fs.readFileSync('./ssl/server.crt'),
}, app);

const io = new socketIo.Server(server, {
    cors: {
        origin: "*",
        allowedHeaders: "*",
        methods: ["GET", "POST"]
    }
});

users = []

io.on('connection', (socket) => {
    let user
    for (let i = 0; i <= users.length; i++){
        user = {"username": `C${i+1}`, id: socket.id}
    }

    console.log(`Client ${user.username} connected`);
    
    users.push(user)
    socket.emit("connection", user);

    socket.on('offer', (offer, userid) => {
        console.log('Received offer:', offer);
        // Aquí puedes manejar la oferta y generar una respuesta
        // Por ahora, simplemente reenviamos la oferta a todos los demás clientes
        let id = ""
        for (let i of users){
            if ( i.username == userid )
                id = i.id;
        }
        socket.to(id).emit('offer', offer);
    });

    socket.on('answer', (answer, userid) => {
        console.log('Received answer:', answer);
        // Aquí puedes manejar la respuesta
        // Por ahora, simplemente reenviamos la respuesta a todos los demás clientes
        let id = ""
        for (let i of users){
            if ( i.username == userid )
                id = i.id;
        }
        socket.to(id).emit('answer', answer);
    });

    socket.on('disconnect', () => {
        console.log('Client disconnected');
    });
});

server.listen(8000, '0.0.0.0', () => {
    console.log('Listening on port 8000');
});
