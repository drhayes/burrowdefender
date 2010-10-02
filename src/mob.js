// mob.js
//
// Movable things that can collide with other things. Entities have a position
// in world space and a velocity. Entities do not handle their own collision
// detection.

(function(global, $) {

  var Mob = function() {
    this.x = 0;
    this.y = 0;
    this.size = {
      x: 16,
      y: 16
    };
    this.vel = {
      x: 0,
      y: 0
    };
  };
  
  global.Mob = Mob;

})(window, jQuery)