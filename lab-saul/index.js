'use strict';

const net = require('net');
const server = net.createServer();

let clientPool = [];

server.on('connection', (socket) => {
  socket.write('hello socket, welcome to slugchat!\n');
  socket.nickname = `user_${Math.random()}`;
  console.log(`${socket.nickname} connected!`);

  clientPool = [...clientPool, socket];

  let handleDisconnect = () => {
    console.log(`${socket.nickname} left the chat`);
    clientPool = clientPool.filter(item => item !== socket);
  };

  socket.on('error', handleDisconnect);
  socket.on('close', handleDisconnect);

  socket.on('data', (buffer) => {
    let data = buffer.toString();
    if(data.startsWith('/nickname')){
      socket.nickname = data.split('/nickname ')[1] || socket.nickname;
      socket.nickname = socket.nickname.trim();
      socket.write(`you are now know as ${socket.nickname}`);
      return;
    }
    if(data.startsWith('/dm')){
      let content = data.split('/dm')[1] || '';
      let dmNickname = content.split(' ')[1];

      let msg = data.split(' ');
      msg = msg.slice(2);
      clientPool.forEach((item) =>{
        if(item.nickName == dmNickname){
          item.write(`${socket.nickName} says: ${msg.join(' ')}`);
        }
      });
      return;
    }

    if(data.startsWith('/troll')){
      let content = data.split(' ');
      let msg = content.slice(2);

      for(var i = 0; i < content[1]; i++){
        clientPool.forEach((item) =>{
          item.write(`${msg.join(' ')}`);
        });
      }
      return;
    }
    if(data.startsWith('/quit')){
      socket.end();
      console.log( `${socket.nickName}'s session has ended`);
      return;
    }

      // "/dm slugbyte how are you"
    if(data.startsWith('/dm')){
      let content = data.split('/dm')[1] || '';
        //'slugbyte how are you'
    }

    clientPool.forEach((item) => {
      item.write(`${socket.nickname}: ${data}`);
    });
  });
});

server.listen(3000, () => {
  console.log('server up on port 3000');
});
