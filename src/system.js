(function() {
  loki.modules.system = function(env) {
    env.updater = function() {
      var that;
      that = {};
      that.processes = [];
      that.currentFrame = 0;
      that.add = function(updateMe) {
        if (typeof updateMe !== 'function') {
          throw new Error('must pass in a function');
        }
        if (!updateMe.hasOwnProperty('frequency')) {
          updateMe.frequency = 1;
        }
        return that.processes.push(updateMe);
      };
      that.remove = function(removeMe) {
        return that.processes = _.filter(that.processes, function(p) {
          return p !== removeMe;
        });
      };
      that.update = function() {
        _.each(that.processes, function(process, index, list) {
          if (that.currentFrame % process.frequency === 0) {
            return process();
          }
        });
        return that.currentFrame++;
      };
      that.start = function() {
        var update;
        if (!(that.timer != null)) {
          update = function() {
            return that.update();
          };
          return that.timer = setInterval(update, 20);
        }
      };
      that.stop = function() {
        if (that.timer != null) {
          clearTimeout(that.timer);
          return delete that.timer;
        }
      };
      return that;
    };
    return env.eventer = function() {
      var subscribers, that;
      that = {};
      subscribers = {};
      that.subscribe = function(eventName, callback) {
        var callbacks;
        callbacks = subscribers[eventName];
        if (!(callbacks != null)) {
          callbacks = [];
        }
        callbacks.push(callback);
        return subscribers[eventName] = callbacks;
      };
      that.fire = function(eventName, eventArg) {
        var callbacks;
        callbacks = subscribers[eventName];
        if (callbacks != null) {
          return _.each(callbacks, function(callback, index, list) {
            return callback(eventArg);
          });
        }
      };
      return that;
    };
  };
}).call(this);
