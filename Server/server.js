const _ = require('lodash');
const Geckos = require('@geckos.io/server').default;
const { iceServers } = require('@geckos.io/server');

const Server = Geckos({iceServers: process.env.NODE_ENV === 'production' ? iceServers : []});

Server.listen();
Server.onConnection(socket => {
    console.log(`${socket.id} was connected`);
    socket.onDisconnect(() => {
      console.log(`${socket.id} was disconnected`);
    });
});