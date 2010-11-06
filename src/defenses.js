// defenses.js
//
// All the things the player can use to defend against enemies.
//
// Depends: mob.js

(function(global, $) {
  
  var defenses = {};
  
  defenses.bullet = function(args) {
    var that = mob(args);
    that.size = {
      x: 4,
      y: 4
    };
    
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
      collider.damage(7);
      // remove the bullet from the game... its dread business is done
      that.killed = true;
    };
    
    // kill the bullet after a second or so
    that.tick = function() {
      var current = new Date().getTime();
      if (current - that.created > 1000) {
        that.killed = true;
      }
    };
    
    return that;
  }
  
  defenses.sentrygun = function(args) {
    var that = mob(args);
    
    return that;
  }
  
  global.defenses = defenses;
  
})(this, jQuery)