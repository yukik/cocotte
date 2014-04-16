console.log('require ' + __filename);

/*
 * コマンドの正規表現およびコマンドリスト
 */
var is       = require('cocotte/tools/is')
  , calcReg  = /^(last|near|next)? ?([-+]?[0-9]+)? ?(days|day|hours|hour|half|quarters|quarter|ten|minutes|minute)$/i;

/**
 * 計算コマンドにより指定日時からキリのよい日時を返す
 *
 * 一語コマンド<br />
 * <dl style='padding-left:40px;'>
 *     <dt>now</dt><dd>現在時間</dd>
 * </dl>
 *
 * 二語コマンド<br />
 * (prefix)
 * <dl style='padding-left:40px;'>
 *     <dt>last</dt><dd>小さい値で一番近いものを返す</dd>
 *     <dt>near</dt><dd>近いもの返す</dd>
 *     <dt>next</dt><dd>大きい値で一番近いものを返す</dd>
 *     <dt>省略</dt><dd>nearと同じ</dd>
 * </dl>
 * (surfix)
 * <dl style='padding-left:40px;'>
 *     <dt>day(s)</dt><dd>x日</dd>
 *     <dt>hour(s)</dt><dd>x時00分</dd>
 *     <dt>half</dt><dd>x時00分またはx時30分</dd>
 *     <dt>quarter(s)</dt><dd>x時00分,x時15分,x時30分,x時45分</dd>
 *     <dt>ten</dt><dd>x時00分,x時10分,x時20分,x時30分,x時40分,x時50分</dd>
 *     <dt>minute(s)</dt><dd>x時x分0秒</dd>
 * </dl>
 * 
 * 文字列の前に数字を入れると計算対象を間隔分ずらす事が出来る
 * 例）10:27:30を入力日時として計算コマンドがnear 2 tenだった場合、新しい指定日時10:47:30 => 10:50
 *
 * @for fx
 * @method calcTimestamp
 * @static
 * @param  {String} command 
 *                      コマンド
 * @param  {Date}   target 
 *                      指定日時。省略時は現在日時
 * @return {Date} value
 */
var fx = function calcTimestamp (command, target) {
	'use strict';
	if (!is(String, command)) {
		return null;
	}
	//一語コマンド
	if (command === 'now') {
		return new Date();
	}
	//二語コマンド
	var operators = command.trim().match(calcReg)
	  , scale;
	if (!operators) {
		return null;
	}

	if (!target) {
		target = new Date();
	} else if(is(String, target)) {
		target = new Date(target);
	} else {
		return null;
	}

	switch(operators[3]) {
	case 'day':
	case 'days':
		scale = 86400;
		break;
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
	var val = parseInt(target.valueOf() / 1000, 10) + parseInt(operators[2] || 0, 10) * scale
	  , md  = val % scale;
	switch (operators[1]) {
	case 'next':
		val = val - md + (md === 0 ? 0 : scale);
		break;
	case 'last':
		val = val - md;
		break;
	default:  // near
		if (md < scale / 2) {
			val = val - md;
		} else {
			val = val - md + scale;
		}
		break;
	}
	return new Date(val * 1000);
};
fx.category = '時刻';
fx.description = '日時に対して計算します';

/**
 * calcTimestampで使用可能なコマンドか判別します
 * @for fx
 * @method calcTimestamp.validCommand
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


