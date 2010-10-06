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
    
    this.getrect = function() {
      return {
        x1: this.x,
        y1: this.y,
        x2: this.x + this.size.x,
        y2: this.y + this.size.y
      };
    }
    
    // Given a list of rects, don't let the mob move into any of them.
    this.move = function(collides) {
      collides = collides || [];
      var mob = this;
      var velx = this.vel.x;
      var vely = this.vel.y;
      $.each(collides, function(i, r) {
        // collide at all?
        var npx1 = mob.x + velx;
        var npy1 = mob.y + vely;
        var npx2 = mob.x + mob.size.x + velx;
        var npy2 = mob.y + mob.size.y + vely;
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
        var oix = utils.intersect(mob.x, mob.x + mob.size.x, r.x1, r.x2)
        var oiy = utils.intersect(mob.y, mob.y + mob.size.y, r.y1, r.y2);
        if (!oiy) {
          if (vely < 0) {
            vely += r.y2 - npy1 + 1;
          }
          else if (vely > 0) {
            vely -= npy2 - r.y1 + 1;
          }          
        }
        // since we're maybe not conflicting on y anymore, check again
        npy1 = mob.y + vely;
        npy2 = mob.y + mob.size.y + vely;
        oiy = utils.intersect(npy1, npy2, r.y1, r.y2);
        if (oiy && !oix) {
          if (velx < 0) {
            velx += r.x2 - npx1 + 1;
          }
          else if (velx > 0) {
            velx -= npx2 - r.x1 + 1;
          }          
        }
      });
      this.x += velx;
      this.y += vely;
    };
  };
  
  global.Mob = Mob;

})(window, jQuery)