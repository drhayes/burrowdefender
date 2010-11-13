// world.js
//
// The tile generator, tile map, and spatial hash necessary for constructing
// and maintaing a coherent world.

(function(global, $) {
  
  loki.define('tileutils', function(env) {
    var tilesize = env.tilesize,
      totilepos = env.totilepos,
      CHUNK_SCALAR = 30,
      CHUNK_SIZE = tilesize * CHUNK_SCALAR;

    var genscalar = function(s) {
      return Math.floor(s / CHUNK_SIZE);
    }

    loki.modules.world = function(env) {
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
    };
  });
  
}(this, jQuery));