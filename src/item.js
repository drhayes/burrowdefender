// item.js
//
// Things that go in inventory and are contained in pickups.
//
// Depends: tile.js, defenses.js

(function(global, $) {

  var dirtitemimage = new Image();
  dirtitemimage.src = 'assets/images/dirtitem.png';
  var sentrygunitemimage = new Image();
  sentrygunitemimage.src = 'assets/images/sentrygunitem.png';

  var item = function(args) {
    var that = {};
    that.type = args.type;

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
  
  // given a tile position, return a boolean indicating whether we can place
  // a physical object there.
  var isvalidtileforplace = function(game, tilepos) {
    var existingtile = game.tilemap.get(tilepos.x, tilepos.y);
    return !(existingtile !== null && existingtile.solid)
  }

  item.dirtitem = function(args) {
    var that = item({
      type: item.types.DIRT
    });
    
    that.drawimage = function(ctx) {
      ctx.drawImage(dirtitemimage, 0, 0);
    };
    
    // x,y given in world coordinates. returns true if something was placed.
    that.place = function(x, y) {
      var tilepos = tile.totilepos(x, y);
      if (!isvalidtileforplace(args.game, tilepos)) {
        return false;
      }
      var gentile = tile.dirt({
        game: args.game,
        x: tilepos.x * tile.tilesize,
        y: tilepos.y * tile.tilesize
      });
      args.game.tilemap.set(gentile);
      args.game.spatialhash.set(gentile);
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
    
    that.place = function(x, y) {
      var tilepos = tile.totilepos(x, y);
      if (!isvalidtileforplace(args.game, tilepos)) {
        return false;
      }
      var sg = defenses.sentrygun({
        game: args.game,
        x: x,
        y: y
      });
      args.game.add(sg);
      return true;
    }
    
    return that;
  }

  global.item = item;

})(this, jQuery)