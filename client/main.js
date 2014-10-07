/**
 * Created by ued on 2014/6/13.
 */
"use strict";
var IFRAME_ID = 0;
var all;
var win;
var win_mask;

$(document).ready(function () {
    all = $('#all');
    win = $('#win');
    win_mask = $('#win_mask');
    $('#add').click(onAdd);
    $('#printScreen').click(onPrintScreen);
    $('#submit').click(onSubmit);
    $('.win-close').click(onSubmitCancel);
});

function getIFrameItem (id, option) {
    var title = getIFrameItemTitle.apply(this, arguments),
        body = getIFrameItemBody.apply(this, arguments);

    return [
        '<li data-pid="' + option.pid + '" class="iframe-item" id="' + id + '">',
            title,
            '<div class="iframe-body">',
                body,
            '</div>',
        '</li>'
    ].join('');
}

function getIFrameItemTitle (id, option) {
    return [
        '<div class="iframe-title">',
            '<div class="iframe-button iframe-close"></div>',
            '<div class="iframe-button iframe-min"><div></div></div>',
            '<span>' + option.name + '</span>',
        '</div>'
    ].join('');
}
function getIFrameItemBody (id, option) {
    var key,
        params = [],
        url;
    for (key in option) {
        if (option.hasOwnProperty(key)) {
            params.push(key + '=' + encodeURI(option[key]));
        }
    }
    params.push('frameId=' + id);
    url = './include/index.html?' + params.join('&');
    return '<iframe class="item" src="' + url + '"></iframe>';
}

function add (id, option) {
    all.append(getIFrameItem.apply(this, arguments));
    $('.iframe-close', $('#' + id)).click(onRemove);
    $('.iframe-min', $('#' + id)).click(onMin);
}

function remove (id) {
    $('#' + id).remove();
}

function onAdd () {
    var defaults = getDefaultValue();
    win.show();
    win_mask.show();
    $('input', $('#win')).each(function (id, item) {
        item = $(item);
        item.val(defaults[item.attr('id')]);
    });
}

function onRemove () {
    var li = $(this).parents('.iframe-item');
    var id = li.data('pid');
    $.ajax({
        type: 'post',
        dataType: 'json',
        url: '/',
        data: {
            opr: 'delete',
            data: id
        },
        success: function (json) {
            if (json.success) {
                li.remove();
            }
        }
    });

}

function onMin () {
    var li = $(this).parents('.iframe-item');
    var body = li.children('.iframe-body');
    if (body.is(':visible')) {
        body.hide();
        $(this).children().css({
            'height': '12px',
            'margin-top': '3px'
        });
    } else {
        body.show();
        $(this).children().css({
            'height': '2px',
            'margin-top': '8px'
        });
    }
}

function onSubmit () {
    var option = getSubmitData();
    option.opr = 'add';

    $.ajax({
        type: 'post',
        dataType : 'json',
        url: '/',
        data: option,
        success: function (json) {
            if (json.success) {
                add(getIFrameId(), {
                    name: option.name,
                    port: json.data.port,
                    pid: json.data.pid,
                    password: option.password
                });

                win.hide();
                win_mask.hide();
            }

        },
        error: function (res) {}
    });


}
function onSubmitCancel () {
    win.hide();
    win_mask.hide();
}

function getSubmitData () {
    var obj = {};
    $('input', $('#win')).each(function (id, item) {
        item = $(item);
        obj[item.attr('id')] = item.val();
    });
    return obj;
}

function getDefaultValue () {
    return {
        name: 'xp-ie6',
        password: '1',
        host: '192.168.1.105',
        port: 5909
    };
}

function getIFrameId () {
    return 'iframe' + (IFRAME_ID++);
}


function onPrintScreen () {
    $.ajax({
        type: 'post',
        dataType : 'json',
        url: '/',
        data: {
            opr:'printScreen'
        },
        success: function (json) {
            var html = [];
            if (json.success) {
                var list = json.fileList;
                list.forEach(function (file) {
                    html.push('<a target="_blank" href="../dist/' + file + '">' + file + '</a>')
                });
            }
            $('#screen').html(html.join(''));
        }
    });
}


function updateVncSize (id, size) {
    var iframe = $('#' + id);
    iframe.css({
        height: size.height + 34,
        width: size.width + 2
    });
}


function doMouseMove (id, x, y) {
    $('.iframe-item:not(#' + id + ') iframe').each(function () {
        if (this.contentWindow && this.contentWindow.doMouseMove) {
            this.contentWindow.doMouseMove(x, y);
        }
    });
}
function doMouseButton(id, x, y, type, mask) {
    $('.iframe-item:not(#' + id + ') iframe').each(function () {
        if (this.contentWindow && this.contentWindow.doMouseButton) {
            this.contentWindow.doMouseButton(x, y, type, mask);
        }
    });
}


function doKeyDown (id, k, e) {
    $('.iframe-item:not(#' + id + ') iframe').each(function () {
        if (this.contentWindow && this.contentWindow.doKeyDown) {
            this.contentWindow.doKeyDown(k, e);
        }
    });
}
function doKeyUp (id, k, e) {
    $('.iframe-item:not(#' + id + ') iframe').each(function () {
        if (this.contentWindow && this.contentWindow.doKeyUp) {
            this.contentWindow.doKeyUp(k, e);
        }
    });
}
function doKeyPress (id, k, e) {
    $('.iframe-item:not(#' + id + ') iframe').each(function () {
        if (this.contentWindow && this.contentWindow.doKeyPress) {
            this.contentWindow.doKeyPress(k, e);
        }
    });
}

