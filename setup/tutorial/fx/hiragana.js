console.log('require ' + __filename);

var is = require('cocotte/tools/is');

/**
 * ひらがなに変換
 * @for Fx
 * @method  hiragana
 * @static
 * @param  {String} str
 * @return {String} str
 */
var fx = function hiragana (val) {
	'use strict';
	if (!is(String, val)) {
		throw new Error('文字列を渡してください');
	}

	return val.replace(/[ァ-ヶ]/g, function (c) {
		return String.fromCharCode(c.charCodeAt(0) - 0x0060);
	});
};
fx.category = '文字列';
fx.description = 'ひらがなに変換';

module.exports = exports = fx;