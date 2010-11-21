// graphics.js
//
//

(function(global, $) {
  
  loki.define('assets', function(env) {
    var spritemanager = env.spritemanager;
    
    loki.modules.graphics = function(env) {
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