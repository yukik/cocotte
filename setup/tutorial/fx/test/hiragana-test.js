require('cocotte/tools/globals');


var hiragana = require('../hiragana');

var test = function (input, output) {
	var result = hiragana(input);
	if (result !== output) {
		throw new Error(input + ' => ' + result + ' != ' + output);
	}
};

test ('あいうえお', 'あいうえお');

test ('アイウエオ', 'あいうえお');

msg('テストが成功しました');