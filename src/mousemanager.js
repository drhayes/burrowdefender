// mousemanager.js
//
// Fires events relating to mouse stuff.

(function(global, $) {
  var mouseevents = 'mousemove mousedown mouseup contextmenu';

  var mousemanager = function(args) {
    var that = {};
    
    // mouse position exposed
    that.pos = {
      x: 0,
      y: 0
    };
    // mouse buttons exposed
    that.leftbutton = false;
    that.rightbutton = false;
    
    // grab the canvas offsets...
    var canvasoffset = $(args.game.canvas).offset();
    
    var dispatchevent = function(e) {
      that.dispatch(e);
    }
    
    that.latch = function() {
      $(args.game.canvas).bind(mouseevents, dispatchevent);
    };
    
    that.unlatch = function() {
      $(args.game.canvas).unbind(mouseevents, dispatchevent);
    };
    
    that.dispatch = function(e) {
      // handle mouse movement
      that.pos.x = e.pageX - canvasoffset.left;
      that.pos.y = e.pageY - canvasoffset.top;
      // handle button clicks
      if (e.type === 'mouseup') {
        that.rightbutton = false;
        that.leftbutton = false;
      }
      if (e.type === 'contextmenu') {
        that.leftbutton = false;
        that.rightbutton = true;
      }
      else if (e.type === 'mousedown') {
        that.leftbutton = true;
      }
      e.stopPropagation();
      e.preventDefault();
    };
    
    that.latch();
    
    return that;
  };

  global.mousemanager = mousemanager;

})(this, jQuery)