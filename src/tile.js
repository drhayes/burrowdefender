// tile.js
//
// The thing a player and mobs walk on top of. Tend not to move.
// Holy flyweight pattern, Batman! Each individual tile is not
// instantiated per tile in the map; each tile type is created once
// and stored in the map as a reference to the same object each time.

(function(global, $) {
  
  var Tile = function() {
  };
  
  // Default tile (meant to be used by ref by everybody) that fills the
  // map at first.
  Tile.Air = new Tile();
  
  global.Tile = Tile;
  
})(window, jQuery)
