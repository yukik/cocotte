(function () { var Client = function CrossTwoPortlet (options) { this.onPreCreate(options); this.onCreate(); };Client.prototype = new cocotte.Portlet; Client.prototype.constructor = Client; /**
 * クロス表(X軸,Y軸)ポートレット
 */

cocotte.Portlets.CrossTwo = Client;
})();