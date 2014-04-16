/**
 * iframeでウインドウを作成します
 * data-url属性にURLを、data-title属性(省略可能)にウインドウのタイトルを設定します
 * @param  {Object} e
 */
var script = function iframe (e) {
	'use strict';
	e.stopPropagation();

	var el  = $(this)
	  , title = el.data('title') || 'New Window'
	  , url = el.data('url');

	if (url) {
		if (url.indexOf('http') !== 0) {
			var config = cocotte.config;
			url = config.protocol + '://' + config.host +
					(config.appPort === 80 ? '' : ':' + config.appPort) + '/' + url;
		}
		new cocotte.Win(title, {type: 'iframe', source: url}, {});
	}

};

module.exports = exports = script;