// items.js
//
// All the things a player can pickup and use in the game.

(function(global, $) {

  var dirtitemimage = new Image();
  dirtitemimage.src = 'assets/images/dirtitem.png';
  var sentrygunitemimage = new Image();
  sentrygunitemimage.src = 'assets/images/sentrygunitem.png';
  
  loki.define('tileutils', 'tiles', 'mob', 'defenses', function(env) {
    var tilesize = env.tilesize,
      totilepos = env.totilepos,
      dirt = env.dirt,
      mob = env.mob,
      sentrygun = env.sentrygun;
    
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
      }; // item

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
          var sg = sentrygun({
            game: args.game,
            x: x,
            y: y
          });
          args.game.add(sg);
          return true;
        }.ratelimit(250);

        return that;
      }; // sentrygun
      
      // Args:
      // * mob arguments
      // * item - The item that this pickup represents.
      env.pickup = function(args) {
        var that = mob(args);
        that.vel.y = -2;
        that.solid = false;
        that.bounce = 0.63;
        that.created = new Date().getTime();
        that.taken = false;
      
        var pickupcollide = function(collider) {
          if (!collider.inventory) {
            return;
          };
          if (that.taken) {
            return;
          }
          that.taken = true;
          collider.inventory.add(args.item);
          that.killed = true;
          // have to get the rect to remove from spatial hash
          that.updaterect();
          args.game.spatialhash.remove(this);
          // stop colliding
          return true;
        };
      
        that.tick = function() {
          mob.gravitytick.call(that);
          // are we pickupable yet?
          if (new Date().getTime() - that.created > 300) {
            that.collide = pickupcollide;
          }
        };
      
        that.draw = function(drawthing) {
          drawthing.sprite1.push(function(ctx) {
            ctx.offset.x += that.x;
            ctx.offset.y += that.y;
            args.item.drawimage(ctx);
          });
        };
      
        return that;    
      }; // pickup
      
      // We want to pick up on events like tiles getting mined (which should
      // drop a dirtitem), etc.
      env.subscribeitemevents = function(game, eventer) {
        eventer.subscribe('mined', function(tile) {
          // create a pickup for that tile in its center
          var pickup = env.pickup({
            game: game,
            x: tile.x + (tilesize / 2) - 8,
            y: tile.y + (tilesize / 2) - 8,
            item: env.dirtitem({game: game})
          });
          // add to the game
          game.add(pickup);
        });
      };
    };
    
  });
  
}(this, jQuery))