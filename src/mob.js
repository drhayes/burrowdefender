// mob.js
//
// Movable things that can collide with other things. Entities have a position
// in world space and a velocity. Entities do not handle their own collision
// detection.

(function(global, $) {

  var defaults = {
    x: 0,
    y: 0,
    size: {
      x: 16,
      y: 16
    },
    vel: {
      x: 0,
      y: 0
    }
  };

  var Mob = function(options) {
    options = $.extend({}, defaults, options);
    this.x = options.x;
    this.y = options.y;
    this.size = {
      x: options.size.x,
      y: options.size.y
    };
    this.vel = {
      x: options.vel.x,
      y: options.vel.y
    };
    
    this.newposition = function() {
      
    };
  };
  
  global.Mob = Mob;

})(window, jQuery)