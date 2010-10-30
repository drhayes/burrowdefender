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
      // clamp to tile coordinates
      var t = tile.totilepos(
        args.game.mousemanager.pos.x + args.game.worldoffset.x,
        args.game.mousemanager.pos.y + args.game.worldoffset.y);
      return {
        x1: (t.x * tile.tilesize) - args.game.worldoffset.x,
        y1: (t.y * tile.tilesize) - args.game.worldoffset.y,
        x2: (t.x * tile.tilesize) - args.game.worldoffset.x + tile.tilesize,
        y2: (t.y * tile.tilesize) - args.game.worldoffset.y + tile.tilesize
      };
    }
    
    that.draw = function(drawthing) {
      drawthing.hud.push(function(ctx) {
        var rect = that.reticlerect();
        ctx.strokeStyle('hsla(120, 80%, 50%, 0.6)');
        ctx.strokeRect(rect.x1, rect.y1, rect.x2 - rect.x1, rect.y2 - rect.y1);
      })
    }
    
    return that;
  };
  
  global.mininginterface = mininginterface;
  
})(window, jQuery)