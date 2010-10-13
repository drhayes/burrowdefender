// tile.js
//
// The thing a player and mobs walk on top of. Tend not to move.
// Holy flyweight pattern, Batman! Each individual tile is not
// instantiated per tile in the map; each tile type is created once
// and stored in the map as a reference to the same object each time.

(function(global, $) {
  
  var dirtimage = new Image();
  dirtimage.src = 'assets/images/dirt.png'
  var grassimage = new Image();
  grassimage.src = 'assets/images/grass.png'
  
  var Tile = function() {
    this.draw = function(x, y, ctx) {
      // this version doesn't do anything
    };
  };
  
  // Tiles are square with this length on a side.
  Tile.tilesize = 32;
  
  // Given an x,y in worldspace returns an {x,y} position in tilespace.
  Tile.totilepos = function(x, y) {
    return {
      x: Math.floor(x/Tile.tilesize),
      y: Math.floor(y/Tile.tilesize)
    };
  };
  
  // Default tile (meant to be used by ref by everybody) that fills the
  // map at first.
  Tile.Air = new Tile();
  Tile.Air.diggable = false;
  Tile.Air.draw = function(x, y, ctx) {
    ctx.fillStyle = 'rgb(0, 128, 255)';
    ctx.fillRect(x, y, Tile.tilesize, Tile.tilesize + 1);
  }

  // The other really common tile.
  Tile.Dirt = new Tile();
  Tile.Dirt.diggable = true;
  Tile.Dirt.health = 20;
  Tile.Dirt.draw = function(x, y, ctx) {
    ctx.fillStyle = 'rgb(102,51,0)';
    ctx.fillRect(x, Tile.tilesize + y - 2, Tile.tilesize, 3);
    ctx.drawImage(dirtimage, x, y);
  }
  
  // The common tile, but on the surface with grass
  Tile.DirtWithGrass = new Tile();
  Tile.DirtWithGrass.diggable = true;
  Tile.DirtWithGrass.health = 20;
  Tile.DirtWithGrass.draw = function(x, y, ctx) {
    Tile.Dirt.draw(x, y, ctx);
    ctx.drawImage(grassimage, x, y);
    var oldFillStyle = ctx.fillStyle;
  }
  
  // A dirt tile that has been dug
  Tile.DirtDug = new Tile();
  Tile.DirtDug.diggable = false;
  Tile.DirtDug.draw = function(x, y, ctx) {
    ctx.fillStyle = 'rgb(40, 15, 0)';
    ctx.fillRect(x, y, Tile.tilesize, Tile.tilesize + 1);
  };
  
  global.Tile = Tile;
  
})(window, jQuery)
