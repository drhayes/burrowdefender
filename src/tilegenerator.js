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
  
  var TileGenerator = function(tilemap, spatialhash) {
    this.tilemap = tilemap;
    this.spatialhash = spatialhash;
    this.generated = {};
    
    // x,y given in world coordinates. will check for generation around this
    // coordinate and, if none, will generate some terrain.
    // TODO: This only does the surface for now!
    this.generate = function(x, y) {
      var key = TileGenerator.makekey(x, y);
      if (this.generated.hasOwnProperty(key)) {
        return;
      }
      // generate some stuff!
      this.generated[key] = true;
      // what tile x are we starting from?
      var x1 = Tile.totilepos(genscalar(x) * CHUNK_SIZE, 0).x
      var x2 = x1 + CHUNK_SCALAR;
      var y = 0;
      var tile = null;
      for (var i = x1; i < x2; i++) {
        y = TileGenerator.gensurface(i);
        for (var j = 0; j < 20; j++) {
          if (j === 0) {
            tile = new Tile.DirtWithGrass();
          }
          else {
            tile = new Tile.Dirt();
          }
          this.tilemap.set(i, y + j, tile);
          this.spatialhash.set(TileMap.getrect(i, y + j));
        }
      }
    };
  };
  
  // Given x,y in world-space, give
  TileGenerator.makekey = function(x, y) {
    return genscalar(x) + ':' + genscalar(y);
  };
  
  // Given an x in tilespace, returns a y in tilespace that is the surface of
  // the land at this tile x.
  TileGenerator.gensurface = function(x) {
    var y = 1.25 * Math.sin(0.02 * x) - 2.3 * Math.sin(0.3 * x) +
      0.5 * Math.cos(0.9 * x) + 3 * Math.sin(0.1 * x) -
      5.1 * Math.cos(0.09 * x);
    return Math.round(y);
  }

  global.TileGenerator = TileGenerator;

})(window, jQuery)