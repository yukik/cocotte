/*global Client:true*/

// 作成時に実行
Client.prototype.onCreate = function onCreate () {
	'use strict';
	// スコアを監視する
	this.onLocal('score', this.onChangeScore);
};

// 表示時のHTMLを文字列で返します
Client.prototype.toHtml = function toHtml () {
	'use strict';
	return this.templates.index;
};

// 表示時に実行
Client.prototype.onShow = function onShow () {
	'use strict';
	this.el('span.result').text(this.locals.score);
};

// イベント割当
Client.prototype.hoge = function hoge () {
	'use strict';
	var portlet = this.getPortlet();
	portlet.setLocal('score', portlet.locals.score + 1);
};

// 値の変更
Client.prototype.onChangeScore = function onChangeScore (portlet, key, score) {
	'use strict';
	var el = portlet.el('span.result');
	if (el) {
		el.text(score);
	}
};




