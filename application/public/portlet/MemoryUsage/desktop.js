(function () { var Client = function MemoryUsagePortlet (options) { this.onPreCreate(options); this.onCreate(); };Client.prototype = new cocotte.Portlet; Client.prototype.constructor = Client; /*globals Client:true*/

Client.prototype.onShow = function onShow () {
	// 初期データ
	var data = this.values.data = [];
	for (var i = 0; i < 10; i++) {
		data.push([0, 0, 0, 0]);
	}
	this.values.step = 0;
};

// 表示時のHTMLを文字列で返します
Client.prototype.toHtml = function toHtml () {
	return this.templates.index;
};

// サーバから実行できるスクリプト
Client.prototype.scripts = ['onMemory'];

// メモリ監視を開始する 
Client.prototype.start = function start () {
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


Client.prototype.templates = {
    index: '<table class=\'memoryUsage\'>\n	<caption>メモリ使用量</caption>\n	<thead>\n		<th></th>\n		<th>rss</th>\n		<th>heapTotal</th>\n		<th>heapUsed</th>\n	</thead>\n\n	<tfoot>\n		<th>\n			<button data-script=\'start\'>開始</button>\n		</th>\n		<th>\n			<button data-script=\'stop\'>終了</button>\n		</th>\n		<th colspan=\'2\'>\n			<span class=\'alert\'></span>\n		</th>\n	</tfoot>\n	<tbody>\n		<tr>\n			<th>0</th>\n			<td>0</td>\n			<td>0</td>\n			<td>0</td>\n		</tr>\n		<tr>\n			<th>0</th>\n			<td>0</td>\n			<td>0</td>\n			<td>0</td>\n		</tr>\n		<tr>\n			<th>0</th>\n			<td>0</td>\n			<td>0</td>\n			<td>0</td>\n		</tr>\n		<tr>\n			<th>0</th>\n			<td>0</td>\n			<td>0</td>\n			<td>0</td>\n		</tr>\n		<tr>\n			<th>0</th>\n			<td>0</td>\n			<td>0</td>\n			<td>0</td>\n		</tr>\n		<tr>\n			<th>0</th>\n			<td>0</td>\n			<td>0</td>\n			<td>0</td>\n		</tr>\n		<tr>\n			<th>0</th>\n			<td>0</td>\n			<td>0</td>\n			<td>0</td>\n		</tr>\n		<tr>\n			<th>0</th>\n			<td>0</td>\n			<td>0</td>\n			<td>0</td>\n		</tr>\n		<tr>\n			<th>0</th>\n			<td>0</td>\n			<td>0</td>\n			<td>0</td>\n		</tr>\n		<tr>\n			<th>0</th>\n			<td>0</td>\n			<td>0</td>\n			<td>0</td>\n		</tr>\n	</tbody>\n</table>\n\n'
};
cocotte.Portlets.MemoryUsage = Client;
})();