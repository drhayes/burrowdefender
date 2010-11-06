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
    
    // zombies are damageable
    utils.damageable(that, {
      health: 20,
      whendamaged: function() {
        that.movestate.standing = false;
      }
    });
    
    // custom movestates
    that.movestate.wantstodig = false;
    
    that.draw = function(drawthing) {
      drawthing.sprite1.push(function(ctx) {
        ctx.fillStyle('hsl(95, 35%, 33%)');
        ctx.fillRect(that.x, that.y, that.size.x + 1, that.size.y + 1);
      });
    };
    
    var canpassthrough = function(x, y) {
      var tile = args.game.tilemap.get(x, y);
      if (tile) {
        return !tile.solid;
      };
      return true;
    }
    
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
			// have I been killed?
			if (that.health <= 0) {
			  that.killed = true;
			}
			// if no forward progress was made, jump or dig
	    that.movestate.wantstodigx = false;
			var tilepos = tile.totilepos(that.x, that.y);
			var tiledeltax = that.vel.x < 1 ? -1 : 1;
			tilepos.x += tiledeltax;
			var forwardprogress = typeof that.lastx === 'undefined' || that.x !== that.lastx;
			if (!forwardprogress) {
			  // can we jump?
			  var passthrough1 = canpassthrough(tilepos.x, tilepos.y - 1);
			  var passthrough2 = canpassthrough(tilepos.x, tilepos.y - 2);
			  if (!passthrough1 && !passthrough2) {
			    that.movestate.wantstodigx = true;
			  }
			  else {
			    that.jump();
			  }
			}
			that.lastx = that.x;
    };
    
    that.collide = function(collider) {
      if (typeof collider.damage !== 'function') {
        return;
      }
      if (that.movestate.wantstodigx) {
        collider.damage(1);
      }
      if (collider.delicious) {
        collider.damage(1, that.vel.x > 0);
      }
    }
    
    return that;
  }
  
  global.zombie = zombie;
  
})(this, jQuery);