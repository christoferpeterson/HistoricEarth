HistoricEarth = (function() {

	var wrapper_id = "historic-earth";
	var historicEarth = function() { };

	historicEarth.controllers = {};
	historicEarth.directives = {};


	// initialize the historic earth object
	historicEarth.init = function()
	{
		this.init_module();
		this._$wrapper();
	}

	historicEarth.init_module = function() {
		this.module = angular.module('historic-earth', ['ngRoute']);

		this.module.controller('main-controller', historicEarth.controllers.main);
		this.module.controller('ViewPortController', historicEarth.controllers.viewport);

		this.configure_module();
	}

	historicEarth.configure_module = function() {
		// configure the routes
		this.module.config(function($routeProvider){
			$routeProvider.when('/', {
				templateUrl: 'pages/viewport.html',
				controller: 'ViewPortController as viewportController'
			});
		});

		this.module.directive('uiViewport', historicEarth.directives.uiviewport);
	}

	historicEarth.calculate_mouse_position = function(e, offset) {
		var x;
		var y;

		// mouse position in modern browsers
		if(e.pageX || e.pageY)
		{
			x = e.pageX;
			y = e.pageY;
		}
		else
		{
			x = e.clientX + document.body.scrollLeft - document.documentElement.scrollLeft; // calculate the y position of the mouse relative to the wrapper
			y = e.clientY + document.body.scrollTop - document.documentElement.scrollTop; // calculate the x position of the mouse relative to the wrapper
		}

		if(offset && offset.top && offset.left)
		{
			x -= offset.left;
			y -= offset.top;
		}

		return { x: x, y: y };
	}

	// build the historic earth wrapper (cached)
	historicEarth._$wrapper = function() {
		var $wrapper = $('#' + wrapper_id);
		if($wrapper.length === 0)
		{
			$wrapper = $('<div ng-app="historic-earth" class="historic-earth-wrapper" id="' + wrapper_id +'"><div ng-view></div></div>');
			$('body').prepend($wrapper);
		}
		return $wrapper;
	}

	return historicEarth;
})();