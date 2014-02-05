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
			horizontal : true,
			decimalPlace : 0
		};

	function SlideMe(slider, options) {
		this.config       = Util.extend({}, defaults, options);
		this.slider       = document.getElementById(slider);
		this.handle       = this.slider.firstElementChild;
		this.currentValue = this.config.values.value;
		this.getHandleDirection();
		this.setHandlePosition(this.config.values.value);
		this.addMouseHandlers();
	}

	SlideMe.prototype.addMouseHandlers = function() {
		var me = this;
		me.handle.addEventListener('mousedown', function(e) {
			e.preventDefault();
			var coord  = me.horizontal ? 'clientX' : 'clientY',
			    offset = me.horizontal ? 'offsetLeft' : 'offsetTop';
			
			me.dragging = true;
			me.position = e[coord] - me.handle[offset];
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

	SlideMe.prototype.getHandleDirection = function() {
		if(this.config.horizontal || this.handle.offsetWidth < this.slider.offsetWidth) {
			this.horizontal = true;
		} else {
			this.horizontal = false;
		}

	}

	SlideMe.prototype.changeHandlePosition = function(e) {
		var coord    = this.horizontal ? 'clientX' : 'clientY',
	            position = e[coord] - this.position;
		
		this.prevValue    = this.currentValue;
		this.currentValue = this.getHandleValue(position, this.config.decimalPlace);
		if(this.currentValue != this.prevValue) {
			this.setHandlePosition(this.currentValue);
		}
	}

	SlideMe.prototype.setHandlePosition = function(value) {
		var percent     = (value - this.config.values.min) / (this.config.values.max - this.config.values.min),
	  	    offset      = this.horizontal ? 'offsetWidth' : 'offsetHeight',
		    styleOffset = this.horizontal ? 'left' : 'top',
		    position    = (this.slider[offset] - this.handle[offset]) * percent;
		
		this.handle.style[styleOffset] = position + 'px';	
		return position;
	}

	SlideMe.prototype.getHandleValue = function(position, decimalPlace) {
		var offset  = this.horizontal ? 'offsetWidth' : 'offsetHeight',
		    percent = position / (this.slider[offset] - this.handle[offset]),
		    value   = percent * (this.config.values.max - this.config.values.min) + this.config.values.min;
		
		value = Math.floor(value * Math.pow(10, decimalPlace)) / Math.pow(10, decimalPlace);
		if(value < this.config.values.min) value = this.config.values.min;
		if(value > this.config.values.max) value = this.config.values.max;
		
		return value;
	}

	return SlideMe;
})();
