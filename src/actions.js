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
        return that;
      };
      
      env.actionmanager = function() {
        var that = {};
        var active = pqueue();
        
        that.add = function(a) {
          active.push(a);
        };
        
        that.execute = function() {
          // execute the active actions
          for (var i = active.length - 1, action; action = active[i--];) {
            action.execute();
          }
        };

        return that;
      };
    };
  });
  
}(this, jQuery));