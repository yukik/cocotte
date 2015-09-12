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
 *
 * 将来的はソリューションをクラウド越しにインストールする為の手段を提供する
 */
var program = commander.version('0.1')
  .option('-d, --directory [directory]', 'アプリケーション設置先のパスを設定します')
  .option('-t, --template [template]', '設置するアプリケーションのテンプレートを指定します')
  .option('-s, --solution [solution]', '設置するアプリケーションのソリューションを指定します')
  .option('-u, --user [user]', 'cocotteユーザー名')
  .option('-k, --key [key]', 'ソリューション発行キー')
  .parse(process.argv);

/**
 * thunk
 */
var fsReaddir = thunkify(fs.readdir).bind(fs)
  , fsMkdirs = thunkify(fs.mkdirs).bind(fs)
  , fsCopy = thunkify(fs.copy).bind(fs)
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

/*
 * アプリケーション設置先
 */
if ('directory' in program && typeof program.directory !== 'string') {
  console.error(new Error('設置先を正しく指定してください'));
  return;
}
var to = path.resolve(process.cwd(), program.directory || './application');

var template
  , from
  , solution
  , user
  , key;

// ソリューション選択時
if (program.solution || program.user || program.key) {

  if (typeof program.solution !== 'string' || !/^[-_0-9a-z]{1,20}$/i.test(program.solution)) {
    console.error(new Error('ソリューションを正しく指定してください'));
    return;
  }
  solution = program.solution;

  if (typeof program.user !== 'string' || !/^[-_0-9a-z]{1,20}$/i.test(program.user)) {
    console.error(new Error('ユーザー名を正しく指定してください'));
    return;
  }
  user = program.user;

  if (typeof program.key !== 'string' || !/^[-_0-9a-z]{1,20}$/i.test(program.key)) {
    console.error(new Error('ソリューション発行キーを正しく指定してください'));
    return;
  }
  key = program.key;

// テンプレート複製
} else {

  if (typeof program.template !== 'string' && !/^[-_0-9a-z]{1,20}$/i.test(program.template)) {
    console.error(new Error('アプリケーションのテンプレートを正しく指定してください'));
    return;
  }
  template = program.template || 'skeleton';
  from = path.join(__dirname, template);

}

/**
 * テンプレートの複製
 * setupフォルダ下に存在するテンプレートフォルダを複製する
 */
var copyTemplate = function*(){

  try {

    console.log();
    console.log('===================設置開始===================');
    console.log();
    console.log('■テンプレートのアプリケーション');
    console.log('         ' + template);
    console.log();
    console.log('■設置先');
    console.log('         ' + to);
    console.log();


    if (!(yield isDirectory(from))) {
      throw new Error('アプリケーションのテンプレートが存在しません');
    }

    //コピー先を作成するか空のディレクトリの必要あり
    if (yield exists(to)) {
      if (!(yield isDirectory(to))) {
        throw new Error('ディレクトリではありません');
      }
      if ((yield fsReaddir(to)).length) {
        throw new Error('空のディレクトリを指定してください');
      }
    } else {
      yield fsMkdirs(to);
    }

    yield fsCopy(from, to);

    console.log('===================終了：成功しました===================');

  } catch (e) {
    console.log();
    console.log('■例外発生');
    console.error(e);
    console.log();
    console.log('===================終了：失敗しました===================');
  }

};

/*
 * ソリューションをクラウドからダウンロード
 */
var downloadSolution = function*(){

  try {
    console.log();
    console.log('===================設置開始===================');
    console.log();
    console.log('■ソリューション名');
    console.log('         ' + solution);
    console.log();
    console.log('■設置先');
    console.log('         ' + to);
    console.log();

    yield function (cb) {cb(new Error('作成中'), null);};

    console.log('===================終了：成功しました===================');

  } catch (e) {
    console.log();
    console.log('■例外発生');
    console.error(e);
    console.log();
    console.log('===================終了：失敗しました===================');
  }

};


if (template) {
  co(copyTemplate)();

} else {
  co(downloadSolution)();

}

