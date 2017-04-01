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
	r.board(function(err, httpResponse, body) {
		let bitmap = new Array(1000 * 1000);
		let i = 4;
		for (let y = 0; y < 1000; y++) {
			for (let x = 0; x < 500; x++) {
				let b = body[i];
				let p1 = b >> 4;
				let p2 = b & 0xF;
				let idx = x * 2 + y * 1000;
				bitmap[idx] = p1;
				bitmap[idx + 1] = p2;
				i++;
			}
		}
		findPixel2(bitmap);
	});
}

function findPixel2(bitmap) {
	for (let i = 0; i < 1000000; i++) {
		let x = getRandomInt(119, 129);
		let y = getRandomInt(326, 407);
		if (bitmap[x + y * 1000] != 0) {
			setPixel(x, y);
			return;
		}
	}
	setTimeout(findPixel, 5);
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
