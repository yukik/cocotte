/*globals Client:true*/

Client.prototype.onShow = function onShow () {
	'use strict';
	// 初期データ
	var data = this.values.data = [];
	for (var i = 0; i < 10; i++) {
		data.push([0, 0, 0, 0]);
	}
	this.values.step = 0;
};

// 表示時のHTMLを文字列で返します
Client.prototype.toHtml = function toHtml () {
	'use strict';
	return this.templates.index;
};

// サーバから実行できるスクリプト
Client.prototype.scripts = ['onMemory'];

// メモリ監視を開始する 
Client.prototype.start = function start () {
	'use strict';
	var portlet = this.getPortlet();
	portlet.server('start', function (err) {
		var alert = portlet.el('span.alert');
		if (err) {
			alert.text(err);
		} else {
			alert.text('メモリ監視を開始しました');
		}
	});
};

// メモリ監視を中止する
Client.prototype.stop = function stop () {
	'use strict';
	var portlet = this.getPortlet();
	portlet.server('stop', function (err) {
		var alert = portlet.el('span.alert');
		if (err) {
			alert.text(err);
		} else {
			alert.text('メモリ監視を中止しました');
		}
	});
};

// 値の変更をテーブルに表示
Client.prototype.onMemory = function onMemory (memoryUsage) {
	'use strict';
	var data = this.values.data
	  , mem  = [
			++this.values.step
		  , memoryUsage.rss
		  , memoryUsage.heapTotal
		  , memoryUsage.heapUsed
		];
	data.shift();
	data.push(mem);
	this.el('table.memoryUsage tbody tr').each(function (i) {
		var d = data[i];
		$('th', this).text(d[0]);
		$('td', this).each(function (j) {
			$(this).text(d[j + 1]);
		});
	});
};

