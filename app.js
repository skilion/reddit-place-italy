let fs = require('fs');
let PNG = require('pngjs').PNG;
let request = require('request');
var jsonfile = require('jsonfile');

let r = require('./r');
let diff = require('./diff');


if (!fs.existsSync("users.json")) {
	console.log('Put your credentials in "users.json"');
	process.exit(1);
}
let users = jsonfile.readFileSync("users.json");
let extra = {}; // store the cookie jar and modhash for each user

for (var key in users) {
	init(key);
}

function init(username) {
	extra[username] = { 'jar': request.jar() };
	r.login(username, users[username], extra[username]['jar'], function(err, httpResponse, body) {
		try {
			body = JSON.parse(body);
		} catch (e) {
			// if reddit is under heavy load it will return garbage
			console.log(username + ': retry login in 10 secs');
			setTimeout(init.bind(null, username), 10000);
			return;
		}
		if (body.json.errors.length) {
			console.log(username + ': login error');
			return;
		}
		extra[username]['modhash'] = body.json.data.modhash;
		console.log(username + ': successfully logged in');
		// randomize starting time to avoid loop running at the same time
		setTimeout(loop.bind(null, username), Math.floor(Math.random() * 10000));
	});
}

function loop(username) {
	r.time(extra[username]['jar'], function(err, httpResponse, body) {
		try {
			body = JSON.parse(body);
		} catch (e) {
			// if internet connection is lost, this is the first exception
			console.log(username + ': could not get the waiting time');
			setTimeout(loop.bind(null, username), 60000);
			return;
		}
		if ('error' in body) {
			if (body.error == 403) {
				console.log(username + ' is forbidden to use /r/place');
			} else if (body.error == 429) {
				// Too many requests
				setTimeout(loop.bind(null, username), 10000);
			}
			return;
		}
		if (body.wait_seconds == 0) {
			var d = new Date();
			console.log(d.toUTCString());
			console.log(username + ': finding pixel...');
			findPixel(username);
			return;
		}
		setTimeout(loop.bind(null, username), Math.floor(body.wait_seconds * 1000));
	});
}

let lock = 0;
function findPixel(username) {
	// simple mutex
	if (lock) {
		setTimeout(loop.bind(null, username), 5000);
		return;
	} else lock = 1;
	diff.findDiffPixel(function(x, y, color) {
		if (x != -1) setPixel(username, x, y, color);
		setTimeout(loop.bind(null, username), 10000);
		lock = 0;
	});
}

function setPixel(username, x, y, color) {
	let jar = extra[username]['jar'];
	let modhash = extra[username]['modhash'];
	r.draw(x, y, color, jar, modhash, function(err, httpResponse, body) {
		let res = JSON.parse(body);
		if ("json" in res) {
			console.log(username + ': r.draw failed: ' + body);
		}
		console.log(username + ': pixel (' + x + ', ' + y + ') set to ' + color);
	});
}
