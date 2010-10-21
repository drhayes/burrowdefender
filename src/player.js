// player.js
//
// The player. Y'know, of the game.
//
// Depends: Mob, KeyboardManager, Tile, Inventory

(function(global, $) {
  
  var walking = {
    LEFT: -1,
    STANDING: 0,
    RIGHT: 1,
    DOWN: 2,
    UP: 3
  };
  
  var player = function(args) {
    // player derives from mob
    var that = mob(args);
    // set player defaults
    that.size = {
      x: 16,
      y: 20
    };
    that.solid = false;
    
    // special player movestates
    that.movestate.mining = false;
    that.movestate.wantstojump = false;
    that.movestate.walking = walking.STANDING;
    
    // mining damage
    that.minedamage = 1;
    
    that.inventory = inventory();
    
    that.draw = function(drawthing) {
      drawthing.sprite1.push(function(ctx) {
        ctx.fillStyle('hsl(0, 0%, 90%)');
        // draw a little bigger than player size so player is standing on ground
        ctx.fillRect(that.x, that.y, that.size.x + 1, that.size.y + 1);        
      });
      that.inventory.draw(drawthing);
    };
    
    that.readkeyboard = function() {
      if (args.game.keyboardmanager.keymap['shift']) {
        that.movestate.mining = true;
      }
      else {
        that.movestate.mining = false;
      };
      if (args.game.keyboardmanager.keymap['space']) {
        that.movestate.wantstojump = true;
      }
      else {
        that.movestate.wantstojump = false;
      };
      // this order is probably pretty important.
      // don't want down to be the one that wins out.
      if (args.game.keyboardmanager.keymap['s']) {
        that.movestate.walking = walking.DOWN;
      }
      else if (args.game.keyboardmanager.keymap['a']) {
        that.movestate.walking = walking.LEFT;
      }
      else if (args.game.keyboardmanager.keymap['d']) {
        that.movestate.walking = walking.RIGHT;
      }
      else if (args.game.keyboardmanager.keymap['w']) {
        that.movestate.walking = walking.UP;
      }
      else {
        that.movestate.walking = walking.STANDING;
      }
    };
		
		that.mine = function() {
			if (that.movestate.mining) {
				// convert player's current position to tile
				// respect player's center of mass
				var tilepos = tile.totilepos(that.x + that.size.x / 2, that.y + that.size.y / 2);
				if (that.movestate.walking === walking.LEFT) {
					tilepos.x -= 1;
				}
				else if (that.movestate.walking === walking.RIGHT) {
					tilepos.x += 1;
				}
				else if (that.movestate.walking === walking.UP) {
					tilepos.y -= 1;
				}
				else if (that.movestate.walking === walking.DOWN) {
					tilepos.y += 1;
				}
				// is it a diggable tile?
				var digtile = args.game.tilemap.get(tilepos.x, tilepos.y);
				if (digtile) {
				  digtile.mine(this, tilepos.x, tilepos.y);
				}
			}
		};
		
		that.walk = function() {
			if (that.movestate.walking === walking.LEFT) {
				that.vel.x = that.velocities.walkleft;
			}
			else if (that.movestate.walking === walking.RIGHT) {
				that.vel.x = that.velocities.walkright;
			}
			else {
				that.vel.x = 0;
			}
			if (that.movestate.wantstojump) {
				that.jump();
			}
		};

		// update the player every tick
		that.tick = function() {
		// gravity has to have some effect here...
			mob.gravitytick.call(this);
			// read the state of the keyboard
			that.readkeyboard();
			// are we mining?
			that.mine();
			// walk somewhere
			that.walk();
		};
		
		return that;
  };
    
  global.player = player;
  
})(window, jQuery)