"use strict";

var util = require('util');
var Base = require('./base');
var fs = require('fs');
var mineType = require('../../lib/mineType');


var Get = function () {
	Base.apply(this, arguments);
};
util.inherits(Get, Base);

Get.prototype.getMineType = function (path) {
	var match = path.match(/.\.([^.]+)$/);
	var ret;
	if (match && match[1]) {
		ret = mineType.getType(match[1]);
	}
	return ret || mineType.getType();
};

Get.prototype.run = function () {
	var req = this._request,
		res = this._response,
		url = req.url,
		path = '.' + url;

	path = path.split('?')[0];
	console.log('get url: %s', path);
	if (fs.existsSync(path)) {
		var stat = fs.statSync(path);
		if (!stat.isDirectory()) {
			res.writeHead(200, {
				'Content-Type' : this.getMineType(path)
			});

			var stream = fs.createReadStream(path, {
				encoding: null //utf-8 ascii base64
			});
			stream.on('data', function (chunk) {
				res.write(chunk);
			});
			stream.on('end', function () {
				res.end();
			});
			return ;
		}
	}
	res.writeHead(404);
	res.end();
};

module.exports = new Get();