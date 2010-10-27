// enemies.js
//
// All the things that want to kill the player.
//
// Depend: mob.js

(function(global, $) {
  
  var zombie = function(args) {
    var that = mob(args);
    
    return that;
  }
  
  global.zombie = zombie;
  
})(window, jQuery);