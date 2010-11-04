// tilefrag.js
//
// A small piece of tile that appears when the player digs. Disappears after a
// few seconds.
//
// Depends: mob.js

(function(global, $) {
  
  var tilefrag = function(args) {
    var that = mob(args);
    that.created = new Date().getTime();
    that.size = {
      x: 5,
      y: 5
    };
    that.vel = {
      x: Math.round(Math.random() * 4) - 2,
      y: -1
    };
    
    that.tick = function() {
      // under the effect of gravity
      mob.gravitytick.call(this);
      // disappears after a few seconds
      var current = new Date().getTime();
      if (current - that.created > 3000) {
        that.killed = true;
      }
    };
    
    that.draw = function(drawthing) {
      drawthing.sprite2.push(function(ctx) {
        ctx.fillStyle('rgb(192, 192, 192)');
        ctx.fillRect(that.x, that.y, that.size.x, that.size.y);
      });
    };
    
    return that;
  };
  
  global.tilefrag = tilefrag;
  
})(this, jQuery);