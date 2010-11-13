// system.js
//
// Things that update, things that fire events.

(function(global, $) {
  
  loki.modules.system = function(env) {
    env.updater = function() {
      var that = {};
      that.processes = [];
      that.currentFrame = 0;

      that.add = function(updateMe) {
        if (typeof(updateMe) !== 'function') {
          throw new Error('must pass in function');
        }
        if (!updateMe.hasOwnProperty('frequency')) {
          updateMe.frequency = 1;
        }
        that.processes.push(updateMe);
      }

      that.remove = function(removeMe) {
        that.processes = $.grep(that.processes, function(process) {
          return process !== removeMe;
        })
      }

      that.update = function() {
        $.each(that.processes, function(index, process) {
          if ((that.currentFrame % process.frequency) === 0) {
            process();
          }
        });
        that.currentFrame++;
      }

      that.start = function() {
        if (!that.timer) {
          that.timer = setInterval(function() {
              that.update();
            }, 20);
        }
      }

      that.stop = function() {
        if (that.timer) {
          clearTimeout(that.timer);
          delete(that.timer);
        }
      };
      
      return that;
    }; // updater
    
    env.eventer = function() {
      var that = {};
      var subscribers = {};

      that.subscribe = function(eventName, callback) {
          if (eventName === null) {
              throw new Error('eventName required');
          }
          if (typeof(callback) !== 'function') {
              throw new Error('callback must be function');
          }
          var callbacks = subscribers[eventName];
          if (typeof(callbacks) === 'undefined') {
              callbacks = [];
          }
          callbacks.push(callback);
          subscribers[eventName] = callbacks;
      }

      that.fire = function(eventName, eventArg) {
          if (eventName === null) {
              throw new Error('eventName required');
          }
          // if no subscribers for an event, exit early
          if (!subscribers.hasOwnProperty(eventName)) {
              return;
          }
          var callbacks = subscribers[eventName];
          if (callbacks !== null) {
              $.each(callbacks, function(index, callback) {
                  callback(eventArg);
              });
          };
      };
      
      return that;
    }; // eventer
  }
  
}(this, jQuery));