console.log('require ' + __filename);

var is     = require('cocotte/tools/is')
  , helper = require('cocotte/portlet/helper');

/**
 * カウントアップするポートレット
 * @class Portlet.CountupPortlet
 * @constructor
 * @param {Object} options
 */
var Portlet = function CountupPortlet (options) {
	'use strict';
	if (!is(Object, options)) {
		options = {};
	}
	this.locals = {
		score: options.score || 0
	};
};

Portlet.prototype.name = 'Countup';

// ポートレットの機能を追加
helper.inherit(Portlet);

// クライアントサイドで使用するテンプレートを定義する
Portlet.templates = ['index'];

// ローカル変数検証
Portlet.prototype.valid = {
	// スコア
	score: function validScore (subkey, value) {
		'use strict';
		if (subkey !== null) {
			return new Error('サブキーが指定されています');
		} else if (!is(Number, value)) {
			return new Error('数字ではありません');
		}
	}
};

module.exports = exports = Portlet;
helper.test(Portlet);