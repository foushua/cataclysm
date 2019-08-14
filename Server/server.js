const _ = require('lodash');
const Server = require('socket.io')();

Server.listen(9208);
Server.on('connect', (Socket) => {
	console.log(`${Socket.id} was connected..`);
	Socket.on('disconnect', () => {
        console.log(`${Socket.id} was disconnected..`);
    });
});