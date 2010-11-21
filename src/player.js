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
  
  var STOPFORCE = 0.2;
  
  // inventory constants
  var PADDING = 5;
  var CANVAS_WIDTH = 600;
  var CANVAS_HEIGHT = 500;
  var WIDTH = CANVAS_WIDTH - PADDING * 2;
  var HEIGHT = 50;
  var MAXITEMS = 8;
  
  loki.define('actions', 'assets', 'graphics', 'mob', 'tileutils', 'components', function(env) {
    var mob = env.mob,
      tilesize = env.tilesize,
      totilepos = env.totilepos,
      damageable = env.damageable,
      actionable = env.actionable,
      imagemanager = env.imagemanager,
      spritemanager = env.spritemanager,
      animation = env.animation,
      action = env.action;
    
    // add player images
    imagemanager.add('heartfull', 'assets/images/heartfull.png');
    imagemanager.add('heartempty', 'assets/images/heartempty.png');
    imagemanager.add('player', 'assets/images/player.png');
    
    // define player sprite
		spritemanager.add('player', {x: 16, y: 20}, [
		  {x: 0, y: 60}, // standing
			{x: 0, y: 39}, // running right
			{x: 17, y: 39},
			{x: 34, y: 39},
			{x: 51, y: 39},
			{x: 68, y: 39},
			{x: 0, y: 18}, // running left
			{x: 17, y: 18},
			{x: 34, y: 18},
			{x: 51, y: 18},
			{x: 68, y: 18},
			{x: 17, y: 60}, // falling right
			{x: 34, y: 60} // falling left
		]);

    // define player animations
    var standing = animation({
      name: 'player',
      frames: [0]
    });
    var runningleft = animation({
      name: 'player',
      frames: [6, 6, 7, 7, 8, 8, 9, 9, 10, 10]
    });
    var runningright = animation({
      name: 'player',
      frames: [1, 1, 2, 2, 3, 3, 4, 4, 5, 5]
    });
    var falling = animation({
      name: 'player',
      frames: [11]
    });
      
    loki.modules.player = function(env) {
      
      // maintains a 1-based map of things the player is carrying. this maps neatly
      // to the scheme of getting the player to press number keys to specify
      // a particular spot in the player's inventory.
      env.inventory = function(options) {
        var that = {};
        that.x1 = PADDING;
        that.y1 = CANVAS_HEIGHT - PADDING - HEIGHT;
        that.x2 = PADDING + WIDTH;
        that.y2 = CANVAS_HEIGHT - PADDING;
        that.things = {};
        that.sel = 1;

        that.add = function(thing) {
          // find the index for this thing
          var index = 1;
          var key = thing.type || thing.toString();
          for (var i = 1; i <= MAXITEMS; i++) {
            if (!that.things.hasOwnProperty(i) || that.things[i].key === key) {
              index = i;
              break;
            }
          }
          if (!that.things.hasOwnProperty(index)) {
            that.things[index] = {
              key: key,
              instance: thing,
              count: 0
            };
          };
          that.things[index].count += 1;
        };

        that.getsel = function() {
          var t = that.things[that.sel];
          if (!t || t.count === 0) {
            return null;
          }
          return t.instance;
        }

        that.dropsel = function() {
          var t = that.things[that.sel];
          if (typeof t === 'undefined') {
            return null;
          };
          t.count--;
          if (t.count === 0) {
            // if we're out at that slot, remove the counter object...
            delete that.things[that.sel];
          }
          return t.instance;
        }

        that.draw = function(drawthing) {
          drawthing.hud.push(function(ctx) {
            // draw the background
            ctx.fillStyle('hsla(120, 0%, 0%, 0.3)');
            ctx.fillRect(that.x1, that.y1, WIDTH, HEIGHT);
            // draw the itemrects...
            ctx.strokeStyle();
            ctx.lineWidth(2);
            ctx.fillStyle('hsla(120, 100%, 100%, 1.0)');
            ctx.font('15px Impact');
            var unselstyle = 'hsla(120, 10%, 50%, 0.6)';
            var selstyle = 'hsla(120, 80%, 50%, 0.6)';
            for (var i = 1; i <= 8; i++) {
              ctx.strokeStyle(i === that.sel ? selstyle : unselstyle);
              var r = that.itemrect(i);
              ctx.strokeRect(r.x1, r.y1, r.x2 - r.x1, r.y2 - r.y1);
              // now draw the icon, if we have one...
              if (that.things.hasOwnProperty(i)) {
                var oldoffset = ctx.offset;
                var invitem = that.things[i];
                var drawimage = invitem.instance.drawimage;
                ctx.offset = {
                  x: ctx.offset.x + r.x1 + (r.width / 2) - 8,
                  y: ctx.offset.y + r.y1 + (r.height / 2) - 16,
                }
                drawimage(ctx);
                // how many do we have? and center that text
                var countstr = '' + invitem.count;
                var textwidth = ctx.measureText(countstr);
                ctx.fillText(countstr, -(textwidth.width / 2) + 7, 32);
                ctx.offset = oldoffset;
              }
            }
          });
        };

        // for the ith item, return a rectangle of the space it occupies when
        // drawing it. items are currently 16x16 so this should be bigger...
        // this is 1-based, just like the inventory.
        that.itemrect = function(i) {
          i = i - 1;
          var peritemwidth = (WIDTH - PADDING * 2) / MAXITEMS;
          var startx = that.x1 + PADDING + peritemwidth * i;
          var rect = {
            x1: startx + PADDING,
            y1: that.y1 + PADDING,
            x2: startx + peritemwidth - PADDING,
            y2: that.y2 - PADDING,
          };
          rect.width = rect.x2 - rect.x1;
          rect.height = rect.y2 - rect.y1;
          return rect;
        };

        return that;
      }; // inventory
      
      // expects the following args:
      // * player - the player whose action this is
      // * keyboardmanager - the keyboardmanager to read commands from
      env.moveaction = function(args) {
        var that = action();
        return that;
      }; // moveaction
      
      env.player = function(args) {
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
        damageable(that, {
          health: 5,
          whendamaged: function(amt) {
      		  that.movestate.standing = false;
          }
        });
        that.delicious = true;
        
        // player is actionable
        actionable(that);
        // add default moveaction
        var moveaction = env.moveaction(that, args.game.keyboardmanager);
        that.addaction(moveaction);

        that.inventory = env.inventory();

        that.draw = function(drawthing) {
          drawthing.sprite1.push(function(ctx) {
            if (that.movestate.standing === false) {
              falling.draw(ctx, that.x, that.y);
            }
            else if (that.movestate.walking === walking.LEFT) {
              runningleft.draw(ctx, that.x, that.y);
            }
            else if (that.movestate.walking === walking.RIGHT) {
              runningright.draw(ctx, that.x, that.y);
            }
            else {
              standing.draw(ctx, that.x, that.y);
            }
          });
          drawthing.hud.push(function(ctx) {
            var startx = 10;
            var starty = 10;
            for (var i = 0; i < that.maxhealth; i++) {
              if (that.health <= i) {
                imagemanager.draw(ctx, 'heartempty', startx + (18 * i), starty);
              }
              else {
                imagemanager.draw(ctx, 'heartfull', startx + (18 * i), starty);
              }
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
    			var tilepos = totilepos(that.x + that.size.x / 2, that.y + that.size.y / 2);
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
    		  var result = i.place(tilepos.x * tilesize, tilepos.y * tilesize);
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
      }; // player
    };
  });
  
})(this, jQuery)