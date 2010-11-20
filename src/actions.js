// actions.js
//
// Framework for all things actiony.

(function(global, $) {
  
  loki.define('utils', function(env) {
    var pqueue = env.pqueue;
    
    loki.modules.actions = function(env) {
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
      }
    };
  });
  
}(this, jQuery));