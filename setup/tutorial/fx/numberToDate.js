console.log('require ' + __filename);

var is = require('cocotte/tools/is');

/**
 * 数値を日付を表す文字列に変換します
 *  
 * 数値は1970-1-1を0としたときの経過日数を引数にします
 *
 * 15857 -> '2013-6-1' 
 *
 * 変換出来なかった場合はnullを返します
 *
 * @for fx
 * @method numberToDate
 * @static
 * @param  {Number} num
 * @return {String} val
 */
var fx = function numberToDate (num) {
	'use strict';
	if (is(Number, num)) {
		var d = new Date(num * 86400000);
		return d.getUTCFullYear() + '-' + (d.getUTCMonth() + 1) + '-' + d.getDate();
	} else {
		return null;
	}
};
fx.category = '日時';
fx.description = '数値を日付に変換します';

module.exports = exports = fx;
