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
    var env = {},
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
          var modulename = modules[i];
          if (!loki.modules.hasOwnProperty(modulename)) {
            throw {
              name: 'Missing module',
              message: 'Trying to import module: ' + modulename,
              toString: function() { return this.message; }
            };
          };
          loki.modules[modulename](env);
        };
      };
      
      // call the callback
      callback(env);
  };
  
  global.loki = loki;
  
  // modify the Function prototype to provide rate-limiting for functions that
  // shouldn't actually run until some time limit has passed by.
  Function.prototype.ratelimit = function(interval) {
    var lastcalled = 0;
    var me = this;
    return function limiter() {
      var current = new Date().getTime();
      // force is in place for debugging purposes and is reset every call
      if (current - lastcalled >= interval || limiter.force) {
        limiter.force = false;
        lastcalled = current;
        return me.apply(me, arguments);
      }
    }
  };

  
}(this, jQuery));