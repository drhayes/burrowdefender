// mousemanager.js
//
// Fires events relating to mouse stuff.

(function(global, $) {
  var mouseevents = 'mousemove mousedown mouseup';

  var mousemanager = function(args) {
    var that = {};
    
    var dispatchevent = function(e) {
      that.dispatch(e);
    }
    
    that.latch = function() {
      $(args.game.canvas).bind(mouseevents, dispatchevent);
    };
    
    that.unlatch = function() {
      $(args.game.canvas).unbind(mouseevents, dispatchevent);
    };
    
    return that;
  };

  global.mousemanager = mousemanager;

})(window, jQuery)