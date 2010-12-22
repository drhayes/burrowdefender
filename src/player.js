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
		spritemanager.add('player', {x: 24, y: 32}, [
		  {x: 0, y: 298}, // standing
		  {x: 25, y: 298}, // blinking
		  {x: 50, y: 298},
		  {x: 75, y: 298},
		  {x: 100, y: 298},
		  {x: 125, y: 298}, // running left
		  {x: 150, y: 298},
		  {x: 175, y: 298},
		  {x: 200, y: 298},
		  {x: 225, y: 298},
		  {x: 0, y: 265},
		  {x: 25, y: 265},
		  {x: 50, y: 265},
		  {x: 75, y: 265},
		  {x: 100, y: 265},
		  {x: 125, y: 265},
		  {x: 150, y: 265}, // running right
		  {x: 175, y: 265},
		  {x: 200, y: 265},
		  {x: 225, y: 265},
		  {x: 0, y: 232},
		  {x: 25, y: 232},
		  {x: 50, y: 232},
		  {x: 75, y: 232},
		  {x: 100, y: 232},
		  {x: 125, y: 232},
		  {x: 150, y: 232},
		  {x: 175, y: 232}, // jumping
		  {x: 200, y: 232} // falling
		]);

    // define player animations
    var standing = animation({
      name: 'player',
      frames: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 2, 3, 4, 4, 3, 2, 1]
    });
    var runningleft = animation({
      name: 'player',
      frames: [5, 5, 6, 6, 7, 7, 8, 8, 9, 9, 10, 10, 11, 11, 12, 12, 13, 13, 14, 14, 15, 15]
    });
    var runningright = animation({
      name: 'player',
      frames: [16, 16, 17, 17, 18, 18, 19, 19, 20, 20, 21, 21, 22, 22, 23, 23, 24, 24, 25, 25, 26, 26]
    });
    var falling = animation({
      name: 'player',
      frames: [28]
    });
    var jumping = animation({
      name: 'player',
      frames: [27]
    })
      
    loki.modules.player = function(env) {
      
      // maintains a 1-based map of things the player is carrying. this maps neatly
      // to the scheme of getting the player to press number keys to specify
      // a particular spot in the player's inventory.
      env.inventory = function() {
        var that = {},
          typemap = {};
        that.x1 = PADDING;
        that.y1 = CANVAS_HEIGHT - PADDING - HEIGHT;
        that.x2 = PADDING + WIDTH;
        that.y2 = CANVAS_HEIGHT - PADDING;
        that.things = {};
        that.sel = 1;
        
        var getthingbytype = function(key) {
          return that.things[typemap[key]];
        }

        // TODO: does not handle a full inventory yet
        that.add = function(thing) {
          // make sure thing has a type attribute
          if (!thing.hasOwnProperty('type')) {
            throw {
              message: "Item must have type attribute"
            };
          }
          // find the index for this thing
          var index = 1;
          // I pray the following doesn't bite me in the ass later...
          var key = JSON.stringify(thing.type);
          if (typemap.hasOwnProperty(key)) {
            index = typemap[key];
          }
          else {
            // find an open slot
            for (var i = 1; i <= MAXITEMS; i++) {
              if (!that.things.hasOwnProperty(i) || that.things[i].key === key) {
                index = i;
                break;
              }
            }
          }
          if (!that.things.hasOwnProperty(index)) {
            that.things[index] = {
              key: key,
              instance: thing,
              count: 0
            };
            typemap[key] = index;
          };
          that.things[index].count += 1;
        };
        
        that.remove = function(type, count) {
          count = count || 1;
          var key = JSON.stringify(type);
          if (!typemap.hasOwnProperty(key)) {
            throw {
              message: 'Nothing of that type in inventory!'
            };
          }
          var thing = getthingbytype(key);
          if (thing.count < count) {
            throw {
              message: 'Tried to remove too much!'
            }
          };
          thing.count -= count;
          if (thing.count === 0) {
            // if we're out at that slot, remove the counter object...
            delete that.things[typemap[key]];
            delete typemap[key];
          }
        }

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
          that.remove(t.instance.type);
          return t.instance;
        }

        that.draw = function(drawthing) {
          drawthing.hud.push(function(ctx) {
            // draw the background
            ctx.fillStyle = 'hsla(120, 0%, 0%, 0.3)';
            ctx.fillRect(that.x1, that.y1, WIDTH, HEIGHT);
            // draw the itemrects...
            ctx.lineWidth = 2;
            ctx.fillStyle = 'hsla(120, 100%, 100%, 1.0)';
            ctx.font = '15px Impact';
            var unselstyle = 'hsla(120, 10%, 50%, 0.6)';
            var selstyle = 'hsla(120, 80%, 50%, 0.6)';
            for (var i = 1; i <= 8; i++) {
              ctx.strokeStyle = (i === that.sel ? selstyle : unselstyle);
              var r = that.itemrect(i);
              ctx.strokeRect(r.x1, r.y1, r.x2 - r.x1, r.y2 - r.y1);
              // now draw the icon, if we have one...
              if (that.things.hasOwnProperty(i)) {
                var invitem = that.things[i];
                var drawimage = invitem.instance.drawimage;
                ctx.save();
                ctx.translate(r.x1 + (r.width / 2) - 8, r.y1 + (r.height / 2) - 16);
                drawimage(ctx);
                // how many do we have? and center that text
                var countstr = '' + invitem.count;
                var textwidth = ctx.measureText(countstr);
                ctx.fillText(countstr, -(textwidth.width / 2) + 7, 32);
                ctx.restore();
              }
            }
          });
        }; // draw

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
        }; // itemrect
        
        that.hasitem = function(type, count) {
          count = count || 1;
          // do we even have one of those?
          var key = JSON.stringify(type);
          if (!typemap.hasOwnProperty(key)) {
            return false;
          }
          // do we have the required count?
          return getthingbytype(key).count >= count;
        }; // hasitem

        return that;
      }; // inventory
      
      // expects the following args:
      // * player - the player whose action this is
      // * game - the game where this is taking place
      env.moveaction = function(args) {
        var player = args.player,
          game = args.game,
          keyman = args.game.keyboardmanager,
          that = action();
        that.readkeyboard = function() {
          if (keyman.keymap['shift']) {
            player.movestate.mining = true;
          }
          else {
            player.movestate.mining = false;
          };
          if (keyman.keymap['space']) {
            player.movestate.wantstojump = true;
          }
          else {
            player.movestate.wantstojump = false;
          };
          if (keyman.keymap['z']) {
            player.movestate.placing = true;
          }
          else {
            player.movestate.placing = false;
          }
          // this order is probably pretty important.
          // don't want down to be the one that wins out.
          if (keyman.keymap['s'] || keyman.keymap['down']) {
            player.movestate.walking = walking.DOWN;
          }
          else if (keyman.keymap['a'] || keyman.keymap['left']) {
            player.movestate.walking = walking.LEFT;
          }
          else if (keyman.keymap['d'] || keyman.keymap['right']) {
            player.movestate.walking = walking.RIGHT;
          }
          else if (keyman.keymap['w'] || keyman.keymap['up']) {
            player.movestate.walking = walking.UP;
          }
          else {
            player.movestate.walking = walking.STANDING;
          };
          // set the currently selected thing in inventory
          for (var i = 1; i <= 8; i++) {
            if (keyman.keymap['' + i]) {
              player.inventory.sel = i;
            }
          }
        }; // readkeyboard
        var tileposindirection = function() {
    			// respect player's center of mass
    			var tilepos = totilepos(player.x + player.size.x / 2, player.y + player.size.y / 2);
    			if (player.movestate.walking === walking.LEFT) {
    				tilepos.x -= 1;
    			}
    			else if (player.movestate.walking === walking.RIGHT) {
    				tilepos.x += 1;
    			}
    			else if (player.movestate.walking === walking.UP) {
    				tilepos.y -= 1;
    			}
    			else if (player.movestate.walking === walking.DOWN) {
    				tilepos.y += 1;
    			}
    			return tilepos;
        }; // tileposindirection
    		that.mine = function() {
    			if (player.movestate.mining) {
    				// convert player's current walking direction to tile
    				var tilepos = tileposindirection();
    				// is it a diggable tile?
    				var digtile = game.tilemap.get(tilepos.x, tilepos.y);
    				if (digtile && typeof digtile.damage === 'function') {
    				  digtile.damage(player.minedamage);
    				}
    			}
    		}; // mine
    		that.walk = function() {
    			if (player.movestate.walking === walking.LEFT && !player.movestate.placing) {
    			  player.vel.x = player.velocities.walkleft;
    			}
    			else if (player.movestate.walking === walking.RIGHT && !player.movestate.placing) {
    			  player.vel.x = player.velocities.walkright;
    			}
    			else {
    			  if (player.vel.x < 0) {
    			    player.vel.x = Math.min(0, player.vel.x + STOPFORCE);
    			  }
    			  else {
    			    player.vel.x = Math.max(0, player.vel.x - STOPFORCE);
    			  }
    			}
    			if (player.movestate.wantstojump) {
    				player.jump();
    			}
    		}; // mine
    		that.place = function() {
    		  if (!player.movestate.placing || player.movestate.walking === walking.STANDING) {
    		    return;
    		  }
    		  var i = player.inventory.getsel();
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
    		  player.inventory.dropsel();
    		}; // place
        that.tick = function() {
    			// read the state of the keyboard
    			that.readkeyboard();
    			// are we mining?
    			that.mine();
    			// walk somewhere
    			that.walk();
    			// placing anything?
    			that.place();
        };
        that.draw = function(drawthing) {
          drawthing.sprite1.push(function(ctx) {
            if (player.movestate.standing === false && player.vel.y > 0) {
              falling.draw(ctx, player.x, player.y);
            }
            else if (player.movestate.standing === false && player.vel.y <= 0) {
              jumping.draw(ctx, player.x, player.y);
            }
            else if (player.movestate.walking === walking.LEFT) {
              runningleft.draw(ctx, player.x, player.y);
            }
            else if (player.movestate.walking === walking.RIGHT) {
              runningright.draw(ctx, player.x, player.y);
            }
            else {
              standing.draw(ctx, player.x, player.y);
            }
          });
        };
        return that;
      }; // moveaction
      
      env.player = function(args) {
        // player derives from mob
        var that = mob(args);
        // set player defaults
        that.size = {
          x: 24,
          y: 32
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
        var moveaction = env.moveaction({
          player: that,
          game: args.game
        });
        that.addaction(moveaction);

        that.inventory = env.inventory();

        that.draw = function(drawthing) {
          // draw the player's current action
          that.executeactions('draw', drawthing);
          // draw the health bar
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

    		// update the player every tick
    		that.tick = function() {
    		// gravity has to have some effect here...
    			mob.gravitytick.call(this);
    			// tick the current action
    			that.executeactions('tick');
    		};

    		return that;
      }; // player
    };
  });
  
})(this, jQuery)