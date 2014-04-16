console.log('require ' + __filename);

var is = require('cocotte/tools/is')
  , zipRegex = /^([0-9]{3})-?([0-9]{4})$/
  , hankaku  = require('cocotte/tools/getFx')('hankaku');

/**
 * 郵便番号パースです
 * 全角は半角に、ハイフンなしの場合はハイフンを追加します
 * @for Fx
 * @method zipcode
 * @static
 * @param  {String} str
 * @return {String} str
 */
var fx = function zipcode (val) {
	'use strict';
	if (!is(String, val)) {
		throw new Error('文字列を渡してください');
	}
	val = hankaku(val);
	var matches = val.match(zipRegex);
	if (matches) {
		return matches[1] + '-' + matches[2];
	} else {
		throw new Error('郵便番号の形式ではありません');
	}
};
fx.category = '文字列';
fx.description = '郵便番号パースです';

module.exports = exports = fx;