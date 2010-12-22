// graphics.js
//
//

(function(global, $) {
  
  loki.define('assets', function(env) {
    var spritemanager = env.spritemanager;
    
    loki.modules.graphics = function(env) {
      // run the following frames in sequence
      env.sequence = function(frames) {
        var index = 0;
        return function(ctx, name, x, y) {
          spritemanager.draw(ctx, name, frames[index], x, y);
          index += 1;
          return index === frames.length;
        }
      };

      // repeat the given frames some number of times randomly chosen between
      // lo inclusive and hi exclusive.
      env.repeater = function(frames, lo, hi) {
        var target = hi ? Math.floor(Math.random() * (hi - lo)) + lo : lo;
        var count = 0;
        return function(ctx, name, x, y) {
          spritemanager.draw(ctx, name, 0, x, y);
          count += 1;
          return (count === target);
        }
      };

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