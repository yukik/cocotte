console.log('require ' + __filename);

var is = require('cocotte/tools/is')
  , reg = /^([0-9]{4})(?:[-\/]([0-9]{1,2}))?(?:[\/-]([0-9]{1,2}))?$/;

/**
 *  日付を数値に変換します
 *  数値は1970/1/1を0としたときの経過日数を表します
 *
 * '2013-6-1' -> 15857
 *
 * Dateオブジェクトもしくはyyyy-mm-ddの文字列を変換対象にします
 * 変換出来なかったもしくは存在しない日付ではnullを返します
 *
 * @for fx
 * @method dateToNumber
 * @static
 * @param  {Date|String} val
 * @return {Number} num
 */
var fx = function dateToNumber (val) {
	'use strict';
	if (is(Date, val)) {
		return Math.floor(val.getTime() / 86400000);
	} else if (is(String, val)) {
		var ymd = val.trim().match(reg);
		if (ymd) {
			var y  = parseInt(ymd[1], 10)
			  , m  = parseInt(ymd[2], 10) - 1
			  , d  = parseInt(ymd[3], 10)
			  , ck = new Date(Date.UTC(y, m, d));
			if (ck.getUTCFullYear() === y || ck.getUTCMonth() === m) {
				return Date.UTC(y, m, d) / 86400000;
			}
		}
	}
	return null;
};
fx.category = '日時';
fx.description = '日付を数値に変換します';

module.exports = exports = fx;
