console.log('require ' + __filename);

var is       = require('cocotte/tools/is')
  , presetFx = {}
  , sanketa  = require('./sanketa')
  , tani     = ['万', '億', '兆', '京', '垓']
  , fullReg  = /(\d)(?=(\d{4})+(?!\d))/g
  , fullReg2 = /\d{4}(\D|$)/g;


/**
 * 数値を日本語表記に適した表現に変更します
 *
 * 
 * いずれも３桁区切りにします
 * presetを省略した場合はautoが実行されます
 *  
 * @for fx
 * @method suji
 * @static
 * @param  {Number} num
 * @param  {String} preset
 * @return {String} str
 */
var fx = function suji (num, preset) {
	'use strict';
	if (!is(Number, num)) {
		throw new Error('数値を渡してください');
	}
	if (!is(String, preset) || !presetFx[preset]) {
		preset = 'auto';
	}
	return presetFx[preset](num);
};
fx.category = '数字';
fx.description = '数字を日本語表記に変更します';


/*
 * 桁数により自動的に読みやすい形式に変更します
 * 小数点以下は省略されます
 * @param  {Number} num
 * @return {String}
 */
presetFx.auto = function auto (num) {
	'use strict';
	num = Math.round(num);
	var x = Math.abs(num)
	  , y = num + ''
	  , l = (x + '').length - 1
	  , t = Math.floor(l / 4) - 1;
	if (~y.indexOf('e')) {
		return num + '';
	} else if (l <= 3) {
		return sanketa(num);
	} else if (l % 4 < 2) {
		return sanketa(Math.round(num / Math.pow(10, (t + 1) * 4 - 2)) / 100) + tani[t];
	} else {
		return sanketa(Math.round(num / Math.pow(10, (t + 1) * 4))) + tani[t];
	}
};

/*
 * すべての桁を漢字での単位を追加して表示します
 * 小数点以下は削除されます
 * @param  {Number} num
 * @return {String}
 */
presetFx.full = function full (num) {
	'use strict';
	var str = num + ''
	  , idx = str.indexOf('.')
	  , i   = 0;
	if (~str.indexOf('e')) {
		return str;
	}
	if (~idx) {
		str = str.slice(0, idx);
	}
	var l = Math.floor((str.length - 1) / 4) - 1;
	return str.replace(fullReg,
				function (x) {
					return x + tani[l - i++];
				})
			  .replace(fullReg2,
				function (x) {
					var i = parseInt(x, 10);
					if (i === 0) {
						return '';
					} else if (1000 <= i) {
						return x[0] + ',' + x.slice(1);
					} else {
						return x.length === 5 ? i + x.slice(4) : i;
					}
				});
};

/*
 * 千の位で丸めます
 * 3456789  -> 3,457千
 * @param  {Number} num
 * @return {String}
 */
presetFx.sen = function sen (num) {
	'use strict';
	return sanketa(Math.floor(num / 1000)) + '千';
};

/*
 * 万の位で丸めて小数点二桁まで表示します
 * 2345678 -> 234.5万 
 * @param  {Number} num
 * @return {String}
 */
presetFx.mansen = function mansen (num) {
	'use strict';
	return sanketa(Math.round(num / 100) / 100) + '万';
};

/*
 * 万の位で丸めます
 * 23456789 -> 2,345万 
 * @param  {Number} num
 * @return {String}
 */
presetFx.man = function man (num) {
	'use strict';
	return sanketa(Math.round(num / 10000)) + '万';
};

/*
 * 億の位で丸めて小数点二桁まで表示します
 * 1234567890 -> 12.3億
 * @param  {Number} num
 * @return {String}
 */
presetFx.okusen = function okusen (num) {
	'use strict';
	return sanketa(Math.round(num / 1000000) / 100) + '億';
};

/*
 * 億の位で丸めます
 * 1234567890 -> 12億
 * @param  {Number} num
 * @return {String}
 */
presetFx.oku = function oku (num) {
	'use strict';
	return sanketa(Math.round(num / 100000000)) + '億';
};

/*
 * 億の位で丸めて小数点二桁まで表示します
 * 1234567890 -> 12.3億
 * @param  {Number} num
 * @return {String}
 */
presetFx.chooku = function okusen (num) {
	'use strict';
	return sanketa(Math.round(num / 10000000000) / 100) + '兆';
};

module.exports = exports = fx;
