var is = require('cocotte-is')
  , strToSeconds = require('cocotte/tools/getFx')('strToSeconds');


/*
 * コマンドの正規表現およびコマンドリスト
 * @type {RegExp}
 */
var calcReg  = /^(last|near|next)? ?([-+]?[0-9]+)? ?(hours|hour|half|quarters|quarter|ten|minutes|minute)$/i;

/**
 * 時刻に対して計算します
 * 
 * コマンドによりキリのよい時間・時刻を返します<br />
 * 
 * 一語コマンド<br />
 * <dl style='padding-left:40px;'>
 *   <dt>now</dt><dd>現在時刻</dd>
 * </dl>
 * 
 * 二語コマンド<br />
 * (prefix)
 * <dl style='padding-left:40px;'>
 *    <dt>last</dt><dd>小さい値で一番近いものを返します</dd>
 *    <dt>near</dt><dd>近いもの返します</dd>
 *    <dt>next</dt><dd>大きい値で一番近いものを返します</dd>
 *    <dt>省略</dt><dd>nearと同じ</dd>
 * </dl>
 * (surfix)
 * <dl style='padding-left:40px;'>
 *    <dt>hour(s)</dt><dd>x時00分</dd> 
 *    <dt>half</dt><dd>x時00分,x時30分</dd>
 *    <dt>quarter(s)</dt><dd>x時00分,x時15分,x時30分,x時45分</dd>
 *    <dt>ten</dt><dd>x時00分,x時10分,x時20分,x時30分,x時40分,x時50分</dd>
 *    <dt>minute(s)</dt><dd>x時x分0秒</dd>
 * </dl>
 * 文字列の間に数字を入れると計算対象を間隔分前後にずらす事ができます 
 * 例）10:27:30を入力日時として計算コマンドがnear 2tenだった場合、新しい指定時刻10:47:30 => 10:50 
 * 
 * @for fx
 * @method calcTime
 * @static
 * @param  {String} calc 
 *                     コマンド
 * @param  {Number|String} target 
 *                     指定時刻。省略時は現在時刻。文字列を渡した場合はstrToSecondsを参照
 * @return {Number} seconds 
 */
var fx = function calcTime (calc, target) {
	'use strict';
	if (!is(String, calc)) {
		return null;
	}
	calc = calc.trim();
	//一語コマンド
	var now;
	if (calc === 'now') {
		now = new Date();
		return now.getHours() * 3600 + now.getMinutes() * 60 + now.getSeconds();
	}
	//二語コマンド
	var operators = calc.match(calcReg)
	  , scale;

	if (!operators) {
		throw new Error('コマンドが不正です');
	}
	if (target === undefined) {
		//未定義は現在時刻
		now = new Date();
		target = now.getHours() * 3600 + now.getMinutes() * 60 + now.getSeconds();
	} else {
		target = strToSeconds(target);
		//時刻に変換出来なかった場合はnullを返す
		if (target === null) {
			return null;
		}
	}

	

	switch(operators[3]) {
	case 'hour':
	case 'hours':
		scale = 3600;
		break;
	case 'half':
		scale = 1800;
		break;
	case 'quarter':
	case 'quarters':
		scale = 900;
		break;
	case 'ten':
		scale = 600;
		break;
	case 'minute':
	case 'minutes':
		scale = 60;
		break;
	default:
		return null;
	}

	var val = target + parseInt(operators[2] || 0, 10) * scale
	  , md  = val % scale;

	switch (operators[1]) {
	case 'next':
		val = val - md + (md === 0 ? 0 : scale);
		break;
	case 'last':
		val = val - md;
		break;
	default: // near
		if (md < scale / 2) {
			val = val - md;
		} else {
			val = val - md + scale;
		}
		break;
	}
	return val;
};


fx.category = '時刻';
fx.description = '時刻に対して計算します';

/**
 * calcTimeで使用可能なコマンドか判別します
 * @for fx
 * @method calcTime.validCommand
 * @static
 * @param  {String} command
 * @return {Boolean} isCommand
 */
fx.validCommand = function validCommand (command) {
	'use strict';
	if (!is(String, command)) {
		return false;
	}
	if (command === 'now') {
		return true;
	}
	return calcReg.test(command);
};

module.exports = exports = fx;


