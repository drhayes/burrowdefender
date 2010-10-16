// player.js
//
// The player. Y'know, of the game.
//
// Depends: Mob, KeyboardManager, Tile

(function(global, $) {
  
  var walking = {
    LEFT: -1,
    STANDING: 0,
    RIGHT: 1,
    DOWN: 2,
    UP: 3
  };
  
  var Player = function(game) {
    var me = this;
    
    this.game = game;
    
    // special player movestates
    this.movestate.mining = false;
    this.movestate.wantstojump = false;
    this.movestate.walking = walking.STANDING;
    
    // mining damage
    this.minedamage = 1;
    
    this.draw = function(drawthing) {
      drawthing.sprite1.push(function(ctx) {
        ctx.fillStyle('rgb(0, 0, 0)');
        // draw a little bigger than player size so player is standing on ground
        ctx.fillRect(me.x, me.y, me.size.x + 1, me.size.y + 1);        
      });
    };
    
    this.readkeyboard = function() {
      if (this.game.keyboardmanager.keymap['shift']) {
        this.movestate.mining = true;
      }
      else {
        this.movestate.mining = false;
      };
      if (this.game.keyboardmanager.keymap['space']) {
        this.movestate.wantstojump = true;
      }
      else {
        this.movestate.wantstojump = false;
      };
      // this order is probably pretty important.
      // don't want down to be the one that wins out.
      if (this.game.keyboardmanager.keymap['s']) {
        this.movestate.walking = walking.DOWN;
      }
      else if (this.game.keyboardmanager.keymap['a']) {
        this.movestate.walking = walking.LEFT;
      }
      else if (this.game.keyboardmanager.keymap['d']) {
        this.movestate.walking = walking.RIGHT;
      }
      else if (this.game.keyboardmanager.keymap['w']) {
        this.movestate.walking = walking.UP;
      }
      else {
        this.movestate.walking = walking.STANDING;
      }
    };
		
		this.mine = function() {
			if (this.movestate.mining) {
				// convert player's current position to tile
				// respect player's center of mass
				var tilepos = Tile.totilepos(this.x + this.size.x / 2, this.y + this.size.y / 2);
				if (this.movestate.walking === walking.LEFT) {
					tilepos.x -= 1;
				}
				else if (this.movestate.walking === walking.RIGHT) {
					tilepos.x += 1;
				}
				else if (this.movestate.walking === walking.UP) {
					tilepos.y -= 1;
				}
				else if (this.movestate.walking === walking.DOWN) {
					tilepos.y += 1;
				}
				// is it a diggable tile?
				var digtile = this.game.tilemap.get(tilepos.x, tilepos.y);
				digtile.mine(this, tilepos.x, tilepos.y);
			}
		};
		
		this.walk = function() {
			if (this.movestate.walking === walking.LEFT) {
				this.vel.x = -2;
			}
			else if (this.movestate.walking === walking.RIGHT) {
				this.vel.x = 2;
			}
			else {
				this.vel.x = 0;
			}
			if (this.movestate.wantstojump) {
				this.jump();
			}
		};

		// update the player every tick
		this.tick = function() {
		// gravity has to have some effect here...
			Mob.gravitytick.call(this);
			// read the state of the keyboard
			this.readkeyboard();
			// are we mining?
			this.mine();
			// walk somewhere
			this.walk();
		}
  };
  
  Player.prototype = new Mob({
		x: 0,
		y: 0,
		size: {
			x: 16,
			y: 20
		},
		vel: {
			x: 0,
			y: 0,
		}
	});
  Player.constructor = Player;
  
  global.Player = Player;
  
})(window, jQuery)