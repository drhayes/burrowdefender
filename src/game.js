// game.js
//
// The object that handles everthing about showing the game.
//
// Depends: on everything else...

(function(global, $) {
  
  var Game = function(canvasid) {
    this.canvas = $(canvasid)[0];
    this.ctx = this.canvas.getContext('2d');
    this.width = this.canvas.width;
    this.height = this.canvas.height;
  };
  
  global.Game = Game;
  
})(window, jQuery)