// game.js
//
// The object that handles everthing about showing the game.
//
// Depends: on everything else...

(function(global, $) {
  
  loki.define('*', function(env) {
    var isrect = function(thing) {
      return typeof thing.x1 === 'number' &&
          typeof thing.y1 === 'number' &&
          typeof thing.x2 === 'number' &&
          typeof thing.y2 === 'number';
    }

    var game = function(canvasid) {
      var that = {};
      that.canvas = $(canvasid)[0];
      that.ctx = that.canvas.getContext('2d');
      that.width = that.canvas.width;
      that.height = that.canvas.height;
      that.tilemap = env.tilemap({game: that});
      that.spatialhash = env.spatialhash();
      // tilegenerator utility function
      var maketile = function(tilename) {
        return function(args) {
          return env[tilename](args);
        }
      }

      that.tilegenerator = env.tilegenerator({
        game: that,
        surfacetile: maketile('dirtwithgrass'),
        firstgroundtile: maketile('dirt')
      });
      that.keyboardmanager = env.keyboardmanager();
      that.playeroffset = {
        x: that.width / 2,
        y: that.height / 2
      };
      that.worldoffset = {
        x: 0,
        y: 0
      };
      that.updater = env.updater();
      that.eventbus = env.eventer();
      env.subscribeitemevents(that, that.eventbus);
      that.things = [];
      that.addthings = [];
      that.mousemanager = env.mousemanager({game: that});
      that.craftinginterface = env.craftinginterface({
        game: that,
        recipes: [
          env.recipe([
            {type: env.itemtypes.DIRT, count: 4}
          ], env.itemtypes.SENTRYGUN)
        ]
      });

      // temporary tile generation
  		that.tilegenerator.generate(31 * env.tilesize, 0);
  		that.tilegenerator.generate(0, 0);
  		that.tilegenerator.generate(-10 * env.tilesize, 0);

      // methods
      that.start = function() {
        // wait for images to load...
        env.imagemanager.readywait(function() {
          that.updater.start();
        });
      };

      // Whatever this thing is, add it to the appropriate update buckets. If it
      // can draw itself, add to drawables. If it ticks, add it there. Etc...
      that.add = function(thing) {
        that.addthings.push(thing);
        // if the thing is a rect, set it in the spatialhash
        if (isrect(thing)) {
          that.spatialhash.set(thing);      
        }
      };

      that.update = function() {
        // update the offsets
        that.worldoffset = {
          x: Math.round(that.player.x - that.playeroffset.x),
          y: that.player.y - that.playeroffset.y
        };
        // update the tilemap
        that.tilemap.tick();
        // things can kill themselves on tick, so we need a new list of the
        // unkilled things after each update cycle...
        var newthings = [];
        // gather the drawables
        that.drawables = [];
        // run all the updates on the things
        $.each(that.things, function(index, thing) {
          if (typeof(thing) === 'function') {
            thing();
          };
          if (thing.tick) {
            thing.tick();
          };
          if (thing.move) {
            thing.move(that.spatialhash.get(thing, thing.vel.x, thing.vel.y));
          };
          if (thing.draw) {
            that.drawables.push(function(drawthing) {
              thing.draw(drawthing);
            });
          };
          if (typeof(thing.killed) === 'undefined' || !thing.killed) {
            newthings.push(thing);
          }
          else {
            // should we remove it from the spatial hash?
            if (isrect(thing)) {
              that.spatialhash.remove(thing);
            }
          }
        });
        // swap the list if anything was killed and add anything that was added
        // during the update cycle.
        that.things = newthings;
        if (that.addthings.length > 0) {
          that.things = newthings.concat(that.addthings);
        }
        that.addthings = [];
      };

      var drawiterate = function(drawthing, layer) {
        var drawthings = drawthing[layer];
        var offsetx = -that.worldoffset.x;
        var offsety = -that.worldoffset.y;
        // hud does not get drawn with offset
        if (layer === 'hud') {
          offsetx = 0;
          offsety = 0;
        }
        that.ctx.save();
        that.ctx.translate(offsetx, offsety);
        $.each(drawthings, function(i, thing) {
          thing(that.ctx);
        });
        that.ctx.restore();
      };

      that.draw = function() {
        var drawthing = {
          background: [],
          tile: [],
          sprite1: [],
          sprite2: [],
          hud: []
        };
        // get all the drawable functions from people
        $.each(that.drawables, function(i, drawable) {
          drawable(drawthing);
        });
        drawiterate(drawthing, 'background');
        drawiterate(drawthing, 'tile');
        drawiterate(drawthing, 'sprite1');
        drawiterate(drawthing, 'sprite2');
        drawiterate(drawthing, 'hud');
      };

      // add the update method to the updater thingy
      that.updater.add(function() {
        that.update();
      });
      // add the draw method to the updater thing
      that.updater.add(function() {
        that.draw();
      });

      that.clearbackground = function(ctx) {
        // we don't want the offset given to this function, so...
        ctx.restore();
        ctx.fillStyle = 'hsl(230, 100%, 60%)';
  			ctx.fillRect(0, 0, that.width, that.height);
  			ctx.save();
      };

      that.drawtiles = function(ctx) {
        that.tilemap.draw(ctx);
      };

      // add our drawing tasks
      var backgrounddraw = {
        draw: function(drawthing) {
          drawthing.background.push(function(ctx) {
            that.clearbackground(ctx);
          });
          drawthing.tile.push(function(ctx) {
            that.drawtiles(ctx);
          });
        }
      };
      that.add(backgrounddraw);

      // last but not least, add the player
      that.player = env.player({
        y: -200,
        game: that
      });
      that.add(that.player);

      return that;
    };
    
    // load the images
    env.imagemanager.load();

    global.game = game;
  });
  
})(this, jQuery)