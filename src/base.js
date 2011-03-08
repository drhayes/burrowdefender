(function() {
  var Function, loki;
  var __slice = Array.prototype.slice;
  loki = {
    modules: {},
    define: function() {
      var args, callback, env, module, modulename, modules, _i, _len;
      args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
      env = {};
      callback = args.pop();
      modules = (args[0] != null) && typeof args[0] === 'string' ? args : args[0];
      if ((modules != null) && modules[0] === '*') {
        modules = (function() {
          var _i, _len, _ref, _results;
          _ref = loki.modules;
          _results = [];
          for (_i = 0, _len = _ref.length; _i < _len; _i++) {
            module = _ref[_i];
            _results.push(module);
          }
          return _results;
        })();
      }
      for (_i = 0, _len = modules.length; _i < _len; _i++) {
        modulename = modules[_i];
        console.log(modulename);
        if (!loki.modules.hasOwnProperty(modulename)) {
          throw {
            name: 'Mission module',
            message: 'Trying to import module: ' + modulename,
            toString: function() {
              return this.message;
            }
          };
        }
        loki.modules[modulename](env);
      }
      return callback(env);
    }
  };
  Function = (function() {
    function Function() {}
    return Function;
  })();
  Function.prototype.ratelimit = function(interval) {
    var lastcalled, limiter;
    lastcalled = 0;
    return limiter = function() {
      var args, current;
      args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
      current = new Date().getTime();
      if (current - lastcalled >= interval || limiter.force) {
        limiter.force = false;
        lastcalled = current;
        return this.apply(this, args);
      }
    };
  };
  this.loki = loki;
}).call(this);
