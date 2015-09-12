'use strict';

/*
 * 不明なリクエスト
 * GETの場合は404のhtmlで、POSTの場合はJSONを返す
 */
module.exports = exports = function*() {

  if (this.req.method === 'POST') {
    yield this.render({login:false, message: 'REQUEST FAILURE'});

  // GET時
  } else {
    yield this.render('404/' + this.session.device);

  }
};

