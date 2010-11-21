// defenses.js
//
// All the things the player can use to defend against enemies.

(function(global, $) {
  
  loki.define('assets', 'mob', 'tileutils', function(env) {
    var tilesize = env.tilesize,
      totilepos = env.totilepos,
      mob = env.mob,
      imagemanager = env.imagemanager,
      BARRELOFFSETX = 9,
      BARRELOFFSETY = 8;

    // sentry gun images
    imagemanager.add('sentrygundefense', 'assets/images/sentrygundefense.png');
    imagemanager.add('sentrygunbarrel', 'assets/images/sentrygunbarrel.png');

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
            ctx.lineWidth = 2;
            ctx.strokeStyle = 'hsl(120, 100%, 100%)';
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
        that.aimvelocity = {
          x: 1,
          y: 0
        };
      
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
          var b = env.bullet({
            game: args.game,
            x: that.x + BARRELOFFSETX,
            y: that.y + BARRELOFFSETY,
            vel: {
              x: that.aimvelocity.x * 5,
              y: that.aimvelocity.y * 5
            }
          });
          args.game.add(b);
        }.ratelimit(350);
      
        that.tick = function() {
          mob.gravitytick.call(that);
          // update the ai
          that.ai();
          // if we have a target, update the aimvelocity
          if (that.target) {
            that.aimvelocity = env.aim({
              x: that.x,
              y: that.y
            }, {
              x: that.target.x,
              y: that.target.y
            });
          }
          // if we have a target, fire at it
          that.fire();
        }
      
        that.draw = function(drawthing) {
          drawthing.sprite1.push(function(ctx) {
            imagemanager.draw(ctx, 'sentrygundefense', that.x, that.y);
          }); // sprite1
          drawthing.sprite2.push(function(ctx) {
            // save the context
            ctx.save();
            // translate the context so rotations will originate at the right place in the barrel
            ctx.translate(that.x + 8, that.y + 8);
            // change where we're aiming into a radian
            var a = Math.atan(that.aimvelocity.y / that.aimvelocity.x);
            ctx.rotate(a);
            imagemanager.draw(ctx, 'sentrygunbarrel', -8, -8);
            // restore the context
            ctx.restore();            
          }); // sprite2
        };
      
        return that;
      }; // sentrygun
    };
  })
  
})(this, jQuery)