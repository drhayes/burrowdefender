// graphics.js
//
//

(function(global, $) {
  
  loki.define('assets', function(env) {
    var spritemanager = env.spritemanager;
    
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
        
        that.beginPath = function() {
          ctx.beginPath();
        };
        
        that.closePath = function() {
          ctx.closePath();
        };
        
        that.moveTo = function(x, y) {
          ctx.moveTo(x + that.offset.x, y + that.offset.y);
        };
        
        that.lineTo = function(x, y) {
          ctx.lineTo(x + that.offset.x, y + that.offset.y);
        }
        
        that.stroke = function() {
          ctx.stroke();
        };
        
        that.fill = function() {
          ctx.fill();
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

        that.drawImage = function() {
          var args = Array.prototype.slice.call(arguments);
          if (args.length === 3) {
            ctx.drawImage(args[0], Math.round(args[1] + that.offset.x), Math.round(args[2] + that.offset.y));
          }
          else if (args.length === 9) {
            ctx.drawImage(args[0], args[1], args[2], args[3], args[4], Math.round(args[5] + that.offset.x),
              Math.round(args[6] + that.offset.y), args[7], args[8]);
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

      // assumes the given image is in the spritemanager.
      // args:
      // * name - name of the sprite to use
      // * frames - array of indices into the frames of the sprite
      env.animation = function(args) {
        var that = {}
        that.currentframe = 0;
        
        var frameslength = args.frames.length;

        that.draw = function(ctx, x, y) {
          spritemanager.draw(ctx, args.name, args.frames[that.currentframe], x, y);
          that.currentframe = (that.currentframe + 1) % frameslength;
        }

        return that;
      }; // animation
    }
  })
  
}(this, jQuery));