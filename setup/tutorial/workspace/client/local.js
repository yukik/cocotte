/**
 * ローカル変数を入力するテキストボックスを設定する
 */
var script = function local () {
	'use strict';
	var win = this.getWin()
	  , name = this.name
	  , value = this.value;
	win.setLocal(name, value);
};

// 検証
script.bindValid = function localBindValid (event, el) {
	'use strict';
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
script.onShow = function localOnShow (el) {
	'use strict';
	var win = el.getWin()
	  , name = el.name;
	el.setAttribute('data-local-bind', '1');
	win.onLocal(name, scripts.local.onLocal);
};

// 値監視
script.onLocal = function localOnLocal (win, key, value, err) {
	'use strict';
	if (err) {
		message(err, 'error');
	} else {
		var f  = $(':focus').get(0);
		win.el('input[data-local-bind=1][name=' + key + ']')
			.filter(function (i, el) {return el !== f;})
			.val(value);
	}
};

module.exports = exports = script;

