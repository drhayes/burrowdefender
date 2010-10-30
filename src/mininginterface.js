// mininginterface.js
//
// Mouse-based interface to let the player dig and place items.
//
// Depends: tile.js

(function(global, $) {
  
  var mininginterface = function(args) {
    var that = {};
    
    that.canact = false;
    
    // returns selected tile in tile-space coordinates.
    that.getselpos = function() {
      var t = tile.totilepos(
        args.game.mousemanager.pos.x + args.game.worldoffset.x,
        args.game.mousemanager.pos.y + args.game.worldoffset.y);
      return t;
    }
    
    // returns a rect based on the current mouse position aligned with the
    // offset tiles underneath.
    that.reticlerect = function() {
      // clamp to tile coordinates
      var t = that.getselpos();
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
        var style = that.canact ? 'hsla(120, 80%, 50%, 0.6)' : 'hsla(120, 20%, 50%, 0.6)';
        ctx.strokeStyle(style);
        ctx.strokeRect(rect.x1, rect.y1, rect.x2 - rect.x1, rect.y2 - rect.y1);
      })
    };
    
    that.setcanact = function() {
      // what tilepos is the mouse at?
      var mousetilepos = tile.totilepos(args.game.mousemanager.pos.x, args.game.mousemanager.pos.y);
      // what tilepos is the player at?
      var playertilepos = tile.totilepos(args.game.player.x, args.game.player.y);
      that.canact = Math.abs(mousetilepos.x - playertilepos.x) <= 1 &&
        Math.abs(mousetilepos.y - playertilepos.y) <= 1;
    }
    
    that.dig = function() {
      
    };
    
    that.tick = function() {
      
    };
    
    return that;
  };
  
  global.mininginterface = mininginterface;
  
})(window, jQuery)