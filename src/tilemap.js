// tilemanager.js
//
// Manages a group of tiles retrievable by tile x,y.
// This is not the same as worldspace x,y -- less granular.
//
// Depends: tile.js

(function(global, $) {
  
  var theAir = new Tile.Air();
  
  var tilemap = function(width, height) {
    var that = {};
    that.tilemap = {};
    
    that.get = function(x, y) {
      var key = tilemap.makekey(x, y);
      // TODO: figure out why commenting out the following three lines
      // makes the CPU usage drop 15%
      if (that.tilemap.hasOwnProperty(key)) {
        return that.tilemap[key];
      }
      return theAir;
    };
    
    that.set = function(x, y, tile) {
      that.tilemap[tilemap.makekey(x, y)] = tile;
    };
    
    var iterateviewabletiles = function(tilefunc) {
      var startx = Math.floor(that.offsetx / Tile.tilesize);
      var starty = Math.floor(that.offsety / Tile.tilesize);
      var endx = Math.floor((that.offsetx + width) / Tile.tilesize) + 1;
      var endy = Math.floor((that.offsety + height) / Tile.tilesize) + 1;
      for (var x = startx; x < endx; x++) {
        for (var y = starty; y < endy; y++) {
          var tile = that.get(x, y);
          var tilex = x * Tile.tilesize;
          var tiley = y * Tile.tilesize;
          tilefunc(tile, tilex, tiley);
        }
      }
    };
    
    // given the 2d context thing that comes with a canvas.
    // the offsets are given in pixels and are optional.
    that.draw = function(ctx, offsetx, offsety) {
      that.offsetx = offsetx || 0;
      that.offsety = offsety || 0;
      iterateviewabletiles(function(tile, tilex, tiley) {
        ctx.offset = {
          x: tilex - that.offsetx,
          y: tiley - that.offsety
        };
        tile.draw(ctx);
      });
    };
    
    // any visible tile that has a tick method will get it called.
    that.tick = function() {
      iterateviewabletiles(function(tile, tilex, tiley) {
        if (typeof(tile.tick) !== 'undefined') {
          tile.tick();
        };
      });
    };
    
    return that;
  };
  
  tilemap.makekey = function(x, y) {
    return x + ':' + y;
  };
  
  tilemap.parsekey = function(key) {
    var nums = key.split(':');
    return {
      x: nums[0],
      y: nums[1]
    };
  }

  global.tilemap = tilemap;
  
})(window, jQuery)
