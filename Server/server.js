const _ = require('lodash');
const Server = require('socket.io')();

const players = [];

Server.listen(9208);
Server.on('connect', (Socket) => {
	console.log(`${Socket.id} was connected..`);
	players.push(Socket.id);

	Server.emit('player:spawn', Socket.id);
	Socket.emit('player:all', players);

	Socket.on('player:move', (id, data) => {
		Server.emit('player:moved', id, data.position, data.flip);
	});

	Socket.on('player:animate', (animation, state) => {
		Server.emit('player:animated', Socket.id, animation, state);
	});

	Socket.on('disconnect', () => {
		Server.emit('player:unspawn', Socket.id);
		_.remove(players, (player) => {
			return player === Socket.id;
		});
		
		console.log(`${Socket.id} was disconnected..`);
  	});
});