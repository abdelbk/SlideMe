SlideMe
=======
A simple plugin to enable sliders in pure javascript.


###Usage
To enable a slider, just pass an id of the slider element (which is the trough) like so:
```javascript
var slider = new SlideMe('elementId', options);
```
The options are the following :
 - a `values` object literal which contains the : `min`, `max` and the default `value`.
 - `decimalPlace` which defines how many numbers you want to show after the decimal point.
 - `horizontal` which sets the direction of the handle. The default is `true`. Actually, the direction is set automatically by simply comparing the dimensions of the trough and the handle (which is not that great, I guess). So, you might set it to false to ensure that you'll get a vertical slider.
 - `keyhandler` enables sliding using the keyboard arrows. The default is `true`

Basically, the slider will be a range by nature.
Here is, how it could be with options :
```javascript
var slider = new SlideMe('elementId', {
      values: {
        value: 1,
        min  : 0,
        max  : 5
      },
      decimalPlace : 2
});
```
###Some CSS is required
To make the plugin work, you should target the slider with some basic CSS.
Just make the handle a child element of the slider, and position it in absolute relatively to its parent.

And it's done :)



