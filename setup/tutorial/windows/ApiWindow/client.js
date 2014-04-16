/*jshint strict:false*/ /*global client*/

client.showWinId = function move (e) {
	var win = cocotte.tools.getWin(this);
	if (win) {
		new cocotte.Win('確認', 'ウインドウIDは' + win.id + 'です。', {mode: 'info'});
	}
	e.stopPropagation();
};

client.ev1 = function ev1 () {
	$(this).css('color', 'red');
};

client.ev2 = function ev2 () {
	$(this).css('color', 'black');
};

client.winOperate = function winOperate () {
	var win = cocotte.tools.getWin(this);
	if (win) {
		win.normal()
			.move(100, 300)
			.move()
			.setTitle('タイトル変更')
			.resize(800, 800)
			.move()
			.resize(500, 300)
			.move();
	}
};

