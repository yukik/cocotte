'use strict';

/*
 * dependencies
 */
var co = require('co')
  , fs = require('fs-extra')
  , thunkify = require('thunkify')
  , commander = require('commander')
  , path = require('path');

/*
 * 引数確認
 */
var program = commander.version('0.1')
	.option('-d, --directory [optional]', 'アプリケーション設置先のパスを設定します')
	.option('-t, --template [optional]', '設置するアプリケーションのひな形を指定します')
	.parse(process.argv);

/*
 * アプリケーション設置先
 */
var dir = program.directory || './application';

/*
 * ひな形
 */
if (program.template && !/^[-_0-9a-z]{1,20}$/i.test(program.template)) {
	console.error(new Error('アプリケーションのひな形を正しく指定してください'));
	return;
}
var template = program.template || 'skeleton';

/*
 * コピー元とコピー先のディレクトリ
 */
var from = path.join(__dirname, template)
  , to = path.resolve(process.cwd(), dir || '.');

console.log();
console.log('===================設置開始===================');
console.log();
console.log('■テンプレートのアプリケーション');
console.log('         ' + template);
console.log();
console.log('■設置先');
console.log('         ' + to);
console.log();

/**
 * thunk
 */
var fs_readdir = thunkify(fs.readdir).bind(fs)
  , fs_mkdirs = thunkify(fs.mkdirs).bind(fs)
  , fs_copy = thunkify(fs.copy).bind(fs)
  , isDirectory = function (dir) {
		return function (cb) {
			fs.exists(dir, function (t){
				if (t) {
					fs.stat(dir, function (e, stat) {
						cb(null, !e && stat.isDirectory());
					});
				} else {
					cb(null, false);
				}
			});
		};
	}
  , exists = function (pt) {
		return function (cb) {
			fs.exists(pt, function(t) {
				cb(null, t);
			});
		};
	};



co(function*(){

	try {

		if (!(yield isDirectory(from))) {
			throw new Error('アプリケーションのひな形が存在しません');
		}

		//コピー先を作成するか空のディレクトリの必要あり
		if (yield exists(to)) {
			if (!(yield isDirectory(to))) {
				throw new Error('ディレクトリではありません');
			}
			if ((yield fs_readdir(to)).length) {
				throw new Error('空のディレクトリを指定してください');
			}
		} else {
			yield fs_mkdirs(to);
		}

		yield fs_copy(from, to);

		console.log('===================終了：成功しました===================');

	} catch (e) {
		console.log();
		console.log('■例外発生');
		console.error(e);
		console.log();
		console.log('===================終了：失敗しました===================');
	}

})();
