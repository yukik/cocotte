'use strict';

/**
 * ルート時のビュー表示
 *
 * ログイン状態、ワークスペースを表示
 * ログアウト状態、ログイン画面を表示
 * 
 */
module.exports = exports = function*() {

  var login = this.session.group
    , page = (login ? 'workspace' : 'home') + '/' + this.session.device
    , params = {description: this.app.description};

  yield this.render(page, params);

};




