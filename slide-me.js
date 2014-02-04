var SlideMe, Util;

Util = (function() {
	function Util() {}

	Util.extend = function(obj, defaults, options) {
		for(prop in defaults) {
			if(typeof options !== 'undefined' && options.hasOwnProperty(prop)) {
				obj[prop] = options[prop];
			} else {
				obj[prop] = defaults[prop];
			}
		}
		return obj;
	}

	return Util;
})();

SlideMe = (function() {
	var defaults = {
			values : {
				value : 0,
				min : 0,
				max : 10
			},
			decimalPlace : 0
		};

	function SlideMe(slider, options) {
		this.config       = Util.extend({}, defaults, options);
		this.slider       = document.getElementById(slider);
		this.handle       = this.slider.firstElementChild;
		this.currentValue = this.config.values.value;
		this.setHandlePosition(this.config.values.value);
		this.addMouseHandlers();
	}

	SlideMe.prototype.addMouseHandlers = function() {
		var me = this;
		me.handle.addEventListener('mousedown', function(e) {
			e.preventDefault();
			me.dragging = true;
			me.position = e.clientX - me.handle.offsetLeft;
		}, false);

		document.addEventListener('mousemove', function(e) {
			e.preventDefault();
			if(me.dragging === true) {
				me.changeHandlePosition(e);
			}
		}, false);

		document.addEventListener('mouseup', function(e) {
			e.preventDefault();
			me.dragging = false;
		}, false);
	}

	SlideMe.prototype.changeHandlePosition = function(e) {
		var left = e.clientX - this.position;
		this.prevValue    = this.currentValue;
		this.currentValue = this.getHandleValue(left, this.config.decimalPlace);
		if(this.currentValue != this.prevValue) {
			this.setHandlePosition(this.currentValue);
		}
	}

	SlideMe.prototype.setHandlePosition = function(value) {
		var percent  = (value - this.config.values.min) / (this.config.values.max - this.config.values.min);
		    position = (this.slider.offsetWidth - this.handle.offsetWidth) * percent;
		this.handle.style.left = position + 'px';	
		return position;
	}

	SlideMe.prototype.getHandleValue = function(position, decimalPlace) {
		var percent = position / (this.slider.offsetWidth - this.handle.offsetWidth),
		    value   = percent * (this.config.values.max - this.config.values.min) + this.config.values.min;
		
		value = Math.floor(value * Math.pow(10, decimalPlace)) / Math.pow(10, decimalPlace);
		if(value < this.config.values.min) value = this.config.values.min;
		if(value > this.config.values.max) value = this.config.values.max;
		
		return value;
	}

	return SlideMe;
})();