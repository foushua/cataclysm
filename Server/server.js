const _ = require('lodash');
const Server = require('socket.io')();

const players = [];

Server.listen(process.env.NODE_ENV === 'production' ? process.env.SERVER_PORT : 9208);
Server.on('connect', (Socket) => {
	console.log(`${Socket.id} was connected..`);
	players.push(Socket.id);

	Server.emit('player:spawn', Socket.id);
	Socket.emit('player:all', players);

	Socket.on('disconnect', () => {
		Server.emit('player:unspawn', Socket.id);
		_.remove(players, (player) => {
			return player === Socket.id;
		});
		
		console.log(`${Socket.id} was disconnected..`);
  	});
});