// items.js
//
// All the things a player can pickup and use in the game.

(function(global, $) {

  var dirtitemimage = new Image();
  dirtitemimage.src = 'assets/images/dirtitem.png';
  var sentrygunitemimage = new Image();
  sentrygunitemimage.src = 'assets/images/sentrygunitem.png';
  
  loki.define('tileutils', 'tiles', function(env) {
    var tilesize = env.tilesize,
      totilepos = env.totilepos,
      dirt = env.dirt;
    
    loki.modules.items = function(env) {
      // private shared ctor thing
      var item = function(args) {
        var that = {};
        that.type = args.type;

        that.drawimage = function(ctx) {};

        // called when this item is placed back in the world... x,y is given
        // in world coordinates
        that.place = function(x, y) {};

        return that;
      };

      env.itemtypes = {
        DIRT: '1',
        SENTRYGUN: '2'
      };

      // given a tile position, return a boolean indicating whether we can place
      // a physical object there.
      var isvalidtileforplace = function(game, tilepos) {
        var existingtile = game.tilemap.get(tilepos.x, tilepos.y);
        return !(existingtile !== null && existingtile.solid)
      }

      env.dirtitem = function(args) {
        var that = item({
          type: env.itemtypes.DIRT
        });

        that.drawimage = function(ctx) {
          ctx.drawImage(dirtitemimage, 0, 0);
        };

        // x,y given in world coordinates. returns true if something was placed.
        that.place = function(x, y) {
          var tilepos = totilepos(x, y);
          if (!isvalidtileforplace(args.game, tilepos)) {
            return false;
          }
          var gentile = dirt({
            game: args.game,
            x: tilepos.x * tilesize,
            y: tilepos.y * tilesize
          });
          args.game.tilemap.set(gentile);
          args.game.spatialhash.set(gentile);
          return true;
        };

        return that;
      }; // dirtitem

      env.sentrygunitem = function(args) {
        var that = item({
          type: env.itemtypes.SENTRYGUN
        });

        that.drawimage = function(ctx) {
          ctx.drawImage(sentrygunitemimage, 0, 0);
        }

        that.place = function(x, y) {
          var tilepos = totilepos(x, y);
          if (!isvalidtileforplace(args.game, tilepos)) {
            return false;
          }
          // var sg = defenses.sentrygun({
          //   game: args.game,
          //   x: x,
          //   y: y
          // });
          // args.game.add(sg);
          return true;
        }.ratelimit(250);

        return that;
      } // sentrygun
    };
    
  });
  
}(this, jQuery))