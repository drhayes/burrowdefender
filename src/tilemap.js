// tilemanager.js
//
// Manages a group of tiles retrievable by tile x,y.
// This is not the same as worldspace x,y -- less granular.
//
// Depends: tile.js

(function(global, $) {
  
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
      return null;
      return theAir;
    };
    
    that.set = function(x, y, tile) {
      that.tilemap[tilemap.makekey(x, y)] = tile;
    };
    
    var iterateviewabletiles = function(tilefunc) {
      var startx = Math.floor(that.offsetx / tile.tilesize);
      var starty = Math.floor(that.offsety / tile.tilesize);
      var endx = Math.floor((that.offsetx + width) / tile.tilesize) + 1;
      var endy = Math.floor((that.offsety + height) / tile.tilesize) + 1;
      for (var x = startx; x < endx; x++) {
        for (var y = starty; y < endy; y++) {
          var sometile = that.get(x, y);
          if (!sometile) {
            continue;
          }
          var tilex = x * tile.tilesize;
          var tiley = y * tile.tilesize;
          tilefunc(sometile, tilex, tiley);
        }
      }
    };
    
    // given the 2d context thing that comes with a canvas.
    // the offsets are given in pixels and are optional.
    that.draw = function(ctx, offsetx, offsety) {
      that.offsetx = offsetx || 0;
      that.offsety = offsety || 0;
      iterateviewabletiles(function(sometile, tilex, tiley) {
        ctx.offset = {
          x: tilex - that.offsetx,
          y: tiley - that.offsety
        };
        sometile.draw(ctx);
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
