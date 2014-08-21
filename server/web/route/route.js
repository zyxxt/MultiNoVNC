/**
 * Created by ued on 2014/6/26.
 */

"use strict";
var Base = require('./method/base');

module.exports = (function () {
	var route;
	var defaultRoute;

	var getRoute = function (req, res) {

		route = {
			'get': require('./method/get.js'),
			'post': require('./method/post.js')
		};

		defaultRoute = new Base();

		var r = route[req.method.toLowerCase()];
		if (!r) {
		req.writeHead('403');
			req.end('permission deny');
			r = defaultRoute;
		}
		r.onInit(req, res);
		return r;
	};

	return {
		getRoute: getRoute
	};

} ());