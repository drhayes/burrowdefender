// enemies.js
//
// All the things that want to kill the player.
//
// Depend: mob.js

(function(global, $) {
  
  var zombie = function(args) {
    // set the zombie defaults
    args.size = {
      x: 16,
      y: 20
    };
    var that = mob(args);
    
    // zombies are not solid
    that.solid = false;
    
    that.draw = function(drawthing) {
      drawthing.sprite1.push(function(ctx) {
        ctx.fillStyle('hsl(95, 35%, 33%)');
        ctx.fillRect(that.x, that.y, that.size.x + 1, that.size.y + 1);
      });
    };
    
    that.tick = function() {
  		// gravity has to have some effect here...
			mob.gravitytick.call(this);
			// track player along the x axis...
			if (args.game.player.x < that.x) {
			  that.vel.x = -1;
			}
			else if (args.game.player.x > that.x) {
			  that.vel.x = 1;
			};
			// if no forward progress was made, jump
			if (typeof that.lastx !== 'undefined' && that.x === that.lastx) {
			  that.jump();
			}
			that.lastx = that.x;
    };
    
    return that;
  }
  
  global.zombie = zombie;
  
})(window, jQuery);