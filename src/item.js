// item.js
//
// Things that go in inventory and are contained in pickups.
//
// Depends: tile.js

(function(global, $) {

  var dirtitemimage = new Image();
  dirtitemimage.src = 'assets/images/dirtitem.png';

  var item = function(options) {
    var that = {};
    that.type = options.type;

    that.drawimage = function(ctx) {};
    
    // called when this item is placed back in the world... x,y is given
    // in world coordinates
    that.place = function(x, y) {};

    return that;
  };

  item.types = {
    DIRT: '1'
  };

  item.dirtitem = function(options) {
    var that = item({
      type: item.types.DIRT
    });
    
    that.drawimage = function(ctx) {
      ctx.drawImage(dirtitemimage, 0, 0);
    };
    
    that.place = function(x, y) {
      var tilepos = tile.totilepos(x, y);
      // are we trying to place in a solid tile?
      var existingtile = options.game.tilemap.get(tilepos.x, tilepos.y);
      if (existingtile.solid) {
        return;
      }
      var gentile = tile.dirt({
        game: options.game,
        x: tilepos.x * tile.tilesize,
        y: tilepos.y * tile.tilesize
      });
      options.game.tilemap.set(tilepos.x, tilepos.y, gentile);
      options.game.spatialhash.set(gentile);
    };
    
    return that;
  };

  global.item = item;

})(window, jQuery)