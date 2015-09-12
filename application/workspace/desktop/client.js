/*global scripts:true */

var message = cocotte.workspace.message;

/**
 * ウインドウを閉じます
 */
scripts.close = function close (e) {
	'use strict';
	e.stopPropagation();
	var win = this.getWin();
	if (win) {
		win.close();
	}
};

/**
 * iframeでウインドウを作成します
 * data-url属性にURLを、data-title属性(省略可能)にウインドウのタイトルを設定します
 * @param  {Object} e
 */
scripts.iframe = function iframe (e) {
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

/**
 * タブの表示きりかえ
 * 
 * ウインドウコンテンツ内でクラス名がtabのエレメントを探し、
 * そのchildrenエレメントのクラスをtabActiveもしくはtabInactiveに変更します
 * 同様にタブエレメントの親エレメントのchildrenのエレメントのクラスもtabActiveもしくはtabInactiveに変更されます
 *
 * 同じコンテンツ内に複数のタブを設定する場合は
 * data-tabname='任意の文字列'を追加してください
 * 省略した場合は、data-tabname='tab1'が設定されます
 *
 * 実際の表示非表示の切り替えはCSSで設定されています
 */
scripts.tab = function tab (e) {
	'use strict';
	var childNode = e.target;
	while(true) {
		if (childNode === this) {
			return;
		}
		if (childNode.parentNode === this) {
			break;
		}
		childNode = childNode.parentNode;
	}
	var win = this.getWin()
	  , tabHeader = $(this)
	  , tabName = tabHeader.data('tabname')
	  , idx = tabHeader.children().index(childNode);
	// ローカル変数を変更
	win.setLocal('tab-' + tabName, idx);
};
// 検証
scripts.tab.bindValid = function tabBindValid (event) {
	'use strict';
	if (!~['click', 'mouseover'].indexOf(event)) {
		return new Error('クリック、マウスオーバー以外に設定できません');
	}
};
// 表示フック
scripts.tab.onShow = function tabOnShow (el) {
	'use strict';
	var tabHeader = $(el)
	  , win = el.getWin()
	  , contentsEl = win ? win.contentsEl : document;
	var tabName = tabHeader.data('tabname');
	if (!tabName || !/^[a-z]+$/.test(tabName)) {
		tabName = 'tab1';
		tabHeader.attr('data-tabname', tabName);
		$('.tabContents', contentsEl).filter(function () {
			return !$(this).data('tabname');
		}).attr('data-tabname', tabName);
	}
	if (!win) {
		return;
	}
	var key = 'tab-' + tabName;
	win.onLocal(key, scripts.tab.onLocal);
	var idx = win.locals[key] || 0;
	scripts.tab.drive(win, tabHeader, idx);
};
// 値監視
scripts.tab.onLocal = function tabOnLocal (win, key, value, err) {
	'use strict';
	if (!win.contentsEl) {
		return;
	}
	if (err) {
		win.sync(false).changeStatus(err, 'error');
		return;
	}
	var tabName = key.substring(4)
	  , tabHeader = $('.tabHeader[data-tabname=' + tabName +']', win.contentsEl).first();
	if (tabHeader && is(Number, value)) {
		scripts.tab.drive(win, tabHeader, value);
	}
};
// 実処理
scripts.tab.drive = function tabDrive (win, tabHeader, idx) {
	'use strict';
	tabHeader.children().each(function (i) {
		if (i === idx) {
			$(this).addClass('tabActive').removeClass('tabInactive');
		} else {
			$(this).removeClass('tabActive').addClass('tabInactive');
		}
	});
	var tabName = tabHeader.data('tabname')
	  , tabs = $('.tabContents[data-tabname=' + tabName + ']', win.contentsEl).first();
	tabs.children().each(function (i) {
		if (i === idx) {
			$(this).addClass('tabActive').removeClass('tabInactive');
		} else {
			$(this).removeClass('tabActive').addClass('tabInactive');
		}
	});
};

/**
 * 対象のウインドウのタブを表示する
 * @param  {Event} e
 */
scripts.tabfocus = function tabfocus (e) {
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
scripts.tabfocus.bindValid = function tabfocusBindvalid (event, el) {
	'use strict';
	if (!el.getAttribute('data-win')) {
		return new Error('ウインドウ(win)の指定がありません');
	}
	var page = el.getAttribute('data-page');
	if ((page * 1) + '' !== page) {
		return new Error('表示ページ(page)の指定がありません');
	}
};



/**
 * ローカル変数を入力するテキストボックスを設定する
 */
scripts.local = function local () {
	var win = this.getWin()
	  , name = this.name
	  , value = this.value;
	win.setLocal(name, value);
};
// 検証
scripts.local.bindValid = function localBindValid (event, el) {
	if (!~['change', 'keyup'].indexOf(event)) {
		return new Error('change,keyup以外に設定できません');
	}
	if (el.tagName !== 'INPUT') {
		return new Error('入力ボックス以外に設定できません');
	}
	if (!el.name) {
		return new Error('name属性が設定されていません');
	}
};
// 表示フック
scripts.local.onShow = function localOnShow (el) {
	var win = el.getWin()
	  , name = el.name;
	el.setAttribute('data-local-bind', '1');
	win.onLocal(name, scripts.local.onLocal);
};
// 値監視
scripts.local.onLocal = function localOnLocal (win, key, value, err) {
	if (err) {
		message(err, 'error');
	} else {
		var f  = $(':focus').get(0);
		win.el('input[data-local-bind=1][name=' + key + ']')
			.filter(function (i, el) {return el !== f;})
			.val(value);
	}
};












