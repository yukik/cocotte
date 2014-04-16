console.log('require ' + __filename);
/*
 * iframeのウインドウの定義は以下のように行います
 */
var win = {
	title   : 'W3C'
  , contents: {url : 'www.w3c.org'}
};

module.exports = exports = win;