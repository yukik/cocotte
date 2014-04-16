console.log('require ' + __filename);

var helper = require('cocotte/window/helper');

var win = {
	title   : 'スクリプト - MemoryUsage'
  , contents: helper.html(__dirname, 'index')
  , script  : require('./server')
};

module.exports = exports = win;
