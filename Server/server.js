const _ = require('lodash');
const Websocket = require('socket.io')(9208, {});

Websocket.on('connect', (Socket) => {
	console.log(`${Socket.id} was connected..`);
	Socket.on('disconnect', () => {
        console.log(`${Socket.id} was disconnected..`);
    });
});