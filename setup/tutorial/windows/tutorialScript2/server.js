var is     = require('cocotte/tools/is')
  , server = {};

// クライアントから呼び出し可能なスクリプト
server.scripts = ['start', 'stop'];

// メモリ監視の開始
server.start = function start (win, data, callback) {
	'use strict';
	var err = null;
	if (win.values.run) {
		err = '既に動作しています';
	} else {
		// 定期的にクライアントにメモリ監視結果を送信する
		var iv  = setInterval(function () {
			win.client('onMemory', process.memoryUsage());
		}, 1000);
		win.values.run = true;
		win.values.iv  = iv;
	}
	if (is(Function, callback)) {
		callback(err);
	}
};

// メモリ監視の中止
server.stop = function stop (win, data, callback) {
	'use strict';
	var err = null;
	if (win.values.run) {
		clearInterval(win.values.iv);
		win.values.run = false;
		win.values.iv  = null;
	} else {
		err = '動作していません';
	}
	if (is(Function, callback)) {
		callback(err);
	}
};

// 閉じる際にメモリ監視を中止する
server.onClose = function onClose (win) {
	'use strict';
	server.stop(win);
};

module.exports = exports = server;