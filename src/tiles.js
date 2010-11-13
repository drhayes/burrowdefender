// tile.js
//
// Concrete tiles for use in Mine Defender.


(function(global, $) {
  
  var dirtimage = new Image();
  dirtimage.src = 'assets/images/dirt.png'
  var grassimage = new Image();
  grassimage.src = 'assets/images/grass.png'
  
  loki.define('world', 'components', 'tileutils', 'mob', function(env) {
    var tilesize = env.tilesize,
      tile = env.tile,
      damageable = env.damageable,
      mob = env.mob;

    loki.modules.tiles = function(env) {
      // when a tile is dug, it produces lots of tiny fragments
      env.tilefrag = function(args) {
        var that = mob(args);
        that.created = new Date().getTime();
        that.size = {
          x: 5,
          y: 5
        };
        that.vel = {
          x: Math.round(Math.random() * 4) - 2,
          y: -1
        };

        that.tick = function() {
          // under the effect of gravity
          mob.gravitytick.call(this);
          // disappears after a few seconds
          var current = new Date().getTime();
          if (current - that.created > 3000) {
            that.killed = true;
          }
        };

        that.draw = function(drawthing) {
          drawthing.sprite2.push(function(ctx) {
            ctx.fillStyle('rgb(192, 192, 192)');
            ctx.fillRect(that.x, that.y, that.size.x, that.size.y);
          });
        };

        return that;
      }; // tilefrag

      // A dirt tile that has been dug
      env.dug = function(args) {
        var that = tile(args);
        that.diggable = false;
        that.solid = false;

        that.draw = function(ctx) {
          ctx.fillStyle('rgb(40, 15, 0)');
          ctx.fillRect(0, 0, tilesize, tilesize + 1);
        };

        return that;
      }; // dug
      
      // The other really common tile.
      env.dirt = function(args) {
        args.genminedtile = function(args) {
          return env.dug(args);
        }
        var that = tile(args);
        // dirt tiles can be damaged
        damageable(that, {
          health: 20,
          whendamaged: function() {
            that.lasthealed = null;
          }
        });
      
        that.draw = function(ctx) {
          ctx.fillStyle('rgb(102,51,0)');
          ctx.fillRect(0, tilesize - 2, tilesize, 3);
          ctx.drawImage(dirtimage, 0, 0);
          tile.drawdamage(ctx, that.health / that.maxhealth);
        };
      
        return that;
      }; // dirt
      
      // The common tile, but on the surface with grass
      env.dirtwithgrass = function(args) {
        var that = env.dirt(args);
      
        that.draw = function(ctx) {
          ctx.fillStyle('rgb(102,51,0)');
          ctx.fillRect(0, tilesize - 2, tilesize, 3);
          ctx.drawImage(dirtimage, 0, 0);
          ctx.drawImage(grassimage, 0, 0);
          tile.drawdamage(ctx, that.health / that.maxhealth);
        };
      
        return that;
      }; // dirtwithgrass
    }
  });  
}(this, jQuery));
