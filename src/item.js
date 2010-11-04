// item.js
//
// Things that go in inventory and are contained in pickups.
//
// Depends: tile.js

(function(global, $) {

  var dirtitemimage = new Image();
  dirtitemimage.src = 'assets/images/dirtitem.png';
  var sentrygunitemimage = new Image();
  sentrygunitemimage.src = 'assets/images/sentrygunitem.png';

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
    DIRT: '1',
    SENTRYGUN: '2'
  };

  item.dirtitem = function(options) {
    var that = item({
      type: item.types.DIRT
    });
    
    that.drawimage = function(ctx) {
      ctx.drawImage(dirtitemimage, 0, 0);
    };
    
    // x,y given in world coordinates. returns true if something was placed.
    that.place = function(x, y) {
      var tilepos = tile.totilepos(x, y);
      // are we trying to place in a solid tile?
      var existingtile = options.game.tilemap.get(tilepos.x, tilepos.y);
      if (existingtile !== null && existingtile.solid) {
        return false;
      }
      var gentile = tile.dirt({
        game: options.game,
        x: tilepos.x * tile.tilesize,
        y: tilepos.y * tile.tilesize
      });
      options.game.tilemap.set(gentile);
      options.game.spatialhash.set(gentile);
      return true;
    };
    
    return that;
  };
  
  item.sentrygunitem = function(args) {
    var that = item({
      type: item.types.SENTRYGUN
    });
    
    that.drawimage = function(ctx) {
      ctx.drawImage(sentrygunitemimage, 0, 0);
    }
  }

  global.item = item;

})(window, jQuery)