'use strict';

module.exports = exports = function(app) {
  return function*(next){
    this.app = app;
    yield next;
  };
};

