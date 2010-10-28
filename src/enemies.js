// enemies.js
//
// All the things that want to kill the player.
//
// Depend: mob.js, tile.js

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
    
    // custom movestates
    that.movestate.wantstodig = false;
    
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
			var madenoforwardprogress = (typeof that.lastx !== 'undefined' && that.x == that.lastx);
			// if no forward progress was made and player is above or on level, jump
			if (madenoforwardprogress && args.game.player.y <= that.y) {
			  that.jump();
			}
			// update our last x position for later jumpiness
			that.lastx = that.x;
			// if player is below us and we haven't changed y tile coordinates, dig
			var tilepos = tile.totilepos(that.x, that.y);
			that.movestate.wantstodig = false;
			if (madenoforwardprogress && 
			  args.game.player.y > that.y && typeof that.lasttiley !== 'undefined' && that.lasttiley === tilepos.y) {
			  that.movestate.wantstodig = true;
			}
			that.lasttiley = tilepos.y;
    };
    
    that.collide = function(collider) {
      if (typeof collider.health !== 'number') {
        return;
      }
      if (that.movestate.wantstodig) {
        collider.health -= 1;
      }
    }
    
    return that;
  }
  
  global.zombie = zombie;
  
})(window, jQuery);