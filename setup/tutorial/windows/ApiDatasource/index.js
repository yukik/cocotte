console.log('require ' + __filename);

var helper = require('cocotte/window/helper');

var win = {
	title   : 'Datasource API'
  , contents: [ helper.html(__dirname, '00.datasource')
			  , helper.html(__dirname, '01.create')
			  , helper.html(__dirname, '02.use')
			  , helper.html(__dirname, '03.event')]
  , container: helper.container(__dirname)
};

module.exports = exports = win;
