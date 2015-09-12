(function (cocotte) {
	
	var Client = function ChartPortlet (options) {
		this.onPreCreate(options);
		this.onCreate();
	};
	
	Client.prototype = new cocotte.Portlet();
	
	Client.prototype.constructor = Client;

	/*
	 * チャートポートレット
	 */


	cocotte.Portlets.Chart = Client;
})(cocotte);