// mob.js
//
// Movable things that can collide with other things. Entities have a position
// in world space and a velocity. Entities do not handle their own collision
// detection.
//
// Depends: utils.js

(function(global, $) {
  
  var FORCE_OF_GRAVITY = 0.1;
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
      jump: -3
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
    this.movestate = {
      // jumping is defined as having jumped but not having become standing yet
      jumping: options.movestate.jumping,
      // standing is having 0 effective y velocity
      standing: options.movestate.standing
    };
    this.velocities = {
      jump: options.velocities.jump
    }
    
    this.updaterect = function() {
      this.x1 = this.x;
      this.y1 = this.y;
      this.x2 = this.x + this.size.x;
      this.y2 = this.y + this.size.y;
    }
    
    // Given a list of rects, don't let the mob move into any of them.
    this.move = function(collides) {
      collides = collides || [];
      var mob = this;
      var velx = this.vel.x;
      var vely = this.vel.y;
      // sort the collides so any that current intersecting come first
      var firstcollides = [];
      var secondcollides = [];
      $.each(collides, function(i, r) {
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
        // check our old intersections to prevent teleporting
        var oiy = utils.intersect(mob.y, mob.y + mob.size.y, r.y1, r.y2);
        if (!oiy) {
          if (vely < 0) {
            vely += r.y2 - npy1 + 1;
          }
          else if (vely > 0) {
            vely -= npy2 - r.y1 + 1;
            if (Math.abs(vely) < 0.1) {
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
      if (Math.abs(vely) < 0.1) {
        vely = 0;
      }
      if (Math.abs(velx) < 0.1) {
        velx = 0;
      }
      if (vely !== 0) {
        this.movestate.standing = false;
      }
      this.x += velx;
      this.y += vely;
      this.updaterect();
    };
    
    this.tick = function() {
    };
    
    this.jump = function() {
      if (this.movestate.jumping || !this.movestate.standing) {
        return;
      }
      this.vel.y = this.velocities.jump;
      this.movestate.jumping = true;
      this.movestate.standing = false;
    };
  };
  
  // meant to be bound to a mob's tick function, or .call-ed from within it
  Mob.gravitytick = function() {
    if (this.movestate.standing) {
      this.vel.y = 1;
      return;
    }
		if (this.vel.y < MAX_OF_GRAVITY) {
			this.vel.y += FORCE_OF_GRAVITY;
		}
  };
  
  global.Mob = Mob;

})(window, jQuery)