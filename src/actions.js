// actions.js
//
// Framework for all things actiony.

(function(global, $) {
  
  loki.define('utils', function(env) {
    var pqueue = env.pqueue;
    
    loki.modules.actions = function(env) {
      // creates a basic action that doesn't do anything but act as a good default
      env.action = function() {
        var that = {};
        that.priority = 0;
        that.completed = false;
        that.execute = function() {};
        that.candoboth = function() {
          return true;
        }
        return that;
      };
      
      env.actionmanager = function() {
        var that = {};
        var active = pqueue();
        
        that.add = function(a) {
          active.push(a);
        };
        
        that.execute = function() {
          // copy the active list as we might have to remove completed actions
          var activecopy = active.slice(0);
          // execute the active actions
          for (var i = activecopy.length - 1, action; action = activecopy[i--];) {
            if (action.completed) {
              active.splice(i + 1, 1);
            }
            else {
              action.execute();
            }
          }
        };

        return that;
      };
    };
  });
  
}(this, jQuery));