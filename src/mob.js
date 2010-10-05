// mob.js
//
// Movable things that can collide with other things. Entities have a position
// in world space and a velocity. Entities do not handle their own collision
// detection.
//
// Depends: utils.js

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
    
    // Given a list of rects, don't let the mob move into any of them.
    this.move = function(collides) {
      collides = collides || [];
      var mob = this;
      $.each(collides, function(i, r) {
        // collide at all?
        var npx1 = mob.x + mob.vel.x;
        var npy1 = mob.y + mob.vel.y;
        var npx2 = mob.x + mob.size.x + mob.vel.x;
        var npy2 = mob.y + mob.size.y + mob.vel.y;
        if (npy2 < r.y1) {
          return;
        }
        if (npy1 > r.y2) {
          return;
        }
        if (npx2 < r.x1) {
          return;
        }
        if (npx1 > r.x2) {
          return;
        }
        // okay, we're doing this
        // check our old intersections to prevent teleporting
        var oyx = utils.intersect(mob.x, mob.x + mob.size.x, r.x1, r.x2)
        var oyi = utils.intersect(mob.y, mob.y + mob.size.y, r.y1, r.y2);
        if (!oyi) {
          if (mob.vel.y < 0) {
            mob.vel.y += r.y2 - npy1 + 1;
          }
          else if (mob.vel.y > 0) {
            mob.vel.y -= npy2 - r.y1 + 1;
          }          
        }
        if (!oyx) {
          if (mob.vel.x < 0) {
            mob.vel.x += r.x2 - npx1 + 1;
          }
          else if (mob.vel.x > 0) {
            mob.vel.x -= npx2 - r.x1 + 1;
          }          
        }
      });
      this.x += this.vel.x;
      this.y += this.vel.y;
    };
  };
  
  global.Mob = Mob;

})(window, jQuery)