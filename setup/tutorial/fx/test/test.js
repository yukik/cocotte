console.time('test');

var msg = require('cocotte/tools/message');

/*
 * 関数定義のテスト
 */
var fx = require('../index');


fx.setInfoPath(__dirname, '../../../../fx')
	.once('end built in', function() {
		'use strict';
		test();
	})
	.loadBuiltIn();

/*
 * テスト本体
 */
var test = function () {
	'use strict';

	console.timeEnd('test');

	msg(Object.keys(fx));

	//数値
	msg(fx.sanketa(.009));
	msg(fx.sanketa(-12345678.9999));


	msg(fx.suji(1));
	msg(fx.suji(12));
	msg(fx.suji(128));
	msg(fx.suji(1289));
	msg(fx.suji(12891));
	msg(fx.suji(128910));
	
	msg(fx.suji(128910000, 'full'));


	msg(fx.suji(1213982123, 'oku'));
	msg(fx.suji(123900123, 'okusen'));
	msg(fx.suji(100010001000100010000, 'full'));
	msg(fx.suji(234670, 'man'));



	//仮名テスト
	msg(fx.katakana('あいうえお'));
	msg(fx.hiragana('カキクケコ'));

	//全角半角
	msg(fx.hankaku('ＡＢＣＤＥＦＧ'));
	msg(fx.zenkaku('hijklmn'));

	//郵便番号
	msg(fx.zipcode('１２３−４５６７'));


	//日付
	msg(fx.dateToBetween('2013/1/20'));
	msg(fx.strToSeconds('午後5時２６分３０秒'));
	msg(fx.secondsToStr(62790, 'timej'));

	console.timeEnd('test');
};
