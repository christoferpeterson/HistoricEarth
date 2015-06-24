HistoricEarth.directives.uiviewport = (function() {

	var viewport_module = function($scope, $element) {
		this.$module = $element;
		this.$scope = $scope;
	}

	viewport_module.prototype.init = function() {
		this.cursorPosFromOriginX = 0;
		this.cursorPosFromOriginY = 0;
		this.cursorActualPositionX = 0;
		this.cursorActualPositionY = 0;
		this.totalWidth = 0;
		this.totalHeight = 0;
		this.degreesX = 0;
		this.degreesY = 0;
		this.maxDegrees = 180;

		this.crosshairEnabled = true;
		this.geoLocationEnabled = false;

		this.reset_zoom_box();
	}

	viewport_module.prototype.handle_mouse_down = function(e) {
		var $el = $(e.currentTarget);
		var offset = $el.offset();

		var x;
		var y;

		var mousePosition = HistoricEarth.calculate_mouse_position(e, offset);

		this.zoomBoxPosition.top = mousePosition.y;
		this.zoomBoxPosition.left = mousePosition.x;

		this.zoomBoxPosition.pivotLeft = mousePosition.x;
		this.zoomBoxPosition.pivotTop = mousePosition.y;
		this.zoomBoxPosition.pivotBottom = this.totalHeight - mousePosition.y;
		this.zoomBoxPosition.pivotRight = this.totalWidth - mousePosition.x;

		this.dragging = true;

		e.preventDefault();
	}

	viewport_module.prototype.handle_mouse_up = function(e) {
		this.dragging = false;
		this.reset_zoom_box();
	}

	viewport_module.prototype.handle_mouse_move = function(e) {
		var $el = $(e.currentTarget);
		var offset = $el.offset();

		this.totalHeight = $el.height();
		this.totalWidth  = $el.width();
		var offsetHeight = this.totalHeight / 2;
		var offsetWidth = this.totalWidth / 2;

		var mousePosition = HistoricEarth.calculate_mouse_position(e, offset);

		this.cursorActualPositionX =  mousePosition.x;
		this.cursorActualPositionY = mousePosition.y;

		this.cursorPosFromOriginX = this.cursorActualPositionX - offsetWidth;
		this.cursorPosFromOriginY = this.cursorActualPositionY - offsetHeight;

		if(this.geoLocationEnabled)
		{
			this.degreesX = this.cursorPosFromOriginX * this.maxDegrees / (this.totalWidth / 2);
			this.degreesY = -this.cursorPosFromOriginY * this.maxDegrees / (this.totalHeight / 2);
			
			this.latitude = this.formatDegrees(this.degreesY, true);
			this.longitude = this.formatDegrees(this.degreesX, false);

			this.xLabel = 'φ';
			this.yLabel = 'λ';
		}
		else
		{
			this.latitude = Math.floor(this.cursorPosFromOriginY);
			this.longitude = Math.floor(this.cursorPosFromOriginX);

			this.xLabel = 'X';
			this.yLabel = 'Y';
		}

		

		

		if(this.dragging)
		{
			this.update_zoom_box(mousePosition.x, mousePosition.y)
		}

		e.preventDefault();
	}

	viewport_module.prototype.update_zoom_box = function(x, y) {
		if(x < this.zoomBoxPosition.pivotLeft) // expanded left
		{
			this.zoomBoxPosition.left = x;
			this.zoomBoxPosition.right = this.zoomBoxPosition.pivotRight;
		}
		else
		{
			this.zoomBoxPosition.right = this.totalWidth - x;
			this.zoomBoxPosition.left = this.zoomBoxPosition.pivotLeft;
		}

		if(y < this.zoomBoxPosition.pivotTop) // expanded up
		{
			this.zoomBoxPosition.top = y;
			this.zoomBoxPosition.bottom = this.zoomBoxPosition.pivotBottom;
		}
		else
		{
			this.zoomBoxPosition.bottom = this.totalHeight - y;
			this.zoomBoxPosition.top = this.zoomBoxPosition.pivotTop;
		}
	}

	viewport_module.prototype.reset_zoom_box = function() {
		this.zoomBoxPosition = {};
	}

	viewport_module.prototype.update_crosshair = function(e) {
		var $checkbox = $(e.currentTarget);

		if($checkbox.is(':checked'))
		{
			this._$crosshair().show();
			this.$module.addClass('no-cursor');
		}
		else
		{
			this._$crosshair().hide();
			this.$module.removeClass('no-cursor');
		}
	}

	viewport_module.prototype._$crosshair = function() {
			// grab the horizontal line
		this._$cr = this._$cr || $('div.crosshair', this.$module);

		// if the line doesn't exist, create it and append it to the wrapper
		if(this._$cr.length == 0)
		{
			this._$cr = $('<div class="crosshair" />');
		}

		// return the horizontal line
		return this._$cr;
	}

	viewport_module.prototype.formatDegrees = function(d, isLatitude) {
		var output = [];

		var degrees = d < 0 ? d * -1 : d;
		var minutes = degrees % 1 * 60;
		var seconds = minutes % 1 * 60;

		degrees = Math.floor(degrees);
		minutes = Math.floor(minutes);
		seconds = Math.floor(seconds);

		output.push(degrees + '°');
		
		if(minutes != 0)
		{
			output.push(' ', minutes, '\'');
		}

		if(seconds != 0)
		{
			output.push(' ', seconds, '\'\'');
		}

		output.push(' ', d < 0 ? (isLatitude ? 'S' : 'W') : (isLatitude ? 'N' : 'E'));

		return output.join('');
	};

	return function() {
		return {
			restrict: 'C',
			link: function(scope, element, attrs) {
				if(scope.viewportController)
				{
					scope.viewportController.viewport = new viewport_module(scope, $(element[0]));
					scope.viewportController.viewport.init();
				}
			}
		}
	};
})();