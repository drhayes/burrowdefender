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
    
    // Given the velocity of the mob, this function returns a rectangle of the
    // mob's new position given as {x1,y1,x2,y2}.
    this.newposition = function() {
      return {
        x1: this.x + this.vel.x,
        y1: this.y + this.vel.y,
        x2: this.x + this.size.x + this.vel.x,
        y2: this.y + this.size.y + this.vel.y
      };
    };
    
    // Given a list of rects, don't let the mob move into any of them.
    this.move = function(collides) {
      collides = collides || [];
      var newpos = this.newposition();
      var mob = this;
      $.each(collides, function(i, r) {
        // collide at all?
        if (newpos.y2 < r.y1) {
          return;
        }
        if (newpos.y1 > r.y2) {
          return;
        }
        if (newpos.x2 < r.x1) {
          return;
        }
        if (newpos.x1 > r.x2) {
          return;
        }
        if (mob.vel.y < 0) {
          mob.vel.y += r.y2 - newpos.y1;
        }
        else if (mob.vel.y > 0) {
          mob.vel.y -= newpos.y2 - r.y1;
        }
        if (mob.vel.x < 0) {
        }
        newpos = mob.newposition();
      });
      this.x += this.vel.x;
      this.y += this.vel.y;
    };
  };
  
  global.Mob = Mob;

})(window, jQuery)