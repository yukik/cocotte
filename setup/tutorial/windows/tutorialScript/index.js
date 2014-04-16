console.log('require ' + __filename);

var helper = require('cocotte/window/helper');

var win = {
	title   : 'スクリプト - CountUp'
  , contents: helper.html(__dirname, 'index')
  , script  : require('./server')
  , valid   : require('./valid')
};

module.exports = exports = win;
