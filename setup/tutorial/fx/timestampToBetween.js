console.log('require ' + __filename);

var is    = require('cocotte/tools/is')
  , dmReg = /^([0-9]{4})(?:[-\/]([0-9]{1,2}))?(?:[-\/]([0-9]{1,2}))?$/
  , tmReg = /^([0-2]?[0-9])(?::([0-5]?[0-9]))?(?::([0-5]?[0-9]))?$/;

/**
 * 日時を範囲に変換します
 * 
 * '2013-6' -> [new Date('2013-6-1 00:00:00.000'), new Date('2013-6-30 23:59:59.999')]
 * 
 * yyyy-mm-dd hh:ii:ssの書式にしてください
 * mm以下は省略する事が出来ます。省略した場合はその部分の範囲をすべて含むように変換します
 * 変換出来なかったもしくは存在しない日時ではnullを返します
 *
 * タイムゾーンを考慮する際は、第二引数に何時間ずらすかの値を設定してください
 *
 * @for fx
 * @method timestampToBetween
 * @static
 * @param  {String} val
 * @param  {Number} diff
 * @return {Array}  term
 */
var fx = function timestampToBetween (val, diff) {
	'use strict';
	if (!is(String, val)) {
		return null;
	}
	var c = val.trim().split(' ')
	  , dm = c[0].match(dmReg)
	  , tm = c[1] ? c[1].match(tmReg) : []
	  , y, bM, eM, bD, eD, bH, eH, bI, eI, bS, eS;
	//正規表現パス
	if (c.length >= 3 || dm === null || tm === null) {
		return null;
	}
	if (!dm[3] && tm[1]) {
		// 時刻を指定している場合は、日付部分は日まで指定しなければならない
		return null;
	}

	//年
	y = parseInt(dm[1], 10);
	//月
	if (dm[2] === undefined) {
		bM = 1;
		eM = 12;
	} else {
		bM = parseInt(dm[2], 10);
		eM = bM;
		if (bM < 1 || 12 < bM) {
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
		var ck = new Date(y, bM - 1, bD);
		if (ck.getFullYear() !== y || ck.getMonth() + 1 !== bM) {
			//存在しない日付の場合
			return null;
		}
	}
	//時
	if (tm[1] === undefined) {
		bH = 0;
		eH = 23;
	} else {
		bH = parseInt(tm[1], 10);
		eH = bH;
		if (23 < bH) {
			return null;
		}
	}

	//分
	if (tm[2] === undefined) {
		bI = 0;
		eI = 59;
	} else {
		bI = parseInt(tm[2], 10);
		eI = bI;
	}
	if (is(Number, diff)) {
		bI -= diff * 60;
		eI -= diff * 60;
	}

	//秒
	if (tm[3] === undefined) {
		bS = 0;
		eS = 59;
	} else {
		bS = parseInt(tm[3], 10);
		eS = bS;
	}
	return [new Date(Date.UTC(y, bM - 1, bD, bH, bI, bS, 0)), new Date(Date.UTC(y, eM - 1, eD, eH, eI, eS, 999))];
};
fx.category = '日時';
fx.description = '日時を範囲に変換します';

module.exports = exports = fx;