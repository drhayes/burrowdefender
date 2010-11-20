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
      
      // highest priority actions are run first
      env.actionmanager = function() {
        var that = {},
          active = pqueue(),
          queue = pqueue();
        
        that.add = function(a) {
          queue.push(a);
        };
        
        that.execute = function() {
          // add actions from the queue
          var queuecopy = queue.slice(0);
          var offset = 0;
          for (var i = 0, queuelength = queuecopy.length; i < queuelength; i++) {
            var action = queuecopy[i];
            // can this action combine with the actives?
            var addit = true;
            for (var j = active.length - 1, activeaction; activeaction = active[j--];) {
              addit &= activeaction.candoboth(action);
            }
            // if this action can't combine, skip it for now
            if (!addit) {
              continue;
            }
            // remove from queue and add to active
            queue.splice(i - offset, 1);
            offset++;
            active.push(action);
          }
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