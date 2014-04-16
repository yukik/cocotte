console.log('require ' + __filename);
var helper = require('cocotte/window/helper');
var win = {
	title   : 'Field API'
  , contents: [
		helper.html(__dirname, '00.field')
	  , helper.html(__dirname, '01.rowno')
	  , helper.html(__dirname, '02.text')
	  , helper.html(__dirname, '03.number')
	  , helper.html(__dirname, '04.check')
	  , helper.html(__dirname, '05.selection')
	  , helper.html(__dirname, '06.timestamp')
	  , helper.html(__dirname, '07.date')
	  , helper.html(__dirname, '08.time')
	  , helper.html(__dirname, '09.tag')
	  , helper.html(__dirname, '10.file')
	  , helper.html(__dirname, '11.comment')
	  , helper.html(__dirname, '12.create')
	]
  , container: helper.container(__dirname)
};
module.exports = exports = win;
