/**
 * アプリケーションのエントリポイント
 */

/*
 * dependencies
 */
var cocotte = require('cocotte');

/*
 * 著作権情報をコンソールに表示
 */
require('./credit')();

/**
 * アプリケーション設定
 */
var config = require('./config');


//アプリケーションの作成
var app = cocotte(config);

//実行
app.start();

module.exports = exports = app;
