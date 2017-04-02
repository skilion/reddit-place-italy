/*************************
 *  Reddit /r/place API  *
 *************************/

let request = require('request');
request = request.defaults({ baseUrl: 'https://www.reddit.com/api/' });

// perform login
exports.login = function(username, password, jar, callback) {
	let options = {
		url: 'login',
		form: { user: username, passwd: password, api_type: "json" },
		jar: jar
	}
	request.post(
		options,
		callback
	);
}

// get a pixel color
exports.pixel = function(x, y, callback) {
	request.get(
		'place/pixel.json?x=' + x + '&y=' + y,
		callback
	);
}

// get the waiting time
exports.time = function(jar, callback) {
	let options = {
		url: 'place/time.json',
		jar: jar
	}
	request.get(
		options,
		callback
	);
}

// set a pixel color
exports.draw = function(x, y, color, jar, modhash, callback) {
	let options = {
		url: 'place/draw.json',
		form: { x: x, y: y, color: color },
		headers: { 'X-Modhash': modhash },
		jar: jar
	}
	request.post(
		options,
		callback
	);
}

// download the board bitmap
exports.board = function(callback) {
	let options = {
		url: 'place/board-bitmap',
		encoding: null
	}
	request.get(options, callback);
}
