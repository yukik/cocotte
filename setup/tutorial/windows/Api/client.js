/*global client*/

/**
 * 以下はチュートリアルで使用するスクリプト
 */
client.showWinId = function showWinId () {
	'use strict';
	var win = cocotte.tools.getWin(this);
	if (win) {
		new cocotte.Win('確認', 'ウインドウIDは' + win.id + 'です。', {mode: 'info'});
	}
};

client.ev1 = function ev1 () {
	'use strict';
	$(this).css('color', 'red');
};

client.ev2 = function ev2 () {
	'use strict';
	$(this).css('color', 'black');
};
