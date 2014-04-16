/*globals client:true*/

client.onShow = function onShow (win) {
	'use strict';
	// 初期データ
	var data = win.values.data = [];
	for (var i = 0; i < 10; i++) {
		data.push([0, 0, 0, 0]);
	}
	win.values.step = 0;
};

// 表示時のHTMLを文字列で返します
client.toHtml = function toHtml () {
	'use strict';
	return this.templates.index;
};

// サーバから実行できるスクリプト
client.scripts = ['onMemory'];

// メモリ監視を開始する 
client.start = function start () {
	'use strict';
	var win = cocotte.tools.getWin(this);
	win.server('start', function (err) {
		var alert = win.el('span.alert');
		if (err) {
			alert.text(err);
		} else {
			alert.text('メモリ監視を開始しました');
		}
	});
};

// メモリ監視を中止する
client.stop = function stop () {
	'use strict';
	var win = cocotte.tools.getWin(this);
	win.server('stop', function (err) {
		var alert = win.el('span.alert');
		if (err) {
			alert.text(err);
		} else {
			alert.text('メモリ監視を中止しました');
		}
	});
};

// 値の変更をテーブルに表示
client.onMemory = function onMemoery (win, memoryUsage) {
	'use strict';
	var data = win.values.data
	  , mem  = [
			++win.values.step
		  , memoryUsage.rss
		  , memoryUsage.heapTotal
		  , memoryUsage.heapUsed
		];
	data.shift();
	data.push(mem);
	win.el('table.memoryUsage tbody tr').each(function (i) {
		var d = data[i];
		$('th', this).text(d[0]);
		$('td', this).each(function (j) {
			$(this).text(d[j + 1]);
		});
	});
};

