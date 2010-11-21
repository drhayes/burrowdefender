// defenses.js
//
// All the things the player can use to defend against enemies.

(function(global, $) {
  
  loki.define('mob', 'tileutils', function(env) {
    var tilesize = env.tilesize,
      totilepos = env.totilepos,
      mob = env.mob;
      
    loki.modules.defenses = function(env) {
      env.bullet = function(args) {
        args.size = {
          x: 4,
          y: 4
        };
        var that = mob(args),
          oldx, oldy;

        // bullets are not solid
        that.solid = false;

        // used to kill the bullet after it has lived too long
        that.created = new Date().getTime();

        that.draw = function(drawthing) {
          drawthing.sprite1.push(function(ctx) {
            ctx.lineWidth(2);
            ctx.strokeStyle('hsl(120, 100%, 100%)');
            ctx.beginPath();
            ctx.moveTo(oldx, oldy);
            ctx.lineTo(that.x, that.y);
            ctx.stroke();
          });
        };

        that.collide = function(collider) {
          if (typeof collider.damage !== 'function') {
            return;
          }
          collider.damage(7, that.vel.x > 0);
          // remove the bullet from the game... its dread business is done
          that.killed = true;
          // stop colliding with things, its killed enough
          return true;
        };

        // kill the bullet after a second or so
        that.tick = function() {
          oldx = that.x;
          oldy = that.y;
          var current = new Date().getTime();
          if (current - that.created > 1500) {
            that.killed = true;
          }
        };

        return that;
      }; // bullet

      // returns velocity object pointing from mypos to targetpos. resultant vector
      // is a unit vector.
      env.aim = function(mypos, targetpos) {
        var deltax = targetpos.x - mypos.x;
        var deltay = targetpos.y - mypos.y;
        // normalize
        var l = Math.sqrt(deltax * deltax + deltay * deltay);
        return {
          x: deltax / l,
          y: deltay / l
        };
      };
      
      env.sentrygun = function(args) {
        var that = mob(args);
        that.solid = false;
        that.bounce = 0.4;
        that.target = null;
      
        that.ai = function() {
          // find an enemy to target
          var nearby = args.game.spatialhash.get({
            x1: that.x - tilesize * 8,
            y1: that.y - tilesize * 2,
            x2: that.x + tilesize * 9,
            y2: that.y + tilesize * 3,
          });
          that.target = null;
          for (var i = 0; i < nearby.length; i++) {
            var thing = nearby[i];
            if (thing.enemy) {
              that.target = thing;
              break;
            }
          }
        }.ratelimit(500);
      
        that.fire = function() {
          if (!that.target) {
            return;
          };
          // create bullet
          var aimvelocity = env.aim({
            x: that.x,
            y: that.y
          }, {
            x: that.target.x,
            y: that.target.y
          });
          var b = env.bullet({
            game: args.game,
            x: that.x,
            y: that.y,
            vel: {
              x: aimvelocity.x * 5,
              y: aimvelocity.y * 5
            }
          });
          args.game.add(b);
        }.ratelimit(350);
      
        that.tick = function() {
          mob.gravitytick.call(that);
          // update the ai
          that.ai();
          // if we have a target, fire at it
          that.fire();
        }
      
        that.draw = function(drawthing) {
          drawthing.sprite1.push(function(ctx) {
            ctx.strokeStyle('hsl(120, 0%, 30%)');
            ctx.lineWidth(5);
            ctx.strokeRect(that.x, that.y, that.size.x, that.size.y);
          })
        };
      
        return that;
      }; // sentrygun
    };
  })
  
})(this, jQuery)