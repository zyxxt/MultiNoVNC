/**
 * Created by ued on 2014/6/13.
 */

var rfb,
    id,
    donotfire = false;
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
    rfb && rfb.mouseMove.apply(this, arguments);
}
function doMouseButton (x, y, type, mask) {
    rfb && rfb.mouseButton.apply(this, arguments);
}


function onIFrameKeyDown (k, e) {
    parent.doKeyDown(id, k, e);
}
function doKeyDown (k, e) {
//    rfb && rfb.keyDown(k, createKeyEvent('keydown', e));
    createKeyEvent('keydown', e)
}
function onIFrameKeyUp (k, e) {
    parent.doKeyUp(id, k, e);
}
function doKeyUp (k, e) {
//    rfb && rfb.keyUp(k, createKeyEvent('keyup', e));
    createKeyEvent('keyup', e)
}
function onIFrameKeyPress (k, e) {
    parent.doKeyPress(id, k, e);
}
function doKeyPress (k, e) {
    e = createKeyEvent('keypress', e);
//    k.keypress(e);
//    rfb && rfb.keyPress(k, e);
}

function createKeyEvent (type, e) {
//    var event = document.createEvent("KeyboardEvent");
//    event.initKeyboardEvent(
//        type,
//        e.bubbles,
//        e.cancelable,
//        e.view,
//        e.ctrlKey,
//        e.altKey,
//        e.shiftKey,
//        e.metaKey,
//        e.keyCode,
//        e.charCode
//    );
    if (donotfire) {
        return;
    }
    var event = document.createEvent("Events");
    event.initEvent(type, true, true);
    event.bubbles = e.bubbles;
    event.cancelable = e.cancelable;
    event.view = window;
    event.ctrlKey = e.ctrlKey;
    event.altKey = e.altKey;
    event.shiftKey = e.shiftKey;
    event.metaKey = e.metaKey;
    event.keyCode = e.keyCode;
    event.charCode = e.charCode;
    event.which = e.which;
    event.currentTarget = document;
    event.target = document.body;
    event.srcElement = document.body;
    parent.doNotFire(true);
    document.dispatchEvent(event);
    parent.doNotFire(false);
    return event;
}