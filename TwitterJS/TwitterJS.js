/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


var http = require('http');
http.createServer(function (req, res) {

    

    res.writeHead(200, {
        'Content-Type': 'text/plain; charset=UTF-8'
    });

    res.end('Hello from Hello World.\n');



}).listen(9080, "");

var oauth_token = 'SHasi0egwn665K2V6amKd1l5l';

var oauth_token_secret = 'V3IKefZ877XCnATZKuWcn5AAGFyrT6Fgnhc03dTYTQS8cvRcmv';

var OAuth= require('oauth').OAuth;

var oa = new OAuth(
	"https://api.twitter.com/oauth/request_token",
	"https://api.twitter.com/oauth/access_token",
	"SHasi0egwn665K2V6amKd1l5l",
	"V3IKefZ877XCnATZKuWcn5AAGFyrT6Fgnhc03dTYTQS8cvRcmv",
	"1.0",
	"https://localhost:9080",
	"HMAC-SHA1"
);



//https://api.twitter.com/oauth/authorize?oauth_token=Mv079wAAAAAAvmi5AAABVUOyDgc



//https://api.twitter.com/oauth/authorize?oauth_token=Z6eEdO8MOmk394WozF5oKyuAv855l4Mlqo7hhlSLik

var Twit = require('twit');

var T = new Twit({
    consumer_key: oauth_token,
    consumer_secret: oauth_token_secret,
    access_token: '741832456148385792-J8zighd2l1CfEwf7Sedd1jlpHY9t2Ok',
    access_token_secret: 'XiiBNrjz1Z4HmGfp5dUGvQWgzodye9mjpn3sWnfhdveVd',
    timeout_ms: 60 * 1000 // optional HTTP request timeout to apply to all requests.
})

T.get('/auth/twitter', function(req, res){
	oa.getOAuthRequestToken(function(error, oauth_token, oauth_token_secret, results){
		if (error) {
			console.log(error);
			//res.send("yeah no. didn't work.")
		}
		else {
			req.session.oauth = {};
			req.session.oauth.token = oauth_token;
			console.log('oauth.token: ' + req.session.oauth.token);
			req.session.oauth.token_secret = oauth_token_secret;
			console.log('oauth.token_secret: ' + req.session.oauth.token_secret);
			open('https://twitter.com/oauth/authenticate?oauth_token='+oauth_token)
	}
	});
});
/*
T.get('/auth/twitter/callback', function(req, res, next){
        console.log(req)
	if (req.session.oauth) {
		req.session.oauth.verifier = req.query.oauth_verifier;
		var oauth = req.session.oauth;

		oa.getOAuthAccessToken(oauth.token,oauth.token_secret,oauth.verifier, 
		function(error, oauth_access_token, oauth_access_token_secret, results){
			if (error){
				console.log(error);
				res.send("yeah something broke.");
			} else {
				req.session.oauth.access_token = oauth_access_token;
				req.session.oauth,access_token_secret = oauth_access_token_secret;
				console.log(results);
				res.send("worked. nice one.");
			}
		}
		);
	} else
		next(new Error("you're not supposed to be here."))
});
*/
T.get('statuses/home_timeline', {}, function (err, data, response) {
    for (var i = 0; i < 5; i++) {
        console.log(data[i].text);
    }
})