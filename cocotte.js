'use strict';

/*
 * dependencies
 */
var path = require('path')
  , koa = require('koa')
  , koaCommon = require('koa-common')
  , koaStatic = require('koa-static')
  , koaSess = require('koa-sess')
  , koaRedis = require('koa-redis')
  , koaRoute = require('koa-route')
  , mixin = require('cocotte-mixin-ws')
  , appendApp = require('./lib/append-app')
  , cocotteRender = require('cocotte-render')
  , cocotteDevice = require('cocotte-device');

/**
 * cocotte本体
 * @class cocotte
 * @constructor
 * @param  {Object} config
 */
var cocotte = function cocotte (config) {
  _app = new App(config);
  return _app;
};

//最後に作成されたアプリケーション
var _app = null;

/**
 * アプリケーションの取得
 * 最後にcocotte(config)を行った際に作成されたアプリケーションを取得します
 * 通常一度にひとつのアプリケーションのみ作成するため最後のみで多くの場合は
 * 問題が起きる事はありません
 * @method getApp
 * @return {Object} application
 */
cocotte.getApp = function getApp () {
  return _app;
};

/**
 * アプリケーション
 * @method App
 * @param  {Object} config
 */
var App = function App (config) {

  config = config || {};

  /*
   * アプリケーションルート
   */
  this.root = config.root || path.dirname(process.argv[1]);

  /*
   * アプリケーションサーバのポート番号
   * 80番ポートを使用する場合は、ルート権限で実行してください
   */
  this.port = config.port || 80;

  /*
   * ブラウザのタイトル
   */
  this.title = config.title || 'Cocotte Application1';

  /*
   * アプリケーションの説明
   * ログイン画面に表示します
   */
  this.description = config.description || ['no description'];

  /*
   * 対応デバイス
   * cocotte-deviceモジュールによりユーザーエージェントから自動判別します
   */
  this.devices = config.devices || ['desktop', 'phone', 'tablet'];

  /*
   * 許可ホストアドレス
   * ホストを登録していない場合にサーバへ接続した場合はステータス500が返されます
   * アスタリスク"*"を登録するとリストにかからなかった場合、上記を回避する設定となります
   * 値には任意の文字列で設定します。
   * 値はユーザーのセッションに記録され、ウインドウなどの表示時に制限をかける事が出来ます
   */
  this.hosts = config.hosts || {localhost : 'lan', '*': 'wan'};

  /*
   * セッション
   */
  this.session = config.session || {};
  // セッションcookie名
  this.session.key = this.session.key || 'cctsess';
  // 暗号キー。ランダムな文字列を設定します
  this.session.secret = this.session.secret || '76bc2a73f8108g';
  // セッション更新間隔
  this.session.time = this.session.time || 60;

  /*
   * すべての権限を持つ管理者のアカウントのnameを指定します
   * ユーザーテーブルから指定したアカウントのユーザーは削除する事が出来ません
   * また、パスワードリセット用の電子メールアドレスを登録してください
   */
  this.admin = config.admin || {};
  // ユーザー名
  this.admin.name = this.admin.name || 'admin';
  // 電子メール
  this.admin.email = this.admin.email || 'admin@example.com';
};

/**
 * アプリケーションの開始
 * @method start
 * @return メソッドチェーン
 */
App.prototype.start = function start () {

  var ap = mixin(koa)()
    , self = this
    , dir  = self.root; // アプリケーションディレクトリ

  // favicon
  ap.use(koaCommon.favicon(path.join(dir, 'public/favicon.ico')));

  // ログ
  // ap.use(koa.logger('dev'));

  // 静的ファイル
  ap.use(koaStatic(path.join(dir, 'public')));
  ap.use(koaStatic(path.join(__dirname, 'application/public')));

  // セッション
  ap.keys = ['abcdefg', 'hijklmn']; // session secret key
  ap.use(koaSess({
    key: self.session.secret
  , store: koaRedis()
  }));


  // アプリケーション参照追加 -> this.app
  ap.use(appendApp(self));

  // デバイス情報を設定 -> this.session.device
  ap.use(cocotteDevice);

  // レンダー機能追加 -> this.render
  ap.use(cocotteRender(self));
  cocotteRender.cacheClear(self);

  // ホーム
  ap.use(koaRoute.get('/', require('./routes/root')));

  // ログイン
  ap.use(koaRoute.post('/auth', require('./routes/login')));

  // ログアウト
  ap.use(koaRoute.get('/auth', require('./routes/logout')));

  // ウインドウビュー
  ap.use(koaRoute.get('/win-v/:name/:template', require('./routes/window-view')));

  // ウインドウスクリプト
  ap.use(koaRoute.get('/win-s/:name', require('./routes/window-script')));

  // ポートレットビュー
  ap.use(koaRoute.get('/portlet-v/:name/:template', require('./routes/portlet-view')));

  // ポートレットスクリプト
  ap.use(koaRoute.get('/portlet-s/:name', require('./routes/portlet-script')));


  // 不明なリクエスト
  ap.use(require('./routes/404'));

  // メッセージ
  ap.ws('message', require('./ws/message')(self));

  // HTTP監視
  var server = ap.listen(self.port);

  // socket.io監視
  ap.wsListen(server);

  return self;
};


/** 
 * アプリケーションの終了
 */
App.prototype.stop = function stop () {
  console.error('TODO: application stop');
};

module.exports = exports = cocotte;
