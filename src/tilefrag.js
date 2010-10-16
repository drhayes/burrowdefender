// tilefrag.js
//
// A small piece of tile that appears when the player digs. Disappears after a
// few seconds.
//
// Depends: mob.js

(function(global, $) {
  
  var TileFrag = function(game) {
    var me = this;
    this.game = game;
    this.created = new Date().getTime();
    this.size = {
      x: 5,
      y: 5
    };
    this.vel = {
      x: Math.round(Math.random() * 4) - 2,
      y: 1
    };
    
    this.tick = function() {
      // under the effect of gravity
      Mob.gravitytick.call(this);
      // disappears after a few seconds
      var current = new Date().getTime();
      if (current - this.created > 10000) {
        this.game.remove(this);
      }
    };
    
    this.draw = function(drawthing) {
      drawthing.sprite2.push(function(ctx) {
        ctx.fillStyle('rgb(192, 192, 192)');
        ctx.fillRect(me.x, me.y, me.size.x, me.size.y);
      });
    };
    
  };
  TileFrag.prototype = new Mob();
  
  global.TileFrag = TileFrag;
  
})(window, jQuery);