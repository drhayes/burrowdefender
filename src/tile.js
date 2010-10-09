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

  // The other really common tile.
  Tile.Dirt = new Tile();
  Tile.Dirt.draw = function(x, y, ctx) {
    var oldFillStyle = ctx.fillStyle;
    ctx.fillStyle = 'rgb(102,51,0)';
    ctx.fillRect(x, Tile.tilesize + y - 2, Tile.tilesize, 3);
    ctx.fillStyle = oldFillStyle;
    ctx.drawImage(dirtimage, x, y);
  }
  
  // The common tile, but on the surface with grass
  Tile.DirtWithGrass = new Tile();
  Tile.DirtWithGrass.draw = function(x, y, ctx) {
    Tile.Dirt.draw(x, y, ctx);
    ctx.drawImage(grassimage, x, y);
    var oldFillStyle = ctx.fillStyle;
  }
  
  global.Tile = Tile;
  
})(window, jQuery)
