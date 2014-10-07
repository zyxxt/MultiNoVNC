/**
 * Created by ued on 2014/6/13.
 */

var rfb,
    id;
window.onscriptsload = function () {
    loadVNC({
        host: window.location.hostname,
        port: WebUtil.getQueryVar('port'),
        password: WebUtil.getQueryVar('password')
    });
    this.vncName = WebUtil.getQueryVar('name');
    document.title = this.vncName;
    id = WebUtil.getQueryVar('frameId');
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

    setTimeout(updateSize, 1000);
}

function updateSize () {
    var size = {},
        vnc = $('#no_vnc');
    size.width = parseInt(vnc.css('width'), 10);
    size.height = parseInt(vnc.css('height'), 10);

    parent.updateVncSize(id, size);
    setTimeout(updateSize, 1000);
}



function onIFrameMouseMove (x, y) {
    parent.doMouseMove(id, x, y);
}
function onIFrameMouseButton (x, y, type, mask) {
    parent.doMouseButton(id, x, y, type, mask);
}

function doMouseMove (x, y) {
    rfb.mouseMove.apply(this, arguments);
}
function doMouseButton (x, y, type, mask) {
    rfb.mouseButton.apply(this, arguments);
}


function onIFrameKeyDown (k, e) {
    parent.doKeyDown(id, k, e);
}
function doKeyDown (k, e) {
    rfb.keyDown(k, e);
}
function onIFrameKeyUp (k, e) {
    parent.doKeyUp(id, k, e);
}
function doKeyUp (k, e) {
    rfb.keyUp(k, e);
}
function onIFrameKeyPress (k, e) {
    parent.doKeyPress(id, k, e);
}
function doKeyPress (k, e) {
    k.keypress(e);
    rfb.keyPress(k, e);
}