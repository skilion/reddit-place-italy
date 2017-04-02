let fs = require('fs');
let PNG = require('pngjs').PNG;

let r = require('./r');

r.board(function(err, httpResponse, body) {
	bitmap2PNG(body).pack().pipe(fs.createWriteStream('board.png'));
});

exports.saveBoardInPNG = function(bitmap, callback) {
	bitmap2PNG(bitmap).pack().pipe(fs.createWriteStream('board.png'));
}

const colors = [
	[255, 255, 255],
	[228, 228, 228],
	[136, 136, 136],
	[34, 34, 34],
	[255, 167, 209],
	[229, 0, 0],
	[229, 149, 0],
	[160, 106, 66],
	[229, 217, 0],
	[148, 224, 68],
	[2, 190, 1],
	[0, 211, 221],
	[0, 131, 199],
	[0, 0, 234],
	[207, 110, 228],
	[130, 0, 128]
];

function bitmap2PNG(bitmap) {
	let img = new PNG({ width: 1000, height: 1000, inputHasAlpha: false });
	let i = 4;
	for (let y = 0; y < 1000; y++) {
		for (let x = 0; x < 500; x++) {
			let b = bitmap[i];
			let c1 = colors[b >> 4];
			let c2 = colors[b & 0xF];
			let idx = (x * 2 + y * 1000) * 3;
			img.data[idx + 0] = c1[0];
			img.data[idx + 1] = c1[1];
			img.data[idx + 2] = c1[2];
			img.data[idx + 3] = c2[0];
			img.data[idx + 4] = c2[1];
			img.data[idx + 5] = c2[2];
			i++;
		}
	}
	return img;
}
