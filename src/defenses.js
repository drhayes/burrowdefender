// defenses.js
//
// All the things the player can use to defend against enemies.
//
// Depends: mob.js

(function(global, $) {
  
  var defenses = {};
  
  defenses.sentrygun = function(args) {
    var that = mob(args);
    
    return that;
  }
  
  global.defenses = defenses;
  
})(this, jQuery)