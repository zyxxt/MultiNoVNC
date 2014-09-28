/**
 * Created by zyt on 2014/6/25.
 */
"use strict";
var http = require('http');
var route = require('./server/web/route/route.js');
var config = require('./config.json');

http.createServer(function (req, res) {
	var r = route.getRoute(req, res);
	r.run();

}).listen(config.port, config.host);

