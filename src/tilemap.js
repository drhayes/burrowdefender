// tilemanager.js
//
// Manages a group of tiles retrievable by tile x,y.
// This is not the same as worldspace x,y -- less granular.
//
// Depends: tile.js

(function(global, $) {
  
  var theAir = new Tile.Air();
  
  var TileMap = function(width, height) {
    this.width = width;
    this.height = height;
    this.tilemap = {};
    
    var me = this;
    
    this.get = function(x, y) {
      var key = TileMap.makekey(x, y);
      // TODO: figure out why commenting out the following three lines
      // makes the CPU usage drop 15%
      if (this.tilemap.hasOwnProperty(key)) {
        return this.tilemap[key];
      }
      return theAir;
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
        ctx.offset = {
          x: tilex - me.offsetx,
          y: tiley - me.offsety
        };
        tile.draw(ctx);
      });
    };
    
    // any visible tile that has a tick method will get it called.
    this.tick = function() {
      iterateviewabletiles(function(tile, tilex, tiley) {
        if (typeof(tile.tick) !== 'undefined') {
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

  global.TileMap = TileMap;
  
})(window, jQuery)
