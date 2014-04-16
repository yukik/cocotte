/*globals Client:true*/

/**
 * 地図ポートレット
 * @class MapPortlet
 */

/** 
 * 描画時にHTMLを作成する
 * @method toHtml
 * @return {String} html
 */
Client.prototype.toHtml = function toHtml () {
	'use strict';
	if (this.locals.address) {
		return '<iframe class="mapPortlet" src="https://maps.google.co.jp/maps?q=' +
				this.locals.address +
				'&amp;z=14&amp;output=embed"></iframe>';
	} else {
		return '住所が未設定です';
	}
};


