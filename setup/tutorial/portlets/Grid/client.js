/*global Client:true */

/**
 * グリッドポートレット
 */


/** 
 * 描画時にHTMLを作成する
 * @return {String} html
 */
Client.prototype.toHtml = function toHtml () {
	'use strict';
	if (!this.datasource) {
		return 'データソースが設定されていません';
	}

	var fields = this.datasource.fields
	  , html = '<table class="gridPortlet"><tr>';
	Object.keys(fields).forEach(function (name) {
		//var field = fields[name];
		html += '<th>' + name + '</th>';
	});
	html += '</tr></table>';

	return html;
};