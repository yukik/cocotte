console.log('require ' + __filename);

var helper = require('cocotte/window/helper');

var win = {
	title   : 'Workspace API'
  , contents: [ helper.html(__dirname, '00.workspace')
			  , helper.html(__dirname, '01.design')
			  , helper.html(__dirname, '02.script1')
			  , helper.html(__dirname, '03.script2')]
  , container: helper.container(__dirname)
};

module.exports = exports = win;