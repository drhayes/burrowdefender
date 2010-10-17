// pickup.js
//
// Anything that can be picked up. Can only be picked up by things that have
// an inventory to be added to.
//
// Depends: mob.js

(function(global, $) {
  var Pickup = function() {
    
  };
  Pickup.prototype = new Mob();
  
  global.Pickup = Pickup;

})(window, jQuery)