console.log('require ' + __filename);
var reg = /(\d)(?=(\d{3})+(?!\d))/g;

var is = require('cocotte/tools/is');


/**
 * 数字を三桁区切りの文字列に変更します
 *
 * @for fx
 * @method sanketa
 * @static
 * @param  {Number} num
 * @return {String} str
 */
var fx = function sanketa (num) {
	'use strict';
	if (!is(Number, num)) {
		throw new Error('数値を渡してください');
	}
	var str = num.toString()
	  , idx = str.indexOf('.');
	if (~str.indexOf('e')) {
		return str;
	} else if (idx > 0) {
		return str.slice(0, idx).replace(reg, '$1,') + str.slice(idx);
	} else {
		return str.replace(reg, '$1,');
	}
};
fx.category = '数字';
fx.description = '数字を三桁区切りの文字列に変更します';

module.exports = exports = fx;
