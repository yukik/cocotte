console.log('require ' + __filename);

/**
 * 半角の英数記号を全角に変換します
 * 
 * 対象文字は以下の通りです
 *   半角スペース
 *   !"#$%&'()*+,-./0123456789:;<=>?@
 *   ABCDEFGHIJKLMNOPQRSTUVWXYZ
 *   [\]^_`
 *   abcdefghijklmnopqrstuvwxyz
 *   {|}~
 * 
 * @for fx
 * @method calcTime
 * @static
 * @param  {String} val
 * @return {String} str
 */
var fx = function zenkaku (val) {
	'use strict';
	return val.replace(/[!-~ ]/g, function(c) {
		if (c === ' ') {
			return '　';
		} else {
			return String.fromCharCode(c.charCodeAt(0) + 0xFEE0);
		}
	});
};
fx.category = '文字列';
fx.description = '半角の英数記号を全角に変換します';

module.exports = exports = fx;

