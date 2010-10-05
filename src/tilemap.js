// tilemanager.js
//
// Manages a group of tiles retrievable by tile x,y.
// This is not the same as worldspace x,y -- less granular.
//
// Depends: tile.js

(function(global, $) {
  
  var TileMap = function() {
    this.tilemap = {};
    
    this.get = function(x, y) {
      var key = TileMap.makekey(x, y);
      if (key in this.tilemap) {
        return this.tilemap[key];
      }
      return Tile.AirTile;
    };
    
    this.set = function(x, y, tile) {
      this.tilemap[TileMap.makekey(x, y)] = tile;
    };
    
    // given the 2d context thing that comes with a canvas
    this.draw = function(ctx) {
      var tilemap = this;
      $.each(this.tilemap, function(key, tile) {
        var pos = TileMap.parsekey(key);
        tile.draw(pos.x * Tile.tilesize, pos.y * Tile.tilesize, ctx);
      })
    };
  };
  
  TileMap.makekey = function(x, y) {
    return x + ':' + y;
  };
  
  TileMap.parsekey = function(key) {
    var nums = key.split(':');
    return {
      x: nums[0],
      y: nums[1]
    };
  }

  // given a position in tilespace, return the rect in world space
  TileMap.getrect = function(x, y) {
    return {
      x1: x * Tile.tilesize,
      y1: y * Tile.tilesize,
      x2: (x + 1) * Tile.tilesize - 1,
      y2: (y + 1) * Tile.tilesize - 1
    };
  }

  global.TileMap = TileMap;
  
})(window, jQuery)
