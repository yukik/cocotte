var is = require('cct-is');

/**
 * ハイフネーションをキャメルケースに変換して返す
 * @for fx
 * @method camelCase
 * @static
 * @param  {String} str
 * @return {Boolean} value
 */
var fx = function camelCase (str) {
	'use strict';
	if (!is(String, str)) {
		throw new Error('文字列を渡してください');
	}
	return str.replace( /-(.)/g, function(m0, m1) {return m1.toUpperCase();});
};
fx.category = '文字列';
fx.description = 'ハイフネーションをキャメルケースに変換して返す';

module.exports = exports = fx;


// console.log(fx('-a-b-cd-efg-'));
