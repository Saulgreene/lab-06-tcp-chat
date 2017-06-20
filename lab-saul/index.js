'use strict';

const net = require('net');
const server = net.createServer();

let clientPool = [];

server.on('connection', (socket) => {
  socket.write('hello socket, welcome to slugchat!\n')
  socket.nickname = `user_${Math.random()}`
  console.log(`${socket.nickname} connected!`)

  clientPool = [...clientPool, socket]

  let handleDisconnect = () => {
    console.log(`${socket.nickname} left the chat`);
    clientPool = clientPool.filter(item => item !== socket);
  }

  socket.on('error', handleDisconnect)
  socket.on('close', handleDisconnect)

  socket.on('data', (buffer) => {
    let data = buffer.toString()
    if(data.startsWith('/nickname')){
      socket.nickname = data.split('/nickname ')[1] || socket.nickname
      socket.nickname = socket.nickname.trim();
      socket.write(`you are now know as ${socket.nickname}`);
      return;
    }
    if (data.startsWith('/dm')){
      'should allow user to send a message directly to another user by nick name'
    }
    if (data.startsWith('/troll')){
      'should take in a number and a message and send the message to everyone that number of times'
    }
    if (data.startsWith('quit')){
      'should close the connection with the user'
    }

    // "/dm slugbyte how are you"
    if(data.startsWith('/dm')){
      let content = data.split('/dm')[1] || ''
      //'slugbyte how are you'
    }

    clientPool.forEach((item) => {
      item.write(`${socket.nickname}: ${data}`)
    })
  });
});

server.listen(3000, () => {
  console.log('server up on port 3000');
});
