let fs = require('fs');
let PNG = require('pngjs').PNG;
var jsonfile = require('jsonfile');

let r = require('./r');

var users = jsonfile.readFileSync("users.json");
if (users.test) {
	console.log('Put your credentials in "users.json"');
	process.exit(1);
}

let username, password, modhash;
for (var key in users) {
	username = key;
	password = users[username];
}


r.login(username, password, function(err, httpResponse, body) {
	body = JSON.parse(body);
	if (body.json.errors.length) {
		console.log('login error');
		return;
	}
	modhash = body.json.data.modhash;
	loop();
});

function loop() {
	r.time(function(err, httpResponse, body) {
		body = JSON.parse(body);
		if (body.wait_seconds == 0) {
			var d = new Date();
			console.log(d);
			console.log('Finding pixel...');
			findPixel();
			return;
		}
		setTimeout(loop, 60000);
	});
}

function findPixel() {
	let x = getRandomInt(119, 129);
	let y = getRandomInt(326, 409);
	r.pixel(x, y, function(err, httpResponse, body) {
		body = JSON.parse(body);
		if (body.color != 0) {
			setPixel(x, y);
			return;
		}
		setTimeout(findPixel, 5);
	});
}

function setPixel(x, y) {
	r.draw(x, y, 0, modhash, function(err, httpResponse, body) {
		let res = JSON.parse(body);
		if ("json" in res) {
			console.log('r.draw failed ' + body);
		}
		console.log('Pixel set ' + x + ' ' + y);
		setTimeout(loop, res.wait_seconds * 1000);
	});
}

function getRandomInt(min, max) {
	return Math.floor(Math.random() * (max - min)) + min;
}
