console.log('require ' + __filename);

/**
 * 半角の英数記号を全角に変換します
 *
 * 対象文字は以下の通りです<br />
 *   半角スペース <br/>
 *   !"#$%&'()*+,-./0123456789:;&#60;=&#62;?@<br/>
 *   ABCDEFGHIJKLMNOPQRSTUVWXYZ<br/>
 *   [\]^_`<br/>
 *   abcdefghijklmnopqrstuvwxyz<br/>
 *   {|}~<br/>
 *
 * (注意)<br />
 *  長音"−"は、半角マイナスに変換されます<br />
 *  そのため、長音の含む文字列をhankaku後にzenkaku(ユーザー定義）の関数で処理しても元の文字列になりません
 * @for fx
 * @method hankaku
 * @static
 * @param  {String} str
 * @return {String} val
 */
var fx = function hankaku (str) {
	'use strict';
	return str.replace(/[！-～　−]/g, function(c) {
		switch(c) {
		case '　':
			return ' ';
		case '−':
			return '-';
		default:
			return String.fromCharCode(c.charCodeAt(0) - 0xFEE0);
		}
	});
};
fx.category = '文字列';
fx.description = '全角の英数記号を半角に変換します';

module.exports = exports = fx;
