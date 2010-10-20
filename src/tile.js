// tile.js
//
// The thing a player and mobs walk on top of. Tend not to move.
//
// Depends: pickup.js

(function(global, $) {
  
  var dirtimage = new Image();
  dirtimage.src = 'assets/images/dirt.png'
  var grassimage = new Image();
  grassimage.src = 'assets/images/grass.png'
  var cracks1image = new Image();
  cracks1image.src = 'assets/images/cracks1.png';
  var cracks2image = new Image();
  cracks2image.src = 'assets/images/cracks2.png';
  var cracks3image = new Image();
  cracks3image.src = 'assets/images/cracks3.png';
  
  var tile = function(args) {
    var that = {};
    that.diggable = true;
    that.x = that.x1 = args.x;
    that.y = that.y1 = args.y;
    that.x2 = tile.tilesize + that.x1;
    that.y2 = tile.tilesize + that.y1;
    that.halfwidth = (that.x2 - that.x1) / 2;
    that.halfheight = (that.y2 - that.y1) / 2;
    that.halfx = that.halfwidth + that.x1;
    that.halfy = that.halfheight + that.y1;
    that.draw = function(x, y, ctx) {
      // this version doesn't do anything
    };
    
    that.mine = function(digger, x, y) {
      if (!that.diggable) {
        return;
      }
  	  that.health -= digger.minedamage;
  	  that.lasthealed = null;
  	  if (that.health <= 0) {
  	    that.kill(x, y);
  	  }
    };
    
    // remove the tile from the tile map and the spatialhash
    // and replace in tilemap with dug tile
    that.kill = function(x, y) {
      args.game.tilemap.set(x, y, tile.dug(args));
      args.game.spatialhash.remove(that);
      // find the center point of this tile
      var cx = (x * tile.tilesize) + (tile.tilesize / 2);
      var cy = (y * tile.tilesize) + (tile.tilesize / 2);
      // make the drop
      var dp = dirtpickup({game: args.game});
      dp.x = cx - (dp.size.x / 2);
      dp.y = cy - (dp.size.y / 2);
      dp.updaterect();
      args.game.spatialhash.set(dp);
      args.game.add(dp);
    };
    
    that.healtick = function() {
      if (that.health === that.maxhealth) {
        return;
      }
      if (!that.lasthealed) {
        that.lasthealed = new Date().getTime();
      };
      var currenttime = new Date().getTime();
      if (currenttime - that.lasthealed >= 750) {
        that.health += 1;
      };
      if (that.health >= that.maxhealth) {
        that.lasthealed = null;
      };
    };
    
    return that;
  };
  
  // Tiles are square with this length on a side.
  tile.tilesize = 32;
  
  // Draw the tile damage tiles
  tile.drawdamage = function(ctx, percentage) {
    if (percentage === 1) {
      return;
    };
    var image = cracks1image;
    if (percentage <= 0.3) {
      image = cracks3image;
    }
    else if (percentage <= 0.6) {
      image = cracks2image;
    }
    ctx.drawImage(image, 0, 0);
  };
  
  // Given an x,y in worldspace returns an {x,y} position in tilespace.
  tile.totilepos = function(x, y) {
    return {
      x: Math.floor(x/tile.tilesize),
      y: Math.floor(y/tile.tilesize)
    };
  };
  
  // The other really common tile.
  tile.dirt = function(args) {
    if (typeof(args.game) === 'undefined') {
      alert('args.game!')
    }
    var that = tile(args);
    that.health = 20;
    that.maxhealth = 20;
    
    that.draw = function(ctx) {
      ctx.fillStyle('rgb(102,51,0)');
      ctx.fillRect(0, tile.tilesize - 2, tile.tilesize, 3);
      ctx.drawImage(dirtimage, 0, 0);
      tile.drawdamage(ctx, that.health / that.maxhealth);
    };
    
    that.tick = that.healtick;
    
    return that;
  };
  
  // The common tile, but on the surface with grass
  tile.dirtwithgrass = function(args) {
    if (typeof(args.game) === 'undefined') {
      alert('args.game!')
    }
    var that = tile.dirt(args);
    
    that.draw = function(ctx) {
      ctx.fillStyle('rgb(102,51,0)');
      ctx.fillRect(0, tile.tilesize - 2, tile.tilesize, 3);
      ctx.drawImage(dirtimage, 0, 0);
      ctx.drawImage(grassimage, 0, 0);
      tile.drawdamage(ctx, that.health / that.maxhealth);
    };
    
    that.tick = that.healtick;
    
    return that;
  };
  
  // A dirt tile that has been dug
  tile.dug = function(args) {
    var that = tile(args);
    that.diggable = false;
    
    that.draw = function(ctx) {
      ctx.fillStyle('rgb(40, 15, 0)');
      ctx.fillRect(0, 0, tile.tilesize, tile.tilesize + 1);
    };
    
    return that;
  };
  
  global.tile = tile;
  
})(window, jQuery)
