// mininginterface.js
//
// Mouse-based interface to let the player dig and place items.
//
// Depends: tile.js

(function(global, $) {
  
  var mininginterface = function(args) {
    var that = {};
    
    that.canact = false;
    that.mousesel = {
      x: 0,
      y: 0
    };
    
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
        var style = that.canact ? 'hsla(120, 80%, 50%, 0.9)' : 'hsla(120, 0%, 50%, 0.9)';
        ctx.strokeStyle(style);
        ctx.strokeRect(rect.x1, rect.y1, rect.x2 - rect.x1, rect.y2 - rect.y1);
      })
    };
    
    that.setcanact = function() {
      // what tilepos is the player at?
      var playertilepos = tile.totilepos(args.game.player.x, args.game.player.y);
      that.canact = Math.abs(that.mousesel.x - playertilepos.x) <= 1 &&
        Math.abs(that.mousesel.y - playertilepos.y) <= 1;
    }
    
    that.dig = function() {
      if (!that.canact || !args.game.mousemanager.leftbutton) {
        return;
      }
      var t = args.game.tilemap.get(that.mousesel.x, that.mousesel.y);
      t.damage(args.game.player.minedamage);
    };
    
    that.place = function() {
      if (!that.canact || !args.game.mousemanager.rightbutton) {
        return;
      }
		  var i = args.game.player.inventory.getsel();
		  // do we have anything to drop?
		  if (i === null) {
		    return;
		  };
		  // we have something to drop... place it
		  var result = i.place(that.mousesel.x * tile.tilesize, that.mousesel.y * tile.tilesize);
		  // did it actually get placed?
		  if (!result) {
		    return;
		  }
		  args.game.player.inventory.dropsel();
    };
    
    that.tick = function() {
      // get the mouse selection
      that.mousesel = that.getselpos();
      // can we act?
      that.setcanact();
      // are we digging?
      that.dig();
      // are we placing?
      that.place();
    };
    
    return that;
  };
  
  global.mininginterface = mininginterface;
  
})(this, jQuery)