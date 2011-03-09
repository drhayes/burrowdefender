(function() {
  var __slice = Array.prototype.slice;
  loki.define('utils', function(env) {
    var pqueue;
    pqueue = env.pqueue;
    return loki.modules.actions = function(env) {
      env.action = function() {
        var that;
        that = {};
        that.priority = 0;
        that.completed = false;
        that.interrupt = false;
        that.tick = function() {
          return null;
        };
        that.candoboth = function(action) {
          return action !== that;
        };
        return that;
      };
      return env.actionmanager = function() {
        var active, queue, that;
        that = {};
        active = pqueue();
        queue = pqueue();
        that.add = function(action) {
          return queue.push(action);
        };
        that.execute = function() {
          var action, args, canaddit, funcname, interrupt, offset, queuecopy, _i, _len;
          funcname = arguments[0], args = 2 <= arguments.length ? __slice.call(arguments, 1) : [];
          if (funcname == null) {
            funcname = 'tick';
          }
          offset = 0;
          interrupt = _.detect(queue, function(action) {
            return action.interrupt;
          });
          if (interrupt != null) {
            active = pqueue();
            active.push(interrupt);
            queue = _.reject(queue, function(a) {
              return a === interrupt;
            });
          }
          queuecopy = queue.slice(0);
          for (_i = 0, _len = queuecopy.length; _i < _len; _i++) {
            action = queuecopy[_i];
            canaddit = _.reduce(active, (function(canaddit, a) {
              return canaddit && a.candoboth(action);
            }), true);
            if (!canaddit) {
              continue;
            }
            queue = _.reject(queue, function(a) {
              return a === action;
            });
            active.push(action);
          }
          active = _.reject(active, function(action) {
            return action.completed;
          });
          return _.each(active, function(a) {
            if (a.hasOwnProperty(funcname)) {
              return a[funcname].apply(a, args);
            }
          });
        };
        return that;
      };
    };
  });
}).call(this);
