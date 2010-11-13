// tile.js
//
// Concrete tiles for use in Mine Defender.


(function(global, $) {
  
  var dirtimage = new Image();
  dirtimage.src = 'assets/images/dirt.png'
  var grassimage = new Image();
  grassimage.src = 'assets/images/grass.png'
  
  loki.define('world', 'components', 'tileutils', function(env) {
    var tilesize = env.tilesize,
      tile = env.tile,
      damageable = env.damageable;

    loki.modules.tiles = function(env) {
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
    }
  });
      // 
      // // The common tile, but on the surface with grass
      // env.dirtwithgrass = function(args) {
      //   if (typeof(args.game) === 'undefined') {
      //     alert('args.game!')
      //   }
      //   var that = tile.dirt(args);
      // 
      //   that.draw = function(ctx) {
      //     ctx.fillStyle('rgb(102,51,0)');
      //     ctx.fillRect(0, tile.tilesize - 2, tile.tilesize, 3);
      //     ctx.drawImage(dirtimage, 0, 0);
      //     ctx.drawImage(grassimage, 0, 0);
      //     tile.drawdamage(ctx, that.health / that.maxhealth);
      //   };
      // 
      //   return that;
      // }; // dirtwithgrass
  
}(this, jQuery));
