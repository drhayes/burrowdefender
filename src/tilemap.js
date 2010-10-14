// tilemanager.js
//
// Manages a group of tiles retrievable by tile x,y.
// This is not the same as worldspace x,y -- less granular.
//
// Depends: tile.js

(function(global, $) {
  
  var TileMap = function(width, height) {
    this.width = width;
    this.height = height;
    this.tilemap = {};
    
    var me = this;
    
    this.get = function(x, y) {
      var key = TileMap.makekey(x, y);
      if (this.tilemap.hasOwnProperty(key)) {
        return this.tilemap[key];
      }
      return new Tile.Air();
    };
    
    this.set = function(x, y, tile) {
      this.tilemap[TileMap.makekey(x, y)] = tile;
    };
    
    var iterateviewabletiles = function(tilefunc) {
      var startx = Math.floor(me.offsetx / Tile.tilesize);
      var starty = Math.floor(me.offsety / Tile.tilesize);
      var endx = Math.floor((me.offsetx + me.width) / Tile.tilesize) + 1;
      var endy = Math.floor((me.offsety + me.height) / Tile.tilesize) + 1;
      for (var x = startx; x < endx; x++) {
        for (var y = starty; y < endy; y++) {
          var tile = me.get(x, y);
          var tilex = x * Tile.tilesize;
          var tiley = y * Tile.tilesize;
          tilefunc(tile, tilex, tiley);
        }
      }
    };
    
    // given the 2d context thing that comes with a canvas.
    // the offsets are given in pixels and are optional.
    this.draw = function(ctx, offsetx, offsety) {
      this.offsetx = offsetx || 0;
      this.offsety = offsety || 0;
      iterateviewabletiles(function(tile, tilex, tiley) {
        tile.draw(tilex - me.offsetx, tiley - me.offsety, ctx);
      });
    };
    
    // any visible tile that has a tick method will get it called.
    this.tick = function() {
      iterateviewabletiles(function(tile, tilex, tiley) {
        if (tile.hasOwnProperty('tick')) {
          tile.tick();
        };
      });
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
