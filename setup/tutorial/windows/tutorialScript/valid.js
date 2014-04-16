var is = require('cocotte/tools/is')
  , valid = {};

// 変数の検証
valid.score = function score (subkey, value) {
	'use strict';
	if (subkey !== null) {
		return new Error('サブキーが指定されています');
	} else if (!is(Number, value)) {
		return new Error('数字ではありません');
	}
};

module.exports = exports = valid;