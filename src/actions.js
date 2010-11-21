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
        that.interrupt = false;
        that.tick = function() {};
        that.candoboth = function(action) {
          return action !== that;
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
        
        that.execute = function(funcname) {
          var i = 0,
            j = 0,
            queuelength = queue.length,
            activeaction,
            offset = 0,
            queuecopy = queue.slice(0),
            args = Array.prototype.slice.call(arguments, 1);
          // if we weren't given a funcname, assume 'tick'
          funcname = funcname || 'tick';
          // do we have any interrupts?
          for (i = 0; i < queuelength; i++) {
            var action = queuecopy[i];
            if (action.interrupt) {
              // dump the active actions and run this one now
              active = pqueue();
              active.push(action);
              // pull it from the queue as well
              queue.splice(i - offset, 1);
              offset++;
            }
          }
          // get a clean copy of the queue for this one
          queuecopy = queue.slice(0);
          queuelength = queue.length;
          offset = 0;
          for (i = 0; i < queuelength; i++) {
            var action = queuecopy[i];
            // can this action combine with the actives?
            var addit = true;
            for (j = active.length - 1; activeaction = active[j--];) {
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
            else if (action.hasOwnProperty(funcname)) {
              var func = action[funcname];
              func.apply(action, args);
            }
          }
        };

        return that;
      };
    };
  });
  
}(this, jQuery));