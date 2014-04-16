console.log('require ' + __filename);

var is     = require('cocotte/tools/is')
  , helper = require('cocotte/portlet/helper');

/**
 * メモリ監視を行うポートレット
 */
var Portlet = function MemoryUsagePortlet () {
	'use strict';
	this.values = {};
};

// ポートレットの機能を追加
helper.inherit(Portlet);

// クライアントサイドで使用するテンプレートを定義する
Portlet.templates = ['index'];

// クライアントから呼び出し可能なスクリプト
Portlet.prototype.scripts = ['start', 'stop'];

// メモリ監視の開始
Portlet.prototype.start = function start (data, callback) {
	'use strict';
	var self = this
	  , err = null;
	if (self.values.run) {
		err = '既に動作しています';
	} else {
		// 定期的にクライアントにメモリ監視結果を送信する
		self.values.run = true;
		self.values.iv  = setInterval(function () {
			self.client('onMemory', process.memoryUsage());
		}, 1000);
	}
	if (is(Function, callback)) {
		callback(err);
	}
};

// メモリ監視の中止
Portlet.prototype.stop = function stop (data, callback) {
	'use strict';
	var err = null;
	if (this.values.run) {
		clearInterval(this.values.iv);
		this.values.run = false;
		this.values.iv  = null;
	} else {
		err = '動作していません';
	}
	if (is(Function, callback)) {
		callback(err);
	}
};

// 閉じる際にメモリ監視を中止する
Portlet.prototype.onClose = function onClose () {
	'use strict';
	this.stop();
};

module.exports = exports = Portlet;