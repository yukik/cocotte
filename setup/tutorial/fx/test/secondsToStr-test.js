var msg = require('cocotte/tools/message');

var secondsToStr = require('cocotte/tools/getFx')('secondsToStr');

var t = function (value) {
	'use strict';
	var format = '数字を時刻に直しましたら{h}h {i}m {s}s {a}となりました'
	  , options = {am: 'am', pm: 'pm', padding: {i: 2, s: 2}};
	msg(secondsToStr(value, format, options));
};

var val = 86399;

t(val);


