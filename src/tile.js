// tile.js
//
// The thing a player and mobs walk on top of. Tend not to move.

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
  
  var Tile = function() {
    this.diggable = true;
    this.draw = function(x, y, ctx) {
      // this version doesn't do anything
    };
    
    this.mine = function(digger, x, y) {
      if (!this.diggable) {
        return;
      }
  	  this.health -= digger.minedamage;
  	  this.lasthealed = null;
  	  if (this.health <= 0) {
  	    this.kill(x, y);
  	  }
    };
    
    // remove the tile from the tile map and the spatialhash
    // and replace in tilemap with dug tile
    this.kill = function(x, y) {
      this.game.tilemap.set(x, y, new Tile.Dug());
      this.game.spatialhash.remove(Tile.getrect(x, y));
    };
  };
  
  // Tiles are square with this length on a side.
  Tile.tilesize = 32;
  
  // Draw the tile damage tiles
  Tile.drawdamage = function(x, y, ctx, percentage) {
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
    ctx.drawImage(image, x, y);
  };
  
  // Given an x,y in worldspace returns an {x,y} position in tilespace.
  Tile.totilepos = function(x, y) {
    return {
      x: Math.floor(x/Tile.tilesize),
      y: Math.floor(y/Tile.tilesize)
    };
  };
  
  // given a position in tilespace, return the rect in world space
  Tile.getrect = function(x, y) {
    return {
      x1: x * Tile.tilesize,
      y1: y * Tile.tilesize,
      x2: (x + 1) * Tile.tilesize - 1,
      y2: (y + 1) * Tile.tilesize - 1
    };
  }

  Tile.healtick = function() {
    if (this.health === this.maxhealth) {
      return;
    }
    if (!this.lasthealed) {
      this.lasthealed = new Date().getTime();
    };
    var currenttime = new Date().getTime();
    if (currenttime - this.lasthealed >= 750) {
      this.health += 1;
    };
    if (this.health >= this.maxhealth) {
      this.lasthealed = null;
    };
  };
  
  // Default tile (meant to be used by ref by everybody) that fills the
  // map at first.
  Tile.Air = function() {
    this.diggable = false;
    
    this.draw = function(x, y, ctx) {
      ctx.fillStyle = 'rgb(0, 128, 255)';
      ctx.fillRect(x, y, Tile.tilesize, Tile.tilesize + 1);
    };
  };
  Tile.Air.prototype = new Tile();

  // The other really common tile.
  Tile.Dirt = function(game) {
    this.game = game;
    this.health = 20;
    this.maxhealth = 20;
    
    this.draw = function(x, y, ctx) {
      ctx.fillStyle = 'rgb(102,51,0)';
      ctx.fillRect(x, Tile.tilesize + y - 2, Tile.tilesize, 3);
      ctx.drawImage(dirtimage, x, y);
      Tile.drawdamage(x, y, ctx, this.health / this.maxhealth);
    };
    
    this.tick = Tile.healtick;
  };
  Tile.Dirt.prototype = new Tile();
  
  // The common tile, but on the surface with grass
  Tile.DirtWithGrass = function(game) {
    this.game = game;
    this.health = 20;
    this.maxhealth = 20;
    
    this.draw = function(x, y, ctx) {
      Tile.DirtWithGrass.prototype.draw.call(this, x, y, ctx);
      ctx.drawImage(grassimage, x, y);
      Tile.drawdamage(x, y, ctx, this.health / this.maxhealth);
    };
    
    this.tick = Tile.healtick;
  };
  Tile.DirtWithGrass.prototype = new Tile.Dirt();
  
  // A dirt tile that has been dug
  Tile.Dug = function() {
    this.diggable = false;
    
    this.draw = function(x, y, ctx) {
      ctx.fillStyle = 'rgb(40, 15, 0)';
      ctx.fillRect(x, y, Tile.tilesize, Tile.tilesize + 1);
    };
  };
  Tile.Dug.prototype = new Tile();
  
  global.Tile = Tile;
  
})(window, jQuery)
