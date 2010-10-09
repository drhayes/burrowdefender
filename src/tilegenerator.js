// tilegenerator.js
//
// Splits the tilespace into a bunch of chunks and adds a mess of sine and
// cosine functions together to generate a surface.
//
// Depends: tile.js


(function(global, $) {
  
  var SURFACE_START = 70;
  var CHUNK_SCALAR = 10;
  var CHUNK_SIZE = Tile.tilesize * CHUNK_SCALAR;
  
  var TileGenerator = function(tilemap, spatialhash) {
    this.tilemap = tilemap;
    this.spatialhash = spatialhash;
    this.generated = {};
    
    // x,y given in world coordinates. will check for generation around this
    // coordinate and, if none, will generate some terrain.
    this.generate = function(x, y) {
      var key = TileGenerator.makekey(x, y);
      this.generated[key] = true;
    };
  };
  
  // Given x,y in world-space, give
  TileGenerator.makekey = function(x, y) {
    var kx = Math.floor(x / CHUNK_SIZE);
    var ky = Math.floor(y / CHUNK_SIZE);
    return kx + ':' + ky;
  }

  global.TileGenerator = TileGenerator;

})(window, jQuery)