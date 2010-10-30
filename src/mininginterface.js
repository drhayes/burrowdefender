// mininginterface.js
//
// Mouse-based interface to let the player dig and place items.
//
// Depends: tile.js

(function(global, $) {
  
  var mininginterface = function(args) {
    var that = {};
    
    // returns a rect based on the current mouse position aligned with the
    // offset tiles underneath.
    that.reticlerect = function() {
      // read the mouse position and clamp to tile dimensions
      var tilepos = tile.totilepos(
        args.game.mousemanager.pos.x - args.game.tilemap.offset.x,
        args.game.mousemanager.pos.y - args.game.tilemap.offset.y);
      return {
        x1: tilepos.x * tile.tilesize,
        y1: tilepos.y * tile.tilesize,
        x2: tilepos.x * tile.tilesize + tile.tilesize,
        y2: tilepos.y * tile.tilesize + tile.tilesize
      };
    }
    
    that.draw = function(drawthing) {
    }
    
    return that;
  };
  
  global.mininginterface = mininginterface;
  
})(window, jQuery)