// eventer.js
//
// an object that handles subscribing to and firing events

(function(global, $) {

  var eventer = function() {
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
  }

  global.eventer = eventer;
  
})(window, jQuery)
