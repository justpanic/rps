const http = require('http');
const express = require('express');
const socketio = require('socket.io');

const RpsGame = require('./rps-game');

const app = express();
const clientPath = `${__dirname}//..//client`
console.log(`serving static from ${clientPath}`)

app.use(express.static(clientPath))
 
const server = http.createServer(app);
const io = socketio(server)

let waitingPlayer = null;

io.on('connection', (sock) => {
    if(waitingPlayer) {
        // start game

        //sock.emit('message', 'game start');
        //waitingPlayer.emit('message', 'game start')
        new RpsGame(waitingPlayer, sock)
        waitingPlayer = null;       
    } else { 
        waitingPlayer = sock;
        waitingPlayer.emit('message', '상대를 기다립니다.')

    }

    sock.on('message', (text) => {
        io.emit('message', text);
    });
})                                                                                                                                                                                                                                                                                                                        

server.on('error', (err) => {
    console.error('Server error:', err)
});
server.listen(8080, () => {
    console.log('RPS started on 8080')
})