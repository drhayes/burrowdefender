// player.js
//
// The player. Y'know, of the game.
//
// Depends: Mob, KeyboardManager, Tile

(function(global, $) {
  
  var Player = function(options) {
    return new Mob(options);
  };
  
  global.Player = Player;
  
})(window, jQuery)