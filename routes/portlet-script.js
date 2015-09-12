'use strict';

/**
 * ポートレットスクリプトのビュー表示 
 */
module.exports = exports = function*(name) {
  yield this.render('portlet-script:' + name);
};
