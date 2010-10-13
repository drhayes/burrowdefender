// player.js
//
// The player. Y'know, of the game.
//
// Depends: Mob, KeyboardManager, Tile

(function(global, $) {
  
  var Player = function(game) {
    var me = this;
    
    this.game = game;
    
    // special player movestates
    this.movestate.mining = false;
    this.movestate.wantstojump = false;
    
    this.draw = function(drawthing) {
      drawthing.sprite1.push(function(ctx) {
        ctx.fillStyle = 'rgb(0, 0, 0)';
        // draw a little bigger than player size so player is standing on ground
        ctx.fillRect(game.playeroffset.x, game.playeroffset.y, me.size.x + 1, me.size.y + 1);        
      });
    };
    
    this.readkeyboard = function() {
      if (this.game.keyboardmanager.keymap['shift']) {
        this.movestate.mining = true;
      }
      else {
        this.movestate.mining = false;
      };
      if (this.game.keyboardmanager.keymap['w']) {
        this.movestate.wantstojump = true;
      }
      else {
        this.movestate.wantstojump = false;
      };
    };
    
		var lastmined = 0;

		// update the player every tick
		this.tick = function() {
		// gravity has to have some effect here...
			Mob.gravitytick.call(this);
			// are we mining?
			if (game.keyboardmanager.keymap['shift']) {
				// convert player's current position to tile
				// respect player's center of mass
				var tilepos = Tile.totilepos(this.x + this.size.x / 2, this.y + this.size.y / 2);
				if (game.keyboardmanager.keymap['a']) { // left
					tilepos.x -= 1;
				}
				else if (game.keyboardmanager.keymap['d']) { // right
					tilepos.x += 1;
				}
				else if (game.keyboardmanager.keymap['w']) { // up
					tilepos.y -= 1;
				}
				else if (game.keyboardmanager.keymap['s']) { // down
					tilepos.y += 1;
				}
				// is it a dirt tile?
				var digtile = game.tilemap.get(tilepos.x, tilepos.y);
				if (digtile === Tile.Dirt || digtile === Tile.DirtWithGrass) {
					var currenttime = new Date().getTime();
					if (currenttime - lastmined > 500) {
						game.tilemap.set(tilepos.x, tilepos.y, Tile.DirtDug);
						game.spatialhash.remove(TileMap.getrect(tilepos.x, tilepos.y));
						lastmined = new Date().getTime();
					}
				}
			}
			if (game.keyboardmanager.keymap['a']) {
				this.vel.x = -2;
			}
			else if (game.keyboardmanager.keymap['d']) {
				this.vel.x = 2;
			}
			else {
				this.vel.x = 0;
			}
			if (game.keyboardmanager.keymap['w']) {
				this.jump();
			}
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