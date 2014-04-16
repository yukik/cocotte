/*global client:true*/

// 作成時に実行
client.onCreate = function onCreate (win) {
	'use strict';
	win.onLocal('score', client.hoge.onScore);
};

// 表示時に実行
client.onShow = function onShow (win) {
	'use strict';
	win.el('span.result').text(win.locals.score);
};

// イベント割当
client.hoge = function hoge () {
	'use strict';
	var win = cocotte.tools.getWin(this);
	win.setLocal('score', win.locals.score + 1);
};

// 値の変更に伴い実行
client.hoge.onScore = function hogeOnScore (win, key, score, err) {
	'use strict';
	win.el('span.result').text(err || score);
};