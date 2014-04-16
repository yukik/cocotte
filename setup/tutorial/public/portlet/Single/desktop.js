(function () { var Client = function SinglePortlet (options) { this.onPreCreate(options); this.onCreate(); };Client.prototype = new cocotte.Portlet; Client.prototype.constructor = Client; /**
 * 単票ポートレット
 */



cocotte.Portlets.Single = Client;
})();