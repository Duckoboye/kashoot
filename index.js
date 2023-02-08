const { Server } = require('socket.io');

const io = new Server({
	cors: {
		origin: ['http://127.0.0.1:5500', 'http://127.0.0.1:3000'],
	},
});

io.on('connection', (socket) => {
	// ...
	console.log(socket);
	socket.emit('hello', 'Hello from server!');
});

io.listen(3000);
