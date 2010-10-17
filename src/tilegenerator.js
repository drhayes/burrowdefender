// tilegenerator.js
//
// Splits the tilespace into a bunch of chunks and adds a mess of sine and
// cosine functions together to generate a surface.
//
// Depends: tile.js, tilemap.js


(function(global, $) {

  var CHUNK_SCALAR = 30;
  var CHUNK_SIZE = Tile.tilesize * CHUNK_SCALAR;
  
  var genscalar = function(s) {
    return Math.floor(s / CHUNK_SIZE);
  }
  
  var tilegenerator = function(game) {
    var that = {};
    that.game = game;
    that.tilemap = game.tilemap;
    that.spatialhash = game.spatialhash;
    that.generated = {};
    
    // x,y given in world coordinates. will check for generation around this
    // coordinate and, if none, will generate some terrain.
    // TODO: This only does the surface for now!
    that.generate = function(x, y) {
      var key = tilegenerator.makekey(x, y);
      if (that.generated.hasOwnProperty(key)) {
        return;
      }
      // generate some stuff!
      that.generated[key] = true;
      // what tile x are we starting from?
      var x1 = Tile.totilepos(genscalar(x) * CHUNK_SIZE, 0).x
      var x2 = x1 + CHUNK_SCALAR;
      var y = 0;
      var tile = null;
      for (var i = x1; i < x2; i++) {
        y = tilegenerator.gensurface(i);
        for (var j = 0; j < 20; j++) {
          if (j === 0) {
            tile = new Tile.DirtWithGrass(that.game);
          }
          else {
            tile = new Tile.Dirt(that.game);
          }
          that.tilemap.set(i, y + j, tile);
          that.spatialhash.set(Tile.getrect(i, y + j));
        }
      }
    };
    
    return that;
  };
  
  // Given x,y in world-space, give
  tilegenerator.makekey = function(x, y) {
    return genscalar(x) + ':' + genscalar(y);
  };
  
  // Given an x in tilespace, returns a y in tilespace that is the surface of
  // the land at this tile x.
  tilegenerator.gensurface = function(x) {
    var y = 1.25 * Math.sin(0.02 * x) - 2.3 * Math.sin(0.3 * x) +
      0.5 * Math.cos(0.9 * x) + 3 * Math.sin(0.1 * x) -
      5.1 * Math.cos(0.09 * x);
    return Math.round(y);
  }

  global.tilegenerator = tilegenerator;

})(window, jQuery)