var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io').listen(server);
var path = require("path");
var bodyParser = require("body-parser");
var mongodb = require("mongodb");
var ObjectID = mongodb.ObjectID;
var nicknames = [];
var messageLimit25 = [];
var notread = false;
var MESSAGES_COLLECTION = "messages";
var db;

app.use(bodyParser.json());

mongodb.MongoClient.connect(process.env.MONGODB_URI||"mongodb://angelhack:angelhack@ds013414.mlab.com:13414/messages", function(err,database) {
	if (err) {
		console.log("Got to error");
		console.log(err);
		process.exit(1);
	}
	db = database;
	console.log("Database Connection ready");
})

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
		callback(true,socket.nickname);
	})

	socket.on('send message', function(data){
		console.log(notread);
		messageObject = {message: data, nickname: socket.nickname, unread: notread};
		messageLimit25.push(messageObject);
		if (messageLimit25.length === 26) {
			messageLimit25.shift();
		}
		
		io.sockets.emit('new message', messageLimit25);
		db.collection(MESSAGES_COLLECTION).insertOne(messageObject, function (err,result) {
		if(err){
			console.log(err);
		} else {
			console.log("We good!!");
		}
	})
	});
	socket.on('disconnect', function(data){
		
		if(!socket.nickname) {
			
			return;
		}
		console.log("You got disconnected!")
		notread = true;
	});	
});