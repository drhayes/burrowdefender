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
  var figures = new Image();
  figures.src = 'assets/images/figures.png';
  var figurer1 = new Image();
  figurer1.src = 'assets/images/figurer1.png';
  var figurer2 = new Image();
  figurer2.src = 'assets/images/figurer2.png';
  var figurer3 = new Image();
  figurer3.src = 'assets/images/figurer3.png';
  var figurer4 = new Image();
  figurer4.src = 'assets/images/figurer4.png';
  var figurer5 = new Image();
  figurer5.src = 'assets/images/figurer5.png';
  var figurel1 = new Image();
  figurel1.src = 'assets/images/figurel1.png';
  var figurel2 = new Image();
  figurel2.src = 'assets/images/figurel2.png';
  var figurel3 = new Image();
  figurel3.src = 'assets/images/figurel3.png';
  var figurel4 = new Image();
  figurel4.src = 'assets/images/figurel4.png';
  var figurel5 = new Image();
  figurel5.src = 'assets/images/figurel5.png';

  
  var animationframesr = [figurer1, figurer2, figurer3, figurer4, figurer5];
  var animationframesl = [figurel1, figurel2, figurel3, figurel4, figurel5];
  var currentframe = 0;
  
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
        var imgtodraw = figures;
        if (that.movestate.walking === walking.STANDING) {
          currentframe = 0;
        }
        else if (that.movestate.walking === walking.LEFT) {
          imgtodraw = animationframesl[Math.floor(currentframe / 3)];
          currentframe = (currentframe + 1) % 15;
        }
        else if (that.movestate.walking === walking.RIGHT) {
          imgtodraw = animationframesr[Math.floor(currentframe / 3)];
          currentframe = (currentframe + 1) % 15;
        };
        ctx.drawImage(imgtodraw, that.x, that.y + 1);
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