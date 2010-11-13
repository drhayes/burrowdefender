// mob.js
//
// Movable things that can collide with other things. Entities have a position
// in world space and a velocity. Entities do not handle their own collision
// detection.

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
    },
    friction: 1,
    bounce: 0
  };
  
  loki.define('utils', function(env) {
    var collide = env.collide;
    
    loki.modules.mob = function(env) {
      env.mob = function(args) {
        var that = {};
        args = $.extend({}, defaults, args);
        that.x = args.x;
        that.y = args.y;
        that.size = {
          x: args.size.x,
          y: args.size.y
        };
        that.vel = {
          x: args.vel.x,
          y: args.vel.y
        };
        that.friction = args.friction;
        that.bounce = args.bounce;
        that.movestate = {
          // jumping is defined as having jumped but not having become standing yet
          jumping: args.movestate.jumping,
          // standing is having 0 effective y velocity
          standing: args.movestate.standing
        };
        that.velocities = {
          jump: args.velocities.jump,
          walkleft: args.velocities.walkleft,
          walkright: args.velocities.walkright
        };

        that.updaterect = function() {
          that.x1 = that.x;
          that.y1 = that.y;
          that.x2 = that.x + that.size.x;
          that.y2 = that.y + that.size.y;
          that.halfwidth = (that.x2 - that.x1) / 2;
          that.halfheight = (that.y2 - that.y1) / 2;
          that.halfx = that.halfwidth + that.x1;
          that.halfy = that.halfheight + that.y1;
        };

        that.move = function(collides) {
          // remove from the spatial hash
          args.game.spatialhash.remove(that);
          // if velocity is tiny, make it zero
          if (Math.abs(that.vel.x) < 0.1) {
            that.vel.x = 0;
          };
          if (Math.abs(that.vel.y) < 0.1) {
            that.vel.y = 0;
          }
          // adjust for velocity
          that.x += that.vel.x;
          that.y += that.vel.y;
          that.updaterect();
          collides = collides || [];
          that.movestate.standing = false;
          // check for bounce and friction afterwards
          var aftervel = {
            x: 0,
            y: 0
          };
          $.each(collides, function(i, r) {
            // am I colliding with myself?
            if (r === that) {
              return;
            };
            // are we actually colliding?
            if (!collide(that, r)) {
              return;
            };
            // does what we're colliding with have a collide function?
            var stop = false;
            if (typeof r.collide === 'function') {
              stop |= r.collide(that);
            };
            // other way around, too...
            if (typeof that.collide === 'function') {
              stop |= that.collide(r);
            };
            // if any of those collide methods returned false, stop the colliding
            if (stop) {
              return false;
            }
            // is this thing solid?
            if (typeof r.solid !== 'undefined' && !r.solid) {
              return
            };
            // do projection-based collision detection
            var dx = that.halfx - r.halfx;
            var dy = that.halfy - r.halfy;
            // combine 'em
            var tx = that.halfwidth + r.halfwidth - Math.abs(dx) + 1;
            var ty = that.halfheight + r.halfheight - Math.abs(dy) + 1;
            // get the vectors off the sign of the projection scalar...
            var vx = -dx / Math.abs(dx);
            var vy = -dy / Math.abs(dy);
            tx = Math.abs(tx);
            ty = Math.abs(ty);
            // the shorter one is the one we adjust by...
            if (tx < ty) {
              that.x -= tx * vx;
              aftervel.x = -that.vel.x * that.bounce;
            }
            else {
              that.y -= ty * vy;
              aftervel.y = -that.vel.y * that.bounce;
              // are we standing or jumping anymore?
              that.movestate.standing = (vy > 0);
              that.movestate.jumping = (vy <= 0);
            }
            that.updaterect();
          });
          if (Math.abs(aftervel.y) > 1) {
            that.vel.y = aftervel.y;
            this.movestate.standing = false;
          }
          if (Math.abs(aftervel.x) > 1) {
            that.vel.x = aftervel.x;
          }
          args.game.spatialhash.set(that);
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
      }; // mob
      
      // meant to be bound to a mob's tick function, or .call-ed from within it
      env.mob.gravitytick = function() {
        if (this.movestate.standing) {
          this.vel.y = 1;
          return;
        }
    		if (this.vel.y < MAX_OF_GRAVITY) {
    			this.vel.y += FORCE_OF_GRAVITY;
    		}
      };
    }
  })

})(this, jQuery)