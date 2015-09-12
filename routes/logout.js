'use strict';

/*
 * ログアウト処理
 *
 * セッションを削除する
 */

module.exports = exports = function*() {
  if (this.session) {
    this.session.destroy();
  }
  yield this.render({login: false, message: null});
};

