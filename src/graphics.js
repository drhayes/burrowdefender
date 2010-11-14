// graphics.js
//
//

(function(global, $) {
  
  loki.modules.graphics = function(env) {
    // Replaces the 2d context from canvas and allows sprites and tiles and things
    // to draw themselves without having to account for where they are in the
    // canvas. The game object does that. And this thing handles it.
    env.drawcontext = function(ctx) {
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
        var args = Array.prototype.slice.call(arguments);
        if (args.length === 3) {
          ctx.drawImage(args[0], Math.round(args[1] + that.offset.x), Math.round(args[2] + that.offset.y));
        }
        else if (args.length === 9) {
          ctx.drawImage(args[0], args[1], args[2], args[3], args[4], Math.round(args[5] + offset.x),
            Math.round(args[6] + offset.y), args[7], args[8]);
        }
      };

      that.fillText = function(t, x, y, w) {
        ctx.fillText(t, Math.round(x + that.offset.x), Math.round(y + that.offset.y), Math.round(w));
      }

      that.measureText = function(text) {
        return ctx.measureText(text);
      }

      return that;
    }; // drawcontext
  }
  
}(this, jQuery));