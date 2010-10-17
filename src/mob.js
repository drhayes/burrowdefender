// mob.js
//
// Movable things that can collide with other things. Entities have a position
// in world space and a velocity. Entities do not handle their own collision
// detection.
//
// Depends: utils.js

(function(global, $) {
  
  var FORCE_OF_GRAVITY = 0.25;
  var MAX_OF_GRAVITY = 12;

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
    },
    movestate: {
      jumping: false,
      standing: false
    },
    velocities: {
      jump: -6,
      walkleft: -2,
      walkright: 2
    }
  };

  var mob = function(options) {
    var that = {};
    options = $.extend({}, defaults, options);
    that.x = options.x;
    that.y = options.y;
    that.size = {
      x: options.size.x,
      y: options.size.y
    };
    that.vel = {
      x: options.vel.x,
      y: options.vel.y
    };
    that.movestate = {
      // jumping is defined as having jumped but not having become standing yet
      jumping: options.movestate.jumping,
      // standing is having 0 effective y velocity
      standing: options.movestate.standing
    };
    that.velocities = {
      jump: options.velocities.jump,
      walkleft: options.velocities.walkleft,
      walkright: options.velocities.walkright
    }
    
    that.updaterect = function() {
      that.x1 = that.x;
      that.y1 = that.y;
      that.x2 = that.x + that.size.x;
      that.y2 = that.y + that.size.y;
    }
    
    // Given a list of rects, don't let the mob move into any of them.
    that.move = function(collides) {
      collides = collides || [];
      var mob = this;
      var velx = that.vel.x;
      var vely = that.vel.y;
      // sort the collides so any that current intersecting come first
      var firstcollides = [];
      var secondcollides = [];
      $.each(collides, function(i, r) {
        if (r === that) {
          return;
        }
        var oiy = utils.intersect(mob.y, mob.y + mob.size.y, r.y1, r.y2);
        var oix = utils.intersect(mob.x, mob.x + mob.size.x, r.x1, r.x2);
        if (oiy || oix) {
          firstcollides.push(r);
        }
        else {
          secondcollides.push(r);
        }
      });
      var newcollides = [].concat(firstcollides, secondcollides);
      $.each(newcollides, function(i, r) {
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
        // does what we're colliding with have a collide function?
        if (typeof(r.collide) === 'function') {
          r.collide(that);
        }
        if (typeof(r.solid) !== 'undefined' && !r.solid) {
          return;
        }
        // check our old intersections to prevent teleporting
        var oiy = utils.intersect(mob.y, mob.y + mob.size.y, r.y1, r.y2);
        if (!oiy) {
          if (vely < 0) {
            vely += r.y2 - npy1 + 1;
          }
          else if (vely > 0) {
            vely -= npy2 - r.y1 + 1;
            if (Math.abs(vely) < 0.01) {
              mob.movestate.jumping = false;
              mob.movestate.standing = true;
            }
          }          
        }
        var oix = utils.intersect(mob.x, mob.x + mob.size.x, r.x1, r.x2)
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
      if (Math.abs(vely) < 0.01) {
        vely = 0;
      }
      if (Math.abs(velx) < 0.01) {
        velx = 0;
      }
      if (vely !== 0) {
        that.movestate.standing = false;
      }
      that.x += velx;
      that.y += vely;
      that.updaterect();
    };
    
    that.tick = function() {
    };
    
    that.jump = function() {
      if (that.movestate.jumping || !that.movestate.standing) {
        return;
      }
      that.vel.y = that.velocities.jump;
      that.movestate.jumping = true;
      that.movestate.standing = false;
    };
    
    return that;
  };
  
  // meant to be bound to a mob's tick function, or .call-ed from within it
  mob.gravitytick = function() {
    if (this.movestate.standing) {
      this.vel.y = 1;
      return;
    }
		if (this.vel.y < MAX_OF_GRAVITY) {
			this.vel.y += FORCE_OF_GRAVITY;
		}
  };
  
  global.mob = mob;

})(window, jQuery)