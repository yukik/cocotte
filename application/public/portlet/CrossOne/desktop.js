(function () { var Client = function CrossOnePortlet (options) { this.onPreCreate(options); this.onCreate(); };Client.prototype = new cocotte.Portlet; Client.prototype.constructor = Client; /*
 * クロス表(X軸)ポートレット
 */

cocotte.Portlets.CrossOne = Client;
})();