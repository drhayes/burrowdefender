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
      x: 2,
      y: 2
    };
    
    that.draw = function(drawthing) {
      drawthing.sprite1.push(function(ctx) {
        ctx.fillStyle('hsl(120, 100%, 100%)');
        ctx.fillRect(that.x, that.y, 2, 2);
      });
    }
    
    return that;
  }
  
  defenses.sentrygun = function(args) {
    var that = mob(args);
    
    return that;
  }
  
  global.defenses = defenses;
  
})(this, jQuery)