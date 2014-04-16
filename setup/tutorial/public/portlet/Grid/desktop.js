(function () { var Client = function GridPortlet (options) { this.onPreCreate(options); this.onCreate(); };Client.prototype = new cocotte.Portlet; Client.prototype.constructor = Client; /**
 * グリッドポートレット
 */


/** 
 * 描画時にHTMLを作成する
 * @return {String} html
 */
Client.prototype.toHtml = function toHtml () {
	if (!this.datasource) {
		return 'データソースが設定されていません';
	}

	var fields = this.datasource.fields
	  , html = '<table class="gridPortlet"><tr>'
	Object.keys().forEach(function (name) {
		var field = fields[name];
		html += '<th>' + name + '</th>'
	});
	html += '</tr></table>';

	return html;
};
cocotte.Portlets.Grid = Client;
})();