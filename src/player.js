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
  
  // inventory constants
  var PADDING = 5;
  var CANVAS_WIDTH = 600;
  var CANVAS_HEIGHT = 500;
  var WIDTH = CANVAS_WIDTH - PADDING * 2;
  var HEIGHT = 50;
  var MAXITEMS = 8;
  
  loki.define('mob', 'tileutils', 'components', function(env) {
    var mob = env.mob,
      tilesize = env.tilesize,
      totilepos = env.totilepos,
      damageable = env.damageable;
      
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

        that.inventory = env.inventory();

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