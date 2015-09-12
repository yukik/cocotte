'use strict';

/**
 * ウインドウスクリプトのビュー表示 
 */

module.exports = exports = function*(name) {
  yield this.render('window-script:' + name);
};
