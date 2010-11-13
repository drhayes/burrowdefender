// base.js
//
// Defines methods to define modules.

(function(global, $) {
  
  // top-level game engine namespace
  var loki = {};
  
  // allow other modules to be defined on it
  loki.modules = {};
  
  // The function that creates modules within the game.
  loki.define = function() {
    var that = {},
      args = Array.prototype.slice.call(arguments),
      callback = args.pop(),
      modules = (args[0] && typeof args[0] === 'string') ? args: args[0],
      i;
      
      // did the caller ask for any modules?
      if (modules) {
        if (modules[0] === '*') {
          modules = [];
          for (i in loki.modules) {
            if (loki.modules.hasOwnProperty(i)) {
              modules.push(i);
            }
          }
        };

        // initialize the modules
        for (i = 0; i < modules.length; i += 1) {
          loki.modules[modules[i]](that);
        };
      };
      
      // call the callback
      callback(that);
  };
  
  global.loki = loki;
  
}(this, jQuery));