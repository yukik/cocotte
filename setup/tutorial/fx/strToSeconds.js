console.log('require ' + __filename);

var is      = require('cocotte/tools/is')
  , hankaku = require('cocotte/tools/getFx')('hankaku');

/** 
 * 時間・時刻を秒に変換します
 *
 * '3時間54分10秒' ->  3 x 60 x 60 + 54 x 60 + 10 -> 14050
 * 
 * チェックが簡易的なもののため、人が判読出来ない文字列で渡した場合に
 * 意図しない結果になる事があります
 * 文字列以外を渡した場合や形式違いはnullが返ります
 * 
 * 受け付ける文字列の形式の例
 * <ul style='padding-left:40px;'>
 *     <li>[x]days</li>
 *     <li>[x]day</li>
 *     <li>[x]d</li>
 *     <li>[x]日</li>
 *     <li>[x]hours</li>
 *     <li>[x]hour</li>
 *     <li>[x]h</li>
 *     <li>[x]時</li>
 *     <li>[x]時間</li>
 *     <li>[x]minutes</li>
 *     <li>[x]minute</li>
 *     <li>[x]分</li>
 *     <li>[x]seconds</li>
 *     <li>[x]second</li>
 *     <li>[x]s</li>
 *     <li>##:##:## </li>
 *     <li>##:##</li>
 *     <li>##:## am</li>
 *     <li>##:## pm</li>
 *     <li>午前 ##時##分</li>
 *     <li>午後 ##時##分</li>
 * </ul> 
 * 大文字小文字・全角半角を区別しません
 *
 * @for fx
 * @method strToSeconds
 * @static
 * @param  {String} val
 * @return {Number} num
 */
var fx = function strToSeconds (val) {
	'use strict';
	if (!is(String, val)) {
		return null;
	}

	val = hankaku(val);

	//符号
	var symbol = /^-/.test(val) ? -1 : 1
	  , times = []
	  , bonus = 0;

	//am/pm
	if (val.match(/(?:pm|午後)/i)) {
		bonus += 43200;
	}
	
	// hh:ii:ss
	var his = val.match(/([0-9]+):([0-9]+)(?::([0-9]+))?/);
	if (his) {
		return (his[1] * 3600 + his[2] * 60 + (his[3] || 0) * 1) * symbol;
	}

	//days
	var d = val.match(/([0-9]+)(?:days|day|d|日)/i);
	if (d) {
		times.push(d[1] * 86400);
	}

	//hours
	var h = val.match(/([0-9]+)(?:hours|hour|h|時間|時)/i);
	if (h) {
		times.push(h[1] * 3600);
	}

	//minutes
	var m = val.match(/([0-9]+)(?:minutes|minute|m|分)/i);
	if (m) {
		times.push(m[1] * 60);
	}

	//seconds
	var s = val.match(/([0-9]+)(?:seconds|second|s|秒)/i);
	if (s) {
		times.push(s[1] * 1);
	}

	if (times.length === 0) {
		return null;
	} else {
		return (times.reduce(function(x, y) { return x + y;}) + bonus) * symbol ;
	}

};
fx.category = '日時';
fx.description = '文字列を秒に換算します';

module.exports = exports = fx;