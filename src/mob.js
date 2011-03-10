(function() {
  var FORCE_OF_GRAVITY, MAX_OF_GRAVITY, defaults;
  FORCE_OF_GRAVITY = 0.25;
  MAX_OF_GRAVITY = 12;
  defaults = {
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
    var collide;
    collide = env.collide;
    return loki.modules.mob = function(env) {
      env.mob = function(args) {
        var that;
        that = _.extend({}, defaults, args);
        delete that.game;
        that.updaterect = function() {
          that.x1 = that.x;
          that.y1 = that.y;
          that.x2 = that.x + that.size.x;
          that.y2 = that.y + that.size.y;
          that.halfwidth = (that.x2 - that.x1) / 2;
          that.halfheight = (that.y2 - that.y1) / 2;
          that.halfx = that.halfwidth + that.x1;
          return that.halfy = that.halfheight + that.y1;
        };
        that.move = function(collides) {
          var aftervel;
          if (collides == null) {
            collides = [];
          }
          args.game.spatialhash.remove(that);
          if (Math.abs(that.vel.x) < 0.1) {
            that.vel.x = 0;
          }
          if (Math.abs(that.vel.y) < 0.1) {
            that.vel.y = 0;
          }
          that.x += that.vel.x;
          that.y += that.vel.y;
          that.updaterect();
          that.movestate.standing = false;
          aftervel = {
            x: 0,
            y: 0
          };
          _.each(collides, function(r) {
            var dx, dy, stop, tx, ty, vx, vy;
            if (r === that) {
              return;
            }
            if (!collide(that, r)) {
              return;
            }
            stop = false;
            if (typeof r.collide === 'function') {
              stop |= r.collide(that);
            }
            if (typeof that.collide === 'funcion') {
              stop |= that.collide(r);
            }
            if (stop) {
              return false;
            }
            if ((r.solid != null) && !r.solid) {
              return;
            }
            dx = that.halfx - r.halfx;
            dy = that.halfy - r.halfy;
            tx = Math.abs(that.halfwidth + r.halfwidth - Math.abs(dx) + 1);
            ty = Math.abs(that.halfheight + r.halfheight - Math.abs(dy) + 1);
            vx = -dx / Math.abs(dx);
            vy = -dy / Math.abs(dy);
            if (tx < ty) {
              that.x -= tx * vx;
              aftervel.x = -that.vel.x * that.bounce;
            } else {
              that.y -= ty * vy;
              aftervel.y = -that.vel.y * that.bounce;
              that.movestate.standing = vy > 0;
              that.movestate.jumping = vy <= 0;
            }
            return that.updaterect();
          });
          if (Math.abs(aftervel.y) > 1) {
            that.vel.y = aftervel.y;
            that.movestate.standing = false;
          }
          if (Math.abs(aftervel.x) > 1) {
            that.vel.x = aftervel.x;
          }
          return args.game.spatialhash.set(that);
        };
        that.jump = function() {
          if (that.movestate.jumping || !that.movestate.standing) {
            return false;
          }
          that.vel.y = that.velocities.jump;
          that.movestate.jumping = true;
          return that.movestate.standing = false;
        };
        return that;
      };
      return env.mob.gravitytick = function() {
        if (this.movestate.standing) {
          this.vel.y = 1;
          return;
        }
        if (this.vel.y < MAX_OF_GRAVITY) {
          return this.vel.y += FORCE_OF_GRAVITY;
        }
      };
    };
  });
}).call(this);
