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
			invertValues : false,
			decimalPlace : 0,
			keyhandler : true
		};

	function SlideMe(slider, options) {
		this.config       = Util.extend({}, defaults, options);
		this.slider       = document.getElementById(slider);
		this.handle       = this.slider.firstElementChild;
		this.currentValue = this.config.invertValues ? this.config.values.max - this.config.values.value : this.config.values.value;
		this.getHandleDirection();
		this.setHandlePosition(this.currentValue);
		this.addMouseHandlers();
		if(this.config.keyhandler) this.addKeyboardHandler();
	}


	SlideMe.prototype.getHandleDirection = function() {
		if(this.config.horizontal || this.handle.offsetWidth < this.slider.offsetWidth) {
			this.units = {
				coord : 'clientX',
				offsetPos : 'offsetLeft',
				offsetDim : 'offsetWidth',
				offsetStyle : 'left',
				keyNext : 39,
				keyPrev : 37,
			}
		} else {
			this.units = {
				coord : 'clientY',
				offsetPos : 'offsetTop',
				offsetDim : 'offsetHeight',
				offsetStyle : 'top',
				keyNext : 40,
				keyPrev : 38
			}
		}

	}

	SlideMe.prototype.getCurrentValue = function() {
		return (this.config.invertValues) ? this.config.values.max - this.currentValue : this.currentValue; 
	} 

	SlideMe.prototype.addMouseHandlers = function() {
		var me = this;
		me.handle.addEventListener('mousedown', function(e) {
			e.preventDefault();
			me.enable();
			me.dragging = true;
			me.position = e[me.units.coord] - me.handle[me.units.offsetPos];
		}, false);

		document.addEventListener('mousemove', function(e) {
			e.preventDefault();
			if(me.dragging === true && me.isActive()) {
				me.changeHandlePosition(e);
			}
		}, false);

		document.addEventListener('mouseup', function(e) {
			e.preventDefault();
			me.dragging = false;
		}, false);
	}

	// right 39, left: 37, up: 38, down: 40
	SlideMe.prototype.addKeyboardHandler = function() {
		var me = this;
		document.addEventListener('keydown', function(e) {
			if(me.isActive()) {
				var code = e.charCode || e.keyCode;
				if(code == me.units.keyNext && me.currentValue < me.config.values.max) {
					me.currentValue += Math.pow(10, me.config.decimalPlace);
				} else if(code == me.units.keyPrev && me.currentValue > me.config.values.min) {
					me.currentValue -= Math.pow(10, me.config.decimalPlace);
				}
				me.setHandlePosition(me.currentValue);
			}
		}, false);
	}

	SlideMe.prototype.isActive = function() {
		return this.handle.className.indexOf('slideme-active') > -1 ? true : false;
	}

	SlideMe.prototype.enable = function() {
		var handles = document.getElementsByClassName('slideme-active');

		if(this.handle.className.indexOf('slideme-active') == -1) {
			if(handles.length > 0) {
				for(var i = 0; i < handles.length; i++) {
					handles[i].className = handles[i].className.replace(' slideme-active', '');;
				}
			}
			this.handle.className += ' slideme-active';
		}
	}

	SlideMe.prototype.changeHandlePosition = function(e) {
		var position = e[this.units.coord] - this.position;
		
		this.prevValue    = this.currentValue;
		this.currentValue = this.getHandleValue(position, this.config.decimalPlace);
		if(this.currentValue != this.prevValue) {
			this.setHandlePosition(this.currentValue);
		}
	}

	SlideMe.prototype.getHandlePosition = function(value) {
		var percent = (value - this.config.values.min) / (this.config.values.max - this.config.values.min);
		return (this.slider[this.units.offsetDim] - this.handle[this.units.offsetDim]) * percent;
	}

	SlideMe.prototype.setHandlePosition = function(value) {
		var position = this.getHandlePosition(value);
		this.handle.style[this.units.offsetStyle] = position + 'px';	
	}

	SlideMe.prototype.getHandleValue = function(position, decimalPlace) {
		var percent = position / (this.slider[this.units.offsetDim] - this.handle[this.units.offsetDim]),
		    value   = percent * (this.config.values.max - this.config.values.min) + this.config.values.min;
		
		value = Math.floor(value * Math.pow(10, decimalPlace)) / Math.pow(10, decimalPlace);
		if(value < this.config.values.min) value = this.config.values.min;
		if(value > this.config.values.max) value = this.config.values.max;
		
		return value;
	}

	return SlideMe;
})();
