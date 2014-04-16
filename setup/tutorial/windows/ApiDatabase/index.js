console.log('require ' + __filename);

var helper = require('cocotte/window/helper');

var win = {
	title   : 'Database API'
  , contents: [ helper.html(__dirname, '00.database')
			  , helper.html(__dirname, '01.driver')]
  , container:  helper.container(__dirname)
};

module.exports = exports = win;
