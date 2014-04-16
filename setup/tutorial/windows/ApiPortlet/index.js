console.log('require ' + __filename);

var helper = require('cocotte/window/helper');

var win = {
	title   : 'Portlet API'
  , contents: [ helper.html(__dirname, '00.portlet')
			  , helper.html(__dirname, '01.create1')
			  , helper.html(__dirname, '02.create2')]
  , container: helper.container(__dirname)
};

module.exports = exports = win;
