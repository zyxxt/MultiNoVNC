"use strict";

var util = require('util');
var Base = require('./base');


var Post = function () {
	Base.apply(this, arguments);
};
util.inherits(Post, Base);

var pidList = {};

Post.prototype.onInit = function () {
	var ret = Post.super_.prototype.onInit.apply(this, arguments),
		req = this._request,
		res = this._response,
		me = this;
	if (ret === false) {
		return false;
	}
	this.postData = '';
	req.setEncoding('utf8');
	req.on('data', function (data) {
		me.postData += data;
	});
	req.on('end', function () {
		res.writeHead(200);

		var json = require('../../lib/util.js').parseFormData(me.postData);
		console.log(json);
		if (!json.opr) {
			res.end('not found opr in post data!');
		}
		me.parseOpr(json, req, res);
	});
};

Post.prototype.parseOpr = function (json, req, res) {
	switch (json.opr) {
		case 'add':
			this.onAdd(json, req, res);
			break;
		case 'delete':
			this.onDelete(json, req, res);
			break;
		default:
			res.end('opr is invalid');
	}
};

Post.prototype.onAdd = function (json, req, res) {
	var opr = require('../../post/opr.js');
	var pid = opr.createVNC(json);
	pidList[json.name] = pid;

	res.end(JSON.stringify({
		success: true,
		data: {
			pid: pid,
			port: opr.getProcess(pid).port
		}
	}));
};
Post.prototype.onDelete = function (json, req, res) {};


Post.prototype.run = function () {
	var req = this._request,
		res = this._response;


};


module.exports = new Post();