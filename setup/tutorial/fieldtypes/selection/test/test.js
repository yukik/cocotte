var validTest = require('cocotte/fieldtype/rowno/test/valid-test')
  , SelectionFeild = require('cocotte/fieldtype/selection')
  , testData  = {};

//定義リスト
testData.schemas = {
	既定省略: {}
  , 既定フル: {
		defaultTo: []
	  , min      : 0
	  , max      : false
	  , values   : ['項目1', '項目2', '項目3']
	}
  , 最大最小: {min: 1, max: 2}
};

//値リスト
testData.values = {
	未選択     : {val: []                         , ng: ['最大最小']}
  , 選択1      : {val: ['項目1']                  , ok: true}
  , 選択2      : {val: ['項目1', '項目2']         , ok: true} 
  , 選択3      : {val: ['項目1', '項目2', '項目3'], ng: ['最大最小']} 
  , リストなし1: {val: ['項目4']                  , ng: ['最大最小']} 
  , 重複       : {val: ['項目1', '項目1']         , ok: false}
  , 文字列     : {val: '項目1'                    , ok: true} 
  , リストなし2: {val: 'お好み焼き'               , ng: ['最大最小']} 
  , 数字       : {val: 100                        , ok: false}
  , T          : {val: true                       , ok: false}
  , F          : {val: false                      , ok: false}
  , 未定       : {val: undefined                  , ng: ['最大最小']}
  , ヌル       : {val: null                       , ng: ['最大最小']}
  , オブ       : {val: {aaa:'bbb'}                , ok: false}
};

validTest(SelectionFeild, testData, true);
//validTest(SelectionFeild, testData, true, true);
