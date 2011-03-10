(function() {
  loki.define('assets', 'world', 'components', 'tileutils', 'mob', function(env) {
    var damageable, dirtitem, imagemanager, mob, tile, tilesize;
    tilesize = env.tilesize;
    tile = env.tile;
    damageable = env.damageable;
    mob = env.mob;
    dirtitem = env.dirtitem;
    imagemanager = env.imagemanager;
    imagemanager.add('dirt', 'assets/images/dirt.png');
    imagemanager.add('grass', 'assets/images/grass.png');
    return loki.modules.tiles = function(env) {
      env.tilefrag = function(args) {
        var that;
        that = mob(args);
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
          var current;
          mob.gravitytick.call(that);
          current = new Date().getTime();
          if (current - that.created > 3000) {
            return that.killed = true;
          }
        };
        that.draw = function(drawthing) {
          return drawthing.sprite2.push(function(ctx) {
            ctx.fillStyle('rgb(192, 192, 192)');
            return ctx.fillRect(that.x, that.y, that.size.x, that.size.y);
          });
        };
        return that;
      };
      env.dug = function(args) {
        var that;
        that = tile(args);
        that.diggable = false;
        that.solid = false;
        that.draw = function(ctx) {
          ctx.fillStyle = 'rgb(40, 15, 0)';
          return ctx.fillRect(0, 0, tilesize + 1, tilesize + 1);
        };
        return that;
      };
      env.dirt = function(args) {
        var that;
        args.genminedtile = function(args) {
          return env.dug(args);
        };
        that = tile(args);
        damageable(that, {
          health: 20,
          whendamaged: function() {
            return that.lasthealed = null;
          }
        });
        that.draw = function(ctx) {
          ctx.fillStyle = 'rgb(102, 51, 0)';
          ctx.fillRect(0, tilesize - 2, tilesize, 3);
          imagemanager.draw(ctx, 'dirt', 0, 0);
          return tile.drawdamage(ctx, that.health / that.maxhealth);
        };
        return that;
      };
      return env.dirtwithgrass = function(args) {
        var that;
        that = env.dirt(args);
        that.draw = function(ctx) {
          ctx.fillStyle = 'rgb(102, 51, 0)';
          ctx.fillRect(0, tilesize - 2, tilesize, 3);
          imagemanager.draw(ctx, 'dirt', 0, 0);
          imagemanager.draw(ctx, 'grass', 0, 0);
          return tile.drawdamage(ctx, that.health / that.maxhealth);
        };
        return that;
      };
    };
  });
}).call(this);
