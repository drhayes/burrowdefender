// tilemanager.js
//
// Manages a group of tiles retrievable by tile x,y.
// This is not the same as entity x,y -- less granular.
//
// Depends: tile.js

(function(global, $) {
  
  var TileMap = function() {
    this.tilemap = {};

    this.makekey = function(x, y) {
      return x + ':' + y;
    };
    
    this.get = function(x, y) {
      var key = this.makekey(x, y);
      if (key in this.tilemap) {
        return this.tilemap[key];
      }
      return Tile.AirTile;
    };
    
    this.set = function(x, y, tile) {
      this.tilemap[this.makekey(x, y)] = tile;
    };
    
  };
  
  global.TileMap = TileMap;
  
})(window, jQuery)
