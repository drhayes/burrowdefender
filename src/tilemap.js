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
    
    this.get = function() {
      return Tile.AirTile;
    };
    
    this.set = function() {
      
    };
    
  };
  
  global.TileMap = TileMap;
  
})(window, jQuery)
