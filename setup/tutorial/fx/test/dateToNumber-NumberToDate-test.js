var msg          = require('cocotte/tools/message')
  , test         = require('cocotte/tools/test')
  , getFx        = require('cocotte/tools/getFx')
  , dateToNumber = getFx('dateToNumber')
  , numberToDate = getFx('numberToDate')
  , eq2num       = test.eqHelper(dateToNumber)
  , eq2date      = test.eqHelper(numberToDate);

eq2num('1969-12-31', -1);
eq2num('1970-1-1', 0);
eq2num('1970-1-2', 1);

eq2date(-1, '1969-12-31');
eq2date( 0, '1970-1-1');
eq2date( 1, '1970-1-2');


msg('テストが成功しました');


