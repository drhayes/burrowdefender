// tilegenerator.js
//
// Splits the tilespace into a bunch of chunks and adds a mess of sine and
// cosine functions together to generate a surface.
//
// Depends: tile.js


(function(global, $) {
  
  var SURFACE_START = 70;
  
  var CHUNK_SIZE = Tile.tilesize * 10;
  
  var TileGenerator = function(tilemap, spatialhash) {
    this.tilemap = tilemap;
    this.spatialhash = spatialhash;
    
    // x,y given in world coordinates. will check for generation around this
    // coordinate and, if none, will generate some terrain.
    this.generate = function(x, y) {
      
    };
  };
  
  // Given x,y in world-space, give
  TileGenerator.makekey = function(x, y) {
    
  }

  global.TileGenerator = TileGenerator;

})(window, jQuery)