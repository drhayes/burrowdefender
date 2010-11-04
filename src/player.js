// player.js
//
// The player. Y'know, of the game.
//
// Depends: Mob, KeyboardManager, Tile, Inventory, utils.js

(function(global, $) {
  
  var walking = {
    LEFT: -1,
    STANDING: 0,
    RIGHT: 1,
    DOWN: 2,
    UP: 3
  };
  
  var heartfullimage = new Image();
  heartfullimage.src = 'assets/images/heartfull.png';
  var heartemptyimage = new Image();
  heartemptyimage.src = 'assets/images/heartempty.png';
  
  var STOPFORCE = 0.2;
  
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
    that.movestate.placing = false;
    
    // mining damage
    that.minedamage = 1;
    
    // health stuff
    utils.damageable(that, {
      health: 5,
      whendamaged: function(amt) {
  		  that.movestate.standing = false;
      }
    });
    that.delicious = true;
    
    that.inventory = inventory();
    
    that.draw = function(drawthing) {
      drawthing.sprite1.push(function(ctx) {
        ctx.fillStyle('hsl(0, 0%, 90%)');
        // draw a little bigger than player size so player is standing on ground
        ctx.fillRect(that.x, that.y, that.size.x + 1, that.size.y + 1);        
      });
      drawthing.hud.push(function(ctx) {
        var startx = 10;
        var starty = 10;
        for (var i = 0; i < that.maxhealth; i++) {
          var img = heartfullimage;
          if (that.health <= i) {
            img = heartemptyimage;
          }
          ctx.drawImage(img, startx + (18 * i), starty);
        }
      });
      that.inventory.draw(drawthing);
    };
    
    that.readkeyboard = function() {
      var keyman = args.game.keyboardmanager;
      if (keyman.keymap['shift']) {
        that.movestate.mining = true;
      }
      else {
        that.movestate.mining = false;
      };
      if (keyman.keymap['space']) {
        that.movestate.wantstojump = true;
      }
      else {
        that.movestate.wantstojump = false;
      };
      if (keyman.keymap['z']) {
        that.movestate.placing = true;
      }
      else {
        that.movestate.placing = false;
      }
      // this order is probably pretty important.
      // don't want down to be the one that wins out.
      if (keyman.keymap['s'] || keyman.keymap['down']) {
        that.movestate.walking = walking.DOWN;
      }
      else if (keyman.keymap['a'] || keyman.keymap['left']) {
        that.movestate.walking = walking.LEFT;
      }
      else if (keyman.keymap['d'] || keyman.keymap['right']) {
        that.movestate.walking = walking.RIGHT;
      }
      else if (keyman.keymap['w'] || keyman.keymap['up']) {
        that.movestate.walking = walking.UP;
      }
      else {
        that.movestate.walking = walking.STANDING;
      };
      // set the currently selected thing in inventory
      for (var i = 1; i <= 8; i++) {
        if (keyman.keymap['' + i]) {
          that.inventory.sel = i;
        }
      }
    };
    
    var tileposindirection = function() {
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
			return tilepos;
    }
		
		that.mine = function() {
			if (that.movestate.mining) {
				// convert player's current walking direction to tile
				var tilepos = tileposindirection();
				// is it a diggable tile?
				var digtile = args.game.tilemap.get(tilepos.x, tilepos.y);
				if (digtile && typeof digtile.damage === 'function') {
				  digtile.damage(that.minedamage);
				}
			}
		};
		
		that.walk = function() {
			if (that.movestate.walking === walking.LEFT && !that.movestate.placing) {
			  that.vel.x = that.velocities.walkleft;
			}
			else if (that.movestate.walking === walking.RIGHT && !that.movestate.placing) {
			  that.vel.x = that.velocities.walkright;
			}
			else {
			  if (that.vel.x < 0) {
			    that.vel.x = Math.min(0, that.vel.x + STOPFORCE);
			  }
			  else {
			    that.vel.x = Math.max(0, that.vel.x - STOPFORCE);
			  }
			}
			if (that.movestate.wantstojump) {
				that.jump();
			}
		};
		
		that.place = function() {
		  if (!that.movestate.placing || that.movestate.walking === walking.STANDING) {
		    return;
		  }
		  var i = that.inventory.getsel();
		  // do we have anything to drop?
		  if (i === null) {
		    return;
		  };
		  // we have something to drop... place it
			// convert player's current walking direction to tile
			var tilepos = tileposindirection();
		  var result = i.place(tilepos.x * tile.tilesize, tilepos.y * tile.tilesize);
		  // did it actually get placed?
		  if (!result) {
		    return;
		  }
		  that.inventory.dropsel();
		}

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
			// placing anything?
			that.place();
		};
		
		return that;
  };
    
  global.player = player;
  
})(this, jQuery)