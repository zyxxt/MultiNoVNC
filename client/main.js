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
	$('#submit').click(onSubmit);
	$('.win-close').click(onSubmitCancel);
});

function getIFrameItem (id, option) {
	var title = getIFrameItemTitle.apply(this, arguments),
		body = getIFrameItemBody.apply(this, arguments);

	return [
		'<li class="iframe-item" id="' + id + '">',
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
	url = './include/index.html?' + params.join('&');
	return '<iframe class="item" src="' + url + '"></iframe>';
}

function add (id, option) {
	all.append(getIFrameItem.apply(this, arguments));
	$('.iframe-close', $('#' + id)).click(onRemove);
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
	li.remove();
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
		name: 'xxxxx',
		password: '1',
		host: '200.200.100.47',
		port: 5909
	};
}

function getIFrameId () {
	return 'iframe' + (IFRAME_ID++);
}