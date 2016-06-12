var express = require("express");
var path = require("path");
var bodyParser = require("body-parser");
var mongodb = require("mongodb");
var ObjectID = mongodb.ObjectID;

var MESSAGES_COLLECTION = "messages";

var app = express();
//app.use(express.static(__dirname + "/public"));
app.use(bodyParser.json());

var db;

mongodb.MongoClient.connect(process.env.MONGODB_URI||"mongodb://angelhack:angelhack@ds013414.mlab.com:13414/messages", function(err,database) {
	if (err) {
		console.log("Got to here");
		console.log(err);
		process.exit(1);
	}
	db = database;
	console.log("Database Connection ready");

	var server = app.listen(process.env.PORT|| 8000, function () {
		var port = server.address().port;
		console.log("Server is on port " + port);
	})
})

function handleError(res, reason, message, code) {
	console.log("ERROR: " + reason);
	res.status(code||500).json({"error":message});
}
/* /contacts
 * GET: finds all contacts
 * POST: creates a new contact
*/

app.get("/messages", function (req, res) {
	db.collection(MESSAGES_COLLECTION).find({}).toArray(function(err,docs) {
		if (err) {
			handleError(res, err.message, "Failed to get contacts.");
		} else {
			res.status(200);
		}
	});
});

app.post("/message", function(req,res) {
	var newMessage = req.body;
	newMessage.timestamp = new Date();

	if(!(req.body.nickname)) {
		handleError(res, "Invalid user input", "Must provide nickname and message", 400);
	}

	db.collection(MESSAGES_COLLECTION).insertOne(newMessage, function (err,result) {
		if(err){
			handleError(res, err.message, "Failed to create new account");
		} else {
			res.status(201).json(result.ops[0]);
		}
	})

})

