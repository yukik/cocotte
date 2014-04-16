console.log('require ' + __filename);

var is = require('cocotte/tools/is');

/**
 * 日付を日にちの範囲を表す数値に変換します
 * 
 * 数値は1970/1/1を0としたときの経過日数を表します
 *
 * '2013-6' -> ['2013-6-1', '2013-6-30'] -> [15857, 15886]
 *
 * yyyy-mm-ddの書式にしてください
 * mm/ddは省略する事が出来ます。省略した場合はその部分の範囲をすべて含むように変換します
 * 例えばを返します。
 * 変換出来なかったもしくは存在しない日付ではnullを返します
 *
 * @for fx
 * @method dateToBetween
 * @static
 * @param  {String} val
 * @return {Array}  term
 *                  [{Number} begin, {Number} end]
 */
var fx = function dateToBetween (val) {
	'use strict';
	if (!is(String, val)) {
		return null;
	}
	var dm = val.trim().match(/^([0-9]{4})(?:[-\/]([0-9]{1,2}))?(?:[\/-]([0-9]{1,2}))?$/)
	  , y, bM, eM, bD, eD;
	//正規表現パス
	if (dm === null) {
		return null;
	}

	//年
	y = parseInt(dm[1], 10);
	//月
	if (dm[2] === undefined) {
		bM = 0;
		eM = 11;
	} else {
		bM = parseInt(dm[2], 10) - 1;
		eM = bM;
		if (bM < 0 || 11 < bM) {
			return null;
		}
	}
	//日
	if (dm[3] === undefined) {
		bD = 1;
		eD = new Date(y, eM, 0).getDate();
	} else {
		bD = parseInt(dm[3], 10);
		eD = bD;
		var ck = new Date(y, bM, bD);
		if (ck.getFullYear() !== y || ck.getMonth() !== bM) {
			return null;
		}
	}

	var begin = Date.UTC(y, bM, bD) / 86400000
	  , end   = Date.UTC(y, eM, eD) / 86400000;

	return [begin, end];
};
fx.category = '日時';
fx.description = '日付を範囲の配列に変換します';

module.exports = exports = fx;
