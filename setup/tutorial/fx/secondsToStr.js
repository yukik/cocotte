console.log('require ' + __filename);
/*
 * プリセット
 */
var preset = {
		time   : {format: '{h}:{i}:{s}'  , options: {padding: {i:2, s:2}, skip:'none'}}
	  , time12j: {format: '{a}{t}時{i}分', options: {padding: {i:2}     , skip:'none'}}
	  , time24j: {format: '{h}時{i}分'   , options: {padding: {i:2}     , skip:'none'}}
	}
  , is     = require('cocotte/tools/is')
  , reg    = /(\{[adhiost]\})([^\{\}]*)/ig;

/** 
 * 秒を文字列に変更します
 *
 * formatにプレースフォルダーを含んだ文字列を設定する事ができます
 *
 * <dl style='padding-left:40px;'>
 *    <dt>{d}</dt><dd>日にち</dd>
 *    <dt>{h}</dt><dd>時。日にちを差し引き</dd>
 *    <dt>{t}</dt><dd>時。半日表示</dd>
 *    <dt>{H}</dt><dd>時。日にちをプラス</dd>
 *    <dt>{i}</dt><dd>分。時を差し引き</dd>
 *    <dt>{I}</dt><dd>分。時をプラス</dd>
 *    <dt>{s}</dt><dd>秒。分を差し引き</dd>
 *    <dt>{S}</dt><dd>秒。分をプラス</dd>
 *    <dt>{a}</dt><dd>午前午後の表記 (optionsで文字列変更可能)</dd>
 *    <dt>{o}</dt><dd>この表記自体は置き換えの対象になりませんが、この直後に記述されている文字列は必ず出力します</dd>
 * </dl>
 *
 * 値が0以外の表記が検出されます間では0の場合は省略されます
 * その際はさらに上記のプレースフォルダの後に続く文字列も省略されます
 * 省略をしない場合はskipを指定する必要があります
 *
 * @for fx
 * @method secondToStr
 * @static
 * @param  {Number} val
 * @param  {String} format 
 *         置換する文字列 / プリセットのフォーマット名
 *         プリセットのフォーマット名が登録されている場合は、format,optionsが設定されます
 * @param  {Object} options 
 *      skip      : {String}  値0の表記するかどうか     既定値 'auto' 
 *                  'auto' : 0でない値が検出されるまでは表記せず、その後は0でも表記する 
 *                  'zero' : 0は常に表記しない 
 *                  'none' : 常に表記する 
 *      am        : {String}  午前表記の文字              既定値 '午前' 
 *      pm        : {String}  午後表記の文字              既定値 '午後' 
 *      padding   : {Array}   0詰めを行う表記と桁数(1-10) 既定値 {}  指定した表記のskipはnoneに強制されます 
 * @return {String} str
 */
var fx = function secondsToStr (val, format, options) {
	'use strict';
	if (!is(Number, val)) {
		throw new Error('引数が不正です');
	}
	if (!is(String, format)) {
		format = '{d}日と{h}時間{i}分{s}秒';
	} else {
		var ps = preset[format];
		//プリセットから設定
		if (ps) {
			format  = ps.format;
			options = ps.options;
		}
	}
	if (!is(Object, options)) {
		options = {};
	}

	if (!is(Object, options.padding) && !is(Number, options.padding)) {
		options.padding = {};
	}

	var v = {};
	v.S = val;
	v.s = v.S % 60;
	v.I = (v.S - v.s) / 60;
	v.i = v.I % 60;
	v.H = (v.I - v.i) / 60;
	v.h = v.H % 24;
	v.a = v.h < 12 ? options.am || '午前' : options.pm || '午後';
	v.t = v.H % 12;
	v.d = (v.H - v.h) / 24;
	v.o = '';

	var skip = ~['zero', 'none'].indexOf(options.skip) ? options.skip : 'auto'
		// 値が一度でも出力されたか
	  , push = skip === 'none';

	return format.replace(reg, function (s) {
				var part  = s[1]
				  , score = v[part]
				  , padding = options.padding[part] ||
							(is(Number, options.padding) ? options.padding : false)
					//出力するかどうか
				  , output =!is(Number, score) ||
							score > 0 ||
							padding ||
							skip === 'none' ||
							skip === 'auto' && push;
				if (is(undefined, score)) {
					return s;
				} else if (part === 'o') {
					return s.length > 3 ? s.slice(3) : '';
				} else if (output) {
					push = true;
					//0詰め
					if (is(Number, padding) && is(Number, score) && (score + '').length < padding) {
						score = ('0000000000' + score).slice(padding * -1);
					}
					return score + (s.length > 3 ? s.slice(3) : '');
				} else {
					return '';
				}
			});
};
fx.category = '日時';
fx.description = '秒を文字列に変更します';

module.exports = exports = fx;