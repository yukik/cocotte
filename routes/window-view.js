// ウインドウビューを取得
'use strict';

var path = require('path');

// 命名規則確認
var reg = /^[0-9a-z]{1,20}$/i;

module.exports = exports = function*(name, template){

  var f;

  if (reg.test(name) && reg.test(template)) {
    f = path.join('windows', name, template + '.html');

  } else {
    f = path.join('windows', 'unkown.html');

  }

  yield this.render('window-view:' + f);

};
