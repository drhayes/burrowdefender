// drawcontext.js
//
// Replaces the 2d context from canvas and allows sprites and tiles and things
// to draw themselves without having to account for where they are in the
// canvas. The game object does that. And this thing handles it.

(function(global, $) {
  
  var drawcontext = function(ctx) {
    var that = {};
    that.offset = {
      x: 0,
      y: 0
    };
    
    that.fillStyle = function(fill) {
      ctx.fillStyle = fill;
    };
    
    that.fillRect = function(x, y, w, h) {
      ctx.fillRect(x + that.offset.x, y + that.offset.y, w, h);
    };
    
    that.drawImage = function(img, x, y) {
      ctx.drawImage(img, x + that.offset.x, y + that.offset.y);
    };
    
    return that;
  };
  
  global.drawcontext = drawcontext;
  
})(window, jQuery)