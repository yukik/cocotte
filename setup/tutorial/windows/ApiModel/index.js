console.log('require ' + __filename);

var helper = require('cocotte/window/helper');

var win = {
	title   : 'Model API'
  , contents: [
		helper.html(__dirname, '00.model')
	  , helper.html(__dirname, '01.create')
	  , helper.html(__dirname, '02.use')
	]
  , container: helper.container(__dirname)
};

module.exports = exports = win;
