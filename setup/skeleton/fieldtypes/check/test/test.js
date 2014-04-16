var validTest = require('cocotte/fieldtype/rowno/test/valid-test')
  , CheckFeild = require('cocotte/fieldtype/check')
  , testData   = {};

//定義リスト
testData.schemas = {
	既定省略: {}
  , 読取専用: {
		readonly: true
	}
};

//値リスト
testData.values = {
	真    : {val: true                , ok: ['既定省略']}
  , 偽    : {val: false               , ok: ['既定省略']}
  , 未定  : {val: undefined           , ok: ['既定省略']}
  , ヌル  : {val: null                , ok: ['既定省略']}
  , オブ  : {val: {aaa:'bbb'}         , ok: ['既定省略']}
  , 空配列: {val: []                  , ok: ['既定省略']}
  , 配列  : {val: ['うどん', 'カレー'], ok: ['既定省略']} 
  , 文字列: {val: 'うどん'            , ok: ['既定省略']} 
  , 数字  : {val: 100                 , ok: ['既定省略']}
};

validTest(CheckFeild, testData, true);
//validTest(CheckFeild, testData, true, true);