var express = require('express');
var app = express();
var bodyParser = require('body-parser');

var PORT = process.env.PORT || 3000;
var gmail = true;
var twitter = true;
var message = true;

app.use(bodyParser.json());

// app.use('/', function(req,res) {
// 	console.log("Serving up main");
// 	res.send("controller api");
// });

app.post('/gmail', function(req, res) {
	console.log("Hitting gmail");
	gmail = (!gmail);
	res.status(200).send("success");
});

app.post('/twitter', function(req, res) {
	twitter = (!twitter);
	res.status(200).send("success");
});

app.post('/message', function(req,res) {
	message = (!message);
	res.status(200).send("success");
});

app.get('/', function(req,res) {
	console.log("Got a get request");
	packet = {gmail:gmail,
		twitter:twitter,
		message:message};
	res.status(200).json(packet);
});

app.listen(PORT, function() {
	console.log("Server hosted on " + PORT);
})
