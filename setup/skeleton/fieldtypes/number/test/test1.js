var validTest = require('cocotte/fieldtype/rowno/test/valid-test')
  , NumberFeild = require('cocotte/fieldtype/number')
  , testData  = {};

//定義リスト
testData.schemas = {
	dummy   :null
  , 既定    : {}
  , 必須    : {required: true}
  , 最大最小: {min: 50, max: 200}
  , 少数    : {precision: 1}
};

//値リスト
testData.values = {
	dummy:null
  , 数0 : {val: 0                       , ng: ['最大最小']}
  , 数m : {val: -100                    , ng: ['最大最小']}
  , 数p : {val: 100                     , ok: true}
  , 数小: {val: 1.123                   , ng: ['最大最小']}
  , 無限: {val: Infinity                , ng: true}
  , 最大: {val: Number.MAX_VALUE        , ng: true}
  , 最小: {val: Number.MIN_VALUE        , ng: ['最大最小']}
  , 無P : {val: Number.POSITIVE_INFINITY, ng: true}
  , 無N : {val: Number.NEGATIVE_INFINITY, ng: true}
  , 文字: {val: 'abcd'                  , ng: true}
  , 字0 : {val: '0'                     , ng: ['最大最小']}
  , T   : {val: true                    , ng: true}
  , F   : {val: false                   , ng: ['必須']}
  , 未定: {val: undefined               , ng: ['必須']}
  , ヌル: {val: null                    , ng: ['必須']}
  , オブ: {val: {aaa: 'bbb'}            , ng: true}
};

validTest(NumberFeild, testData, true);
//validTest(NumberFeild, testData, true, true);
