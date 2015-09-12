
'use strict';

var coBody = require('co-body')
  , Model = require('cocotte-model')
  , is = require('cocotte-is');

/**
 * ログイン処理を行い成功時にセッションに認証データを保存する
 * @method login
 * @static
 */
module.exports = exports = function*() {
  var post = yield coBody(this)
    , message = null
    , login = false;

  if (this.session.group && this.session.user) {
    login = true;
    message = '既にログインしています';

  } else if (!post) {
    message = '入力データが存在しません';

  } else if (!is(String, post.group) || post.group.length > 100) {
    message = '所属の値が不正です';

  } else if (!is(String, post.user) || post.user.length > 100) {
    message = 'ユーザーの値が不正です';

  } else if (!is(String, post.password) || post.password.length > 100) {
    message = '所属もしくはユーザーの値が不正です';

  } else {

    var models = yield [Model.get('group'), Model.get('user'), Model.get('role')]
      , groupModel = models[0]
      , userModel = models[1]
      , roleModel = models[2];

    var results = yield [groupModel.find({name: post.group})
              , userModel.find({name: post.user, password: post.password})
              , roleModel.find({user: post.user, group: post.group})];

    var group = results[0]
      , user = results[1]
      , role = results[2];

    if (group && user) {
      //ログイン成功
      this.session.group = group.name;
      this.session.user = user.name;
      this.session.role = role ? role.role : user.role;
      login = true;

    } else {
      message = 'ログインに失敗しました';

    }

  }

  yield this.render({login: login, message: message});
};


