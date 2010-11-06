// defenses.js
//
// All the things the player can use to defend against enemies.
//
// Depends: mob.js, utils.js

(function(global, $) {
  
  var defenses = {};
  
  defenses.bullet = function(args) {
    var that = mob(args);
    that.size = {
      x: 4,
      y: 4
    };
    
    // bullets are not solid
    that.solid = false;
    
    // used to kill the bullet after it has lived too long
    that.created = new Date().getTime();
    
    that.draw = function(drawthing) {
      drawthing.sprite1.push(function(ctx) {
        ctx.fillStyle('hsl(120, 100%, 100%)');
        ctx.fillRect(that.x, that.y, 4, 4);
      });
    };
    
    that.collide = function(collider) {
      if (typeof collider.damage !== 'function') {
        return;
      }
      collider.damage(7, that.vel.x > 0);
      // remove the bullet from the game... its dread business is done
      that.killed = true;
    };
    
    // kill the bullet after a second or so
    that.tick = function() {
      var current = new Date().getTime();
      if (current - that.created > 1500) {
        that.killed = true;
      }
    };
    
    return that;
  }
  
  // returns velocity object pointing from mypos to targetpos. resultant vector
  // is a unit vector.
  defenses.aim = function(mypos, targetpos) {
    var deltax = targetpos.x - mypos.x;
    var deltay = targetpos.y - mypos.y;
    // normalize
    var l = Math.sqrt(deltax * deltax + deltay * deltay);
    return {
      x: deltax / l,
      y: deltay / l
    };
  };
  
  defenses.sentrygun = function(args) {
    var that = mob(args);
    that.solid = false;
    that.bounce = 0.4;
    that.target = null;
    
    that.ai = function() {
      // find an enemy to target
      var nearby = args.game.spatialhash.get({
        x1: that.x - tile.tilesize * 8,
        y1: that.y - tile.tilesize * 2,
        x2: that.x + tile.tilesize * 9,
        y2: that.y + tile.tilesize * 3,
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
      var aimvelocity = defenses.aim({
        x: that.x,
        y: that.y
      }, {
        x: that.target.x,
        y: that.target.y
      });
      var b = defenses.bullet({
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
  }
  
  global.defenses = defenses;
  
})(this, jQuery)