// items.js
//
// All the things a player can pickup and use in the game.

(function(global, $) {
  
  loki.define('assets', 'tileutils', 'tiles', 'mob', 'defenses', function(env) {
    var tilesize = env.tilesize,
      totilepos = env.totilepos,
      dirt = env.dirt,
      mob = env.mob,
      sentrygun = env.sentrygun,
      imagemanager = env.imagemanager;
      
    // add tile images
    imagemanager.add('dirtitem', 'assets/images/dirtitem.png');
    imagemanager.add('sentrygunitem', 'assets/images/sentrygunitem.png');
    
    loki.modules.items = function(env) {
      // private shared ctor thing
      var item = function(args) {
        var that = {};
        that.type = args.type;

        that.drawimage = function(ctx) {
          imagemanager.draw(ctx, that.type.imagename, 0, 0);
        };

        // called when this item is placed back in the world... x,y is given
        // in world coordinates
        that.place = function(x, y) {};

        return that;
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
            ctx.save();
            ctx.translate(that.x, that.y);
            args.item.drawimage(ctx);
            ctx.restore();
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
      }; // subscribeitemevents
      
      env.itemtypes = {
        DIRT: {
          key: 0,
          imagename: 'dirtitem',
          create: function() {
            return env.dirtitem();
          }
        },
        SENTRYGUN: {
          key: 1,
          imagename: 'sentrygunitem',
          create: function() {
            return env.sentrygunitem();
          }
        }
      }; // itemtypes
      
      // A transformation that takes ingredients and produces other items.
      // Args:
      // * ingredients - a list of objects specifying what is necessary to
      //   make this recipe:
      //   * type - an item type
      //   * count - the count of that item type necessary to complete this
      //     this recipe
      // * resulttype - the item type this recipe creates
      env.recipe = function(ingredients, resulttype) {
        var that = {};
        that.ingredients = ingredients;
        that.resulttype = resulttype;
        
        // given an inventory, can this recipe be crafted?
        that.cancraft = function(inv) {
          for (var i = ingredients.length, ing; i !== 0; i--) {
            ing = ingredients[i - 1]
            console.log(ing.type);
            if (!inv.hasitem(ing.type, ing.count)) {
              return false;
            }
          }
          return true;
        }; // cancraft
        
        that.craft = function(inv, game) {
          for (var i = ingredients.length, ing; i !== 0; i--) {
            ing = ingredients[i - 1];
            inv.remove(ing.type, ing.count);
          }
          return resulttype.create();
        }; // craft
        
        return that;
      }
    }; // items module
    
  }); // loki.define
  
}(this, jQuery))