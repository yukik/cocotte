console.log('require ' + __filename);

var helper = require('cocotte/window/helper');
var win = {
	title   : 'Diagram API'
  , contents: [
		helper.html(__dirname, '00.diagram')
	  , helper.html(__dirname, '01.create')
	  , helper.html(__dirname, '02.relation')
	  , helper.html(__dirname, '03.hooks')
	  , helper.html(__dirname, '04.share')
	]
  , container: helper.container(__dirname)
};

module.exports = exports = win;
