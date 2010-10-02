// tile.js
//
// The thing a player and mobs walk on top of. Tend not to move.

(function(global, $) {
  
  var Tile = function() {
  };
  
  // Default tile (meant to be used by ref by everybody) that fills the
  // map at first.
  Tile.AirTile = new Tile();
  
  global.Tile = Tile;
  
})(window, jQuery)