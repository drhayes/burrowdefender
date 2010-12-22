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
          if (index === frames.length) {
            index = 0;
            return true;
          }
          return false;
        }
      };

      // repeat the given frames some number of times randomly chosen between
      // lo inclusive and hi exclusive.
      env.repeater = function(frames, lo, hi) {
        var choosetarget = function() {
          target = hi ? Math.floor(Math.random() * (hi - lo)) + lo : lo;
        }
        var target;
        choosetarget();
        var count = 0;
        return function(ctx, name, x, y) {
          spritemanager.draw(ctx, name, 0, x, y);
          count += 1;
          if (count === target) {
            choosetarget();
            count = 0;
            return true;
          }
          return false;
        }
      };

      // assumes the given image is in the spritemanager.
      // args:
      // * name - name of the sprite to use
      // * frames - array of indices into the frames of the sprite
      env.animation = function(args) {
        var that = {}
        that.frameindex = 0;
        
        var frameslength = args.frames.length;
        var currentframe = args.frames[0];

        that.draw = function(ctx, x, y) {
          var advance = true;
          currentframe = args.frames[that.frameindex];
          if (typeof currentframe === 'function') {
            advance = currentframe(ctx, args.name, x, y);
          }
          else {
            spritemanager.draw(ctx, args.name, currentframe, x, y);
          }
          if (advance) {
            that.frameindex = (that.frameindex + 1) % frameslength;
          }
        }

        return that;
      }; // animation
    }
  })
  
}(this, jQuery));