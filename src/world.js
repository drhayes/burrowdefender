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
      CHUNK_SIZE = tilesize * CHUNK_SCALAR,
      // spatialhash cell
      cellsize = tilesize * 2;

    var genscalar = function(s) {
      return Math.floor(s / CHUNK_SIZE);
    }

    var keyscalar = function(x) {
      return Math.floor(x / cellsize);
    }

    var makerawkey = function(x, y) {
      return x + ':' + y;
    }

    var makekey = function(x, y) {
      return makerawkey(keyscalar(x), keyscalar(y));
    };

    var makeid = function() {
      return Math.random() + ':' + Math.random() + ':' + Math.random();
    };

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
      
      env.tilemap = function(args) {
        var that = {};
        that.tilemap = {};

        that.get = function(x, y) {
          var key = env.tilemap.makekey(x, y);
          // TODO: figure out why commenting out the following three lines
          // makes the CPU usage drop 15%
          if (that.tilemap.hasOwnProperty(key)) {
            return that.tilemap[key];
          }
          return null;
        };

        that.set = function(t) {
          var tilepos = totilepos(t.x, t.y);
          that.tilemap[env.tilemap.makekey(tilepos.x, tilepos.y)] = t;
        };

        var iterateviewabletiles = function(tilefunc) {
          var startx = Math.floor(args.game.worldoffset.x / tilesize);
          var starty = Math.floor(args.game.worldoffset.y / tilesize);
          var endx = Math.floor((args.game.worldoffset.x + args.game.width) / tilesize) + 1;
          var endy = Math.floor((args.game.worldoffset.y + args.game.height) / tilesize) + 1;
          for (var x = startx; x < endx; x++) {
            for (var y = starty; y < endy; y++) {
              var sometile = that.get(x, y);
              if (!sometile) {
                continue;
              }
              var tilex = x * tilesize;
              var tiley = y * tilesize;
              tilefunc(sometile, tilex, tiley);
            }
          }
        };

        // given the 2d context thing that comes with a canvas.
        // the offsets are given in pixels and are optional.
        that.draw = function(ctx) {
          iterateviewabletiles(function(sometile, tilex, tiley) {
            ctx.offset = {
              x: tilex - args.game.worldoffset.x,
              y: tiley - args.game.worldoffset.y
            };
            sometile.draw(ctx);
          });
        };

        // any visible tile that has a tick method will get it called.
        that.tick = function() {
          // now tick the tiles
          iterateviewabletiles(function(tile, tilex, tiley) {
            if (typeof(tile.tick) !== 'undefined') {
              tile.tick();
            };
          });
        };

        return that;
      }; // tilemap
      
      env.tilemap.makekey = function(x, y) {
        return x + ':' + y;
      };

      env.tilemap.parsekey = function(key) {
        var nums = key.split(':');
        return {
          x: nums[0],
          y: nums[1]
        };
      };
      
      env.spatialhash = function() {
        var that = {};
        that.spacemap = {};

        var innerget = function(key) {
          if (that.spacemap.hasOwnProperty(key)) {
            var l = [];
            var cell = that.spacemap[key];
            for (thing in cell) {
              l.push(cell[thing]);
            }
            return l;
          }
          return [];
        }

        that.iterate = function(r, func) {
          var kx1 = keyscalar(r.x1);
          var ky1 = keyscalar(r.y1);
          var kx2 = keyscalar(r.x2);
          var ky2 = keyscalar(r.y2);
          for (var i = kx1; i <= kx2; i++) {
            for (var j = ky1; j <= ky2; j++) {
              var key = makerawkey(i, j);
              func.apply(this, [key, r]);
            }
          }
        };

        // Given in world coordinates.
        that.get = function(r, vx, vy) {
          var things = [];
          var seenkeys = {};
          var addemup = function(key, r) {
            seenkeys[key] = true;
            things = things.concat(innerget.apply(this, [key]));
          };
          that.iterate(r, function(key, r) {
            addemup.apply(this, [key, r]);
          });
          // we must account for velocity
          var rv = {
            x1: r.x1 + vx,
            y1: r.y1 + vy,
            x2: r.x2 + vx,
            y2: r.y2 + vy
          };
          that.iterate(rv, function(key, r) {
            // dedupe on velocity check
            if (seenkeys.hasOwnProperty(key)) {
              return;
            }
            addemup.apply(this, [key, r]);
          })
          return things;
        };

        // Given a {x1,y1,x2,y2} rect, put it in the right place in the
        // spatial hash. If it's a big rect, let it span buckets in the hash.
        that.set = function(r) {
          r.shid = makeid();
          that.iterate(r, function(key, r) {
            if (!that.spacemap.hasOwnProperty(key)) {
              that.spacemap[key] = {};
            }
            that.spacemap[key][r.shid] = r;
          });
        };

        that.remove = function(r) {
          that.iterate(r, function(key, r) {
            if (that.spacemap.hasOwnProperty(key)) {
              var l = that.spacemap[key];
              delete l[r.shid];
            }
          });
        };

        that.move = function() {

        };

        return that;
      }; // spatialhash
    }; // world module
  });
  
}(this, jQuery));