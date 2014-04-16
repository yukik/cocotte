console.log('require ' + __filename);

var helper = require('cocotte/window/helper');

var win = {
	title   : 'Window API'
  , contents: [ helper.html(__dirname, '00.create')
			  , helper.html(__dirname, '01.file')
			  , helper.html(__dirname, '02.open')
			  , helper.html(__dirname, '03.script1')
			  , helper.html(__dirname, '04.script2')
			  , helper.html(__dirname, '05.script3')
			  , helper.html(__dirname, '06.operate')]
  , container: helper.container(__dirname)
};

module.exports = exports = win;
