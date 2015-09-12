console.log('require ' + __filename);

var helper = require('cocotte/window/helper');

var win = {
	title   : 'cocotteについて'
  , description : helper.description(__dirname)
  , contents: [ helper.html(__dirname, '00.top')
			  , helper.html(__dirname, '01.operation')
			  , helper.html(__dirname, '02.files')
			  , helper.html(__dirname, '03.workspace')
			  , helper.html(__dirname, '04.window')
			  , helper.html(__dirname, '05.data')
			  , helper.html(__dirname, '06.field')
			  , helper.html(__dirname, '07.portlet')
			  , helper.html(__dirname, '08.fx')
			  , helper.html(__dirname, '09.tools')]
  , container: helper.container(__dirname)
};

module.exports = exports = win;
