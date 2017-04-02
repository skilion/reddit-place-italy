let fs = require('fs');
let PNG = require('pngjs').PNG;
var jsonfile = require('jsonfile');

let r = require('./r');
let diff = require('./diff');


if (!fs.existsSync("users.json")) {
	console.log('Put your credentials in "users.json"');
	process.exit(1);
}
var users = jsonfile.readFileSync("users.json");

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
	
	// simple error handler
	process.on('uncaughtException', function (err) {
		console.error((new Date).toUTCString() + ' uncaughtException:', err.message);
		console.error(err.stack);
		setTimeout(loop, 60000);
	});
});

function loop() {
	r.time(function(err, httpResponse, body) {
		body = JSON.parse(body);
		if (body.wait_seconds == 0) {
			var d = new Date();
			console.log(d.toUTCString());
			console.log('Finding pixel...');
			findPixel();
			return;
		}
		setTimeout(loop, Math.floor(body.wait_seconds * 1000));
	});
}

function findPixel() {
	diff.findDiffPixel(function(x, y, color) {
		if (x != -1) setPixel(x, y, color);
		setTimeout(loop, 10000);
	});
}

function setPixel(x, y, color) {
	r.draw(x, y, color, modhash, function(err, httpResponse, body) {
		let res = JSON.parse(body);
		if ("json" in res) {
			console.log('r.draw failed: ' + body);
		}
		console.log('Pixel (' + x + ', ' + y + ') set to ' + color);
	});
}
