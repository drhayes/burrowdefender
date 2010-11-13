// world.js
//
// The tile generator, tile map, and spatial hash necessary for constructing
// and maintaing a coherent world.

(function(global, $) {
  
  var cracks1image = new Image();
  cracks1image.src = 'assets/images/cracks1.png';
  var cracks2image = new Image();
  cracks2image.src = 'assets/images/cracks2.png';
  var cracks3image = new Image();
  cracks3image.src = 'assets/images/cracks3.png';
  
  loki.define('tileutils', function(env) {
    var tilesize = env.tilesize,
      totilepos = env.totilepos,
      CHUNK_SCALAR = 30,
      CHUNK_SIZE = tilesize * CHUNK_SCALAR;

    var genscalar = function(s) {
      return Math.floor(s / CHUNK_SIZE);
    }

    loki.modules.world = function(env) {
      // Procedurally generates the world the player can walk around on.
      // Args:
      // * game - the game mediator with access to tilemap and spatialhash
      // * surfacetile - function used to generate a tile suitable for placement
      //   on the surface.
      // * firstgroundtile - function used to generate a tile suitable for just
      //   underground.
      env.tilegenerator = function(args) {
        var that = {};
        var game = args.game;
        var tilemap = args.game.tilemap;
        var spatialhash = args.game.spatialhash;
        that.generated = {};

        // x,y given in world coordinates. will check for generation around this
        // coordinate and, if none, will generate some terrain.
        // TODO: This only does the surface for now!
        that.generate = function(x, y) {
          var key = env.tilegenerator.makekey(x, y);
          if (that.generated.hasOwnProperty(key)) {
            return;
          }
          // generate some stuff!
          that.generated[key] = true;
          // what tile x are we starting from?
          var x1 = totilepos(genscalar(x) * CHUNK_SIZE, 0).x
          var x2 = x1 + CHUNK_SCALAR;
          var y = 0;
          var gentile = null;
          for (var i = x1; i < x2; i++) {
            y = env.tilegenerator.gensurface(i);
            for (var j = 0; j < 20; j++) {
              var tileargs = {
                game: game,
                x: i * env.tilesize,
                y: (y + j) * env.tilesize
              };
              if (j === 0) {
                gentile = args.surfacetile(tileargs);
              }
              else {
                gentile = args.firstgroundtile(tileargs);
              }
              tilemap.set(gentile);
              spatialhash.set(gentile);
            }
          }
        };

        return that;
      }; // tilegenerator
      
      // Given x,y in world-space, give
      env.tilegenerator.makekey = function(x, y) {
        return genscalar(x) + ':' + genscalar(y);
      };

      // Given an x in tilespace, returns a y in tilespace that is the surface of
      // the land at this tile x.
      env.tilegenerator.gensurface = function(x) {
        var y = 1.25 * Math.sin(0.02 * x) - 2.3 * Math.sin(0.3 * x) +
          0.5 * Math.cos(0.9 * x) + 3 * Math.sin(0.1 * x) -
          5.1 * Math.cos(0.09 * x);
        return Math.round(y);
      }
      
      // A tile the player can walk around on in the game.
      // Args:
      // * game - the mediator object that has spatialhash and tilemap
      // * x - the x position in worldspace of this tile
      // * y - the y position in worldspace of this tile
      // * genminedtile - function that generates tile to replace this tile when
      //   it is mined.
      // * genpickup - function that generates pickup player can grab into
      //   inventory (optional).
      env.tile = function(args) {
        var that = {};
        that.diggable = true;
        that.solid = true;
        that.x = that.x1 = args.x;
        that.y = that.y1 = args.y;
        that.x2 = tilesize + that.x1;
        that.y2 = tilesize + that.y1;
        that.halfwidth = (that.x2 - that.x1) / 2;
        that.halfheight = (that.y2 - that.y1) / 2;
        that.halfx = that.halfwidth + that.x1;
        that.halfy = that.halfheight + that.y1;
        that.draw = function(x, y, ctx) {
          // this version doesn't do anything
        };

        that.mine = function() {
          if (!that.diggable) {
            return;
          }
      	  // if we're not dead, do nothing...
      	  if (that.health > 0) {
      	    return;
      	  }
      	  // this tile has been killed!
      	  var minedtile = args.genminedtile({
      	    game: args.game,
      	    x: that.x,
      	    y: that.y
      	  });
          args.game.tilemap.set(minedtile);
          args.game.spatialhash.remove(that);
          // make the drop at the center point of this tile if we can
          if (args.genpickup) {
            var dp = args.genpickup({
              x: that.x + (tilesize / 2) - 8,
              y: that.y + (tilesize / 2) - 8
              // game: args.game,
              // item: item.dirtitem({game: args.game})
            });
            dp.updaterect();
            args.game.add(dp);
          }
        };

        that.healtick = function() {
          if (that.health === that.maxhealth) {
            return;
          }
          if (!that.lasthealed) {
            that.lasthealed = new Date().getTime();
            return;
          };
          var currenttime = new Date().getTime();
          if (currenttime - that.lasthealed >= 750) {
            that.health += 1;
          };
          if (that.health >= that.maxhealth) {
            that.lasthealed = null;
          };
        };

        that.tick = function() {
          // is this mine getting dug?
          that.mine();
          // is this mine in need of healing?
          that.healtick();
        }

        return that;
      }; // tile
      
      // Draw the tile damage tiles
      env.tile.drawdamage = function(ctx, percentage) {
        if (percentage === 1) {
          return;
        };
        var image = cracks1image;
        if (percentage <= 0.3) {
          image = cracks3image;
        }
        else if (percentage <= 0.6) {
          image = cracks2image;
        }
        ctx.drawImage(image, 0, 0);
      };
    }; // world module
  });
  
}(this, jQuery));