console.log('require ' + __filename);

var is = require('cocotte/tools/is');

/**
 * カタカナに変換
 * @for fx
 * @method katanaka
 * @static
 * @param  {String} str
 * @return {String} str
 */
var fx = function katakana (str) {
	'use strict';
	if (!is(String, str)) {
		throw new Error('文字列を渡してください');
	}
	return str.replace(/[ぁ-ゖ]/g, function(c) {
		return String.fromCharCode(c.charCodeAt(0) + 0x0060);
	});
};
fx.category = '文字列';
fx.description = 'カタカナに変換';

module.exports = exports = fx;