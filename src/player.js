// player.js
//
// The player. Y'know, of the game.
//
// Depends: Mob, KeyboardManager, Tile

(function(global, $) {
  
  var Player = function() {
  };
  
  Player.prototype = new Mob({
		x: 0,
		y: -200,
		size: {
			x: 16,
			y: 20
		},
		vel: {
			x: 0,
			y: 0,
		}
	});
  Player.constructor = Player;
  
  global.Player = Player;
  
})(window, jQuery)