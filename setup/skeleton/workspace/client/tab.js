
var is = cocotte.tools.is;

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
var script = function tab (e) {
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
script.bindValid = function tabBindValid (event) {
	'use strict';
	if (!~['click', 'mouseover'].indexOf(event)) {
		return new Error('クリック、マウスオーバー以外に設定できません');
	}
};
// 表示フック
script.onShow = function tabOnShow (el) {
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
	win.onLocal(key, script.onLocal);
	var idx = win.locals[key] || 0;
	script.drive(win, tabHeader, idx);
};
// 値監視
script.onLocal = function tabOnLocal (win, key, value, err) {
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
		script.drive(win, tabHeader, value);
	}
};
// 実処理
script.drive = function tabDrive (win, tabHeader, idx) {
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

module.exports = exports = script;

