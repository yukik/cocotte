console.log('require ' + __filename);

var is = require('cocotte/tools/is');

/**
 * ハイフネーションを一文字目も大文字のキャメルケースに変換して返す
 *
 * @for fx
 * @method upperCamelCase
 * @static
 * @param  {String} str
 * @return {Boolean}
 */
var fx = function upperCamelCase (str) {
	'use strict';
	if (!is(String, str)) {
		throw new Error('文字列を渡してください');
	}
	if (str.length > 1) {
		return str.charAt(0).toUpperCase() +
				str.slice(1).replace( /-(.)/g, function(m0, m1) {
					return m1.toUpperCase();
				});
	} else if (str.length === 1) {
		return str.toUpperCase();
	}
};
fx.category = '文字列';
fx.description = 'ハイフネーションを一文字目も大文字のキャメルケースに変換して返す';

module.exports = exports = fx;

//console.log(fx('a-b-c-def-g-'));