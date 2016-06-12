var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io').listen(server);
//var PORT = process.env.PORT || 8000;
var nicknames = [];

server.listen(process.env.PORT || 8000);

app.get('/', function (req, res) {
	res.sendFile(__dirname + '/index.html');
});

io.sockets.on('connection', function(socket){
	socket.on('new user', function(data, callback) {
		nicknames.forEach(function(thing) {
			if (data === thing) {
				callback(false);
			}
		})
		socket.nickname = data;
		nicknames.push(socket.nickname);
		io.sockets.emit('usernames', nicknames);
		callback(true);
	})

	socket.on('send message', function(data){
		console.log(data);
		io.sockets.emit('new message', data);
	});
});