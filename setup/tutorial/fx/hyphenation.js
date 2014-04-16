console.log('require ' + __filename);

var is = require('cocotte/tools/is');

/**
 * キャメルケースをハイフネーションに変換して返す
 * @for fx
 * @method calcTime
 * @static
 * @param  {String} str
 * @return {String} str
 */
var fx = function hyphenation (str) {
	'use strict';
	if (!is(String, str)) {
		throw new Error('文字列を渡してください');
	}
	if (str.length === 1) {
		return str;
	} else {
		return str.charAt(0) + str.slice(1).replace( /[A-Z]/g, function(m) {
			return '-' + m.charAt(0).toLowerCase();
		});
	}
};
fx.category = '文字列';
fx.description = 'キャメルケースをハイフネーションに変換して返す';

module.exports = exports = fx;
