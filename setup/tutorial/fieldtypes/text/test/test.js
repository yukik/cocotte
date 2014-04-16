var validTest = require('cocotte/fieldtype/rowno/test/valid-test')
  , TextFeild = require('cocotte/fieldtype/text')
  , testData  = {};

testData.schemas = {
	dummy   : null

  , 既定省略: {}


  , 既定フル: {
		type     : 'text'
	  , caption  : '既定フル'
	  , required : false
	  , fixed    : false
	  , min      : 0
	  , max      : 65535
	  , trim     : true
	  , multiLine: false
	  , values   : undefined
	  , defaultTo: undefined
	}

  , 必須: {required: true}

  , 最大最小: {min: 3, max: 5}

  , 改行有効: {multiLine: true}

  , 値リスト: {values: ['abcd', 'efgh', 'ijkl']} 

};

//値リスト
testData.values = {
	dummy: null

  , 通常: { val: 'abcd'                      , ok: true }
  , 空  : { val: ''                          , ng: ['必須'] }
  , 短い: { val: 'a'                         , ng: ['最大最小', '値リスト'] }
  , 字３: { val: 'abc'                       , ng: ['値リスト'] }
  , 字５: { val: 'abcde'                     , ng: ['値リスト'] }
  , 長い: { val: 'abcdefghijklmnopqrstuvwxyz', ng: ['最大最小', '値リスト']}
  , 字0 : { val: '0'                         , ng: ['最大最小', '値リスト']}
  , 改行: { val: "ab\ncd"                    , ok: ['改行有効']}
  , 数0 : { val: 0                           , ng: ['最大最小', '値リスト']}
  , 数m : { val: -100                        , ng: ['値リスト']}
  , 数p : { val: 100                         , ng: ['値リスト']}
  , 数小: { val: 1.123                       , ng: ['値リスト']}
  , 無限: { val: Infinity                    , ok: false}
  , T   : { val: true                        , ok: false}
  , F   : { val: false                       , ng: ['必須']}
  , 未定: { val: undefined                   , ng: ['必須']}
  , ヌル: { val: null                        , ng: ['必須']}
  , オブジェクト: { val: {aaa: 'bbb'}        , ok: false}
};

validTest(TextFeild, testData, true);

var field = new TextFeild();

msg(Object.keys(TextFeild.prototype));
msg(Object.keys(TextFeild.prototype.__proto__));
