/**
 * 対象のウインドウのタブを表示する
 * @param  {Event} e
 */
var script = function tabfocus (e) {
	'use strict';
	var el      = $(this)
	  , Win     = cocotte.Win
	  , winname = el.data('win')
	  , tabname = el.data('tab') || 'tab1'
	  , page    = el.data('page')
	  , win     = Win.find(winname);
	if (win) {
		win.putIn();
		win.setLocal('tab-' + tabname, page * 1);
	} else {
		var fn = function () {
			win = Win.find(winname);
			win.setLocal('tab-' + tabname, page * 1);
		};
		Win.request(winname);
		Win.once('show ' + winname, fn);
		setTimeout(function () { Win.removeListener('show ' + winname, fn);}, 3000);
	}
	e.stopPropagation();
};

//検証
script.bindValid = function tabfocusBindvalid (event, el) {
	'use strict';
	if (!el.getAttribute('data-win')) {
		return new Error('ウインドウ(win)の指定がありません');
	}
	var page = el.getAttribute('data-page');
	if ((page * 1) + '' !== page) {
		return new Error('表示ページ(page)の指定がありません');
	}
};

module.exports = exports = script;