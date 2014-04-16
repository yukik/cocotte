(function () { var Client = function CountupPortlet (options) { this.onPreCreate(options); this.onCreate(); };Client.prototype = new cocotte.Portlet; Client.prototype.constructor = Client; /*globals Client:true*/

// 作成時に実行
Client.prototype.onCreate = function onCreate () {
	// スコアを監視する
	this.onLocal('score', this.onChangeScore);
};

// 表示時のHTMLを文字列で返します
Client.prototype.toHtml = function toHtml () {
	return this.templates.index;
};

// 表示時に実行
Client.prototype.onShow = function onShow () {
	this.el('span.result').text(this.locals.score);
};

// イベント割当
Client.prototype.hoge = function hoge () {
	var portlet = this.getPortlet();
	portlet.setLocal('score', portlet.locals.score + 1);
};

// 値の変更
Client.prototype.onChangeScore = function onChangeScore (portlet, key, score) {
	var el = portlet.el('span.result');
	if (el) {
		el.text(score);
	}
};





Client.prototype.templates = {
    index: '<button data-script=\'hoge\'>hoge</button><br />\n結果:<span class=\'result\'></span>'
};
cocotte.Portlets.Countup = Client;
})();