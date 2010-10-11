// player.js
//
// The player. Y'know, of the game.
//
// Depends: Mob, KeyboardManager, Tile

(function(global, $) {
  
  var Player = function(game) {
    this.draw = function(ctx) {
			ctx.fillStyle = 'rgb(0, 0, 0)';
			// draw a little bigger than player size so player is standing on ground
			ctx.fillRect(game.playeroffset.x, game.playeroffset.y, this.size.x + 1, this.size.y + 1);
    };
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