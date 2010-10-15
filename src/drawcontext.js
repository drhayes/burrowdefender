// drawcontext.js
//
// Replaces the 2d context from canvas and allows sprites and tiles and things
// to draw themselves without having to account for where they are in the
// canvas. The game object does that. And this thing handles it.

(function(global, $) {
  
  var DrawContext = function(ctx) {
    this.ctx = ctx;
    this.offset = {
      x: 0,
      y: 0
    };
    
    this.fillStyle = function(fill) {
      this.ctx.fillStyle = fill;
    };
    
    this.fillRect = function(x, y, w, h) {
      this.ctx.fillRect(x - this.offset.x, y - this.offset.y, w, h);
    };
    
    this.drawImage = function(img, x, y) {
      this.ctx.drawImage(img, x - this.offset.x, y - this.offset.y);
    };
  };
  
  global.DrawContext = DrawContext;
  
})(window, jQuery)