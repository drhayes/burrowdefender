// mousemanager.js
//
// Fires events relating to mouse stuff.

(function(global, $) {
  var mouseevents = 'mousemove mousedown mouseup';

  var mousemanager = function(args) {
    var that = {};
    
    // mouse position exposed
    that.pos = {
      x: 0,
      y: 0
    };
    
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
    };
    
    that.latch();
    
    return that;
  };

  global.mousemanager = mousemanager;

})(window, jQuery)