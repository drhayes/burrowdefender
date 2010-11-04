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
    
    that.strokeStyle = function(stroke) {
      ctx.strokeStyle = stroke;
    }
    
    that.lineWidth = function(width) {
      ctx.lineWidth = width;
    }
    
    that.font = function(f) {
      ctx.font = f;
    }
    
    that.fillRect = function(x, y, w, h) {
      ctx.fillRect(Math.round(x + that.offset.x), Math.round(y + that.offset.y), Math.round(w), Math.round(h));
    };
    
    that.strokeRect = function(x, y, w, h) {
      ctx.strokeRect(Math.round(x + that.offset.x), Math.round(y + that.offset.y), Math.round(w), Math.round(h));
    }
    
    that.drawImage = function(img, x, y) {
      ctx.drawImage(img, Math.round(x + that.offset.x), Math.round(y + that.offset.y));
    };
    
    that.fillText = function(t, x, y, w) {
      ctx.fillText(t, Math.round(x + that.offset.x), Math.round(y + that.offset.y), Math.round(w));
    }
    
    that.measureText = function(text) {
      return ctx.measureText(text);
    }
    
    return that;
  };
  
  global.drawcontext = drawcontext;
  
})(this, jQuery)