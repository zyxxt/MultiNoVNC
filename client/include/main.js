/**
 * Created by ued on 2014/6/13.
 */

var rfb;
window.onscriptsload = function () {
	loadVNC({
		host: window.location.hostname,
		port: WebUtil.getQueryVar('port'),
		password: WebUtil.getQueryVar('password')
	});
	this.vncName = WebUtil.getQueryVar('name');
	document.title = this.vncName;
};
$(document).ready(function () {



});

function loadVNC (options) {
	var vnc = $('#vnc');

	if (rfb) {
		rfb.disconnect();
		rfb = null;
	}
	vnc.remove('#no_vnc').append('<canvas id="no_vnc"></canvas>');

	rfb = new RFB({
		'target':       $D('no_vnc'),
		'encrypt':      WebUtil.getQueryVar('encrypt', false),
		'repeaterID':   WebUtil.getQueryVar('repeaterID', ''),
		'true_color':   WebUtil.getQueryVar('true_color', true),
		'local_cursor': WebUtil.getQueryVar('cursor', true),
		'shared':       WebUtil.getQueryVar('shared', true),
		'view_only':    WebUtil.getQueryVar('view_only', false)
	});
	rfb.connect(options.host, options.port, options.password);

	rfb.get_WebSocket().on('error', function () {

		Util.Warn("WebSocket on-error event");
		// 重连
		//loadVNC(options);
	});
}
