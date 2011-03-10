(function() {
  loki.define('assets', function(env) {
    var spritemanager;
    spritemanager = env.spritemanager;
    return loki.modules.graphics = function(env) {
      env.sequence = function(frames) {
        var index;
        index = 0;
        return function(ctx, name, x, y) {
          spritemanager.draw(ctx, name, frames[index], x, y);
          index += 1;
          if (index === frames.length) {
            index = 0;
            return true;
          } else {
            return false;
          }
        };
      };
      env.repeater = function(frames, lo, hi) {
        var choosetarget, count, target;
        target = null;
        choosetarget = function() {
          if (hi != null) {
            return target = Math.floor(Math.random() * (hi - lo)) + lo;
          } else {
            return target = lo;
          }
        };
        choosetarget();
        count = 0;
        return function(ctx, name, x, y) {
          spritemanager.draw(ctx, name, 0, x, y);
          count += 1;
          if (count === target) {
            choosetarget();
            count = 0;
            return true;
          } else {
            return false;
          }
        };
      };
      return env.animation = function(args) {
        var currentframe, frameslength, that;
        that = {
          frameindex: 0
        };
        frameslength = args.frames.length;
        currentframe = args.frames[0];
        that.draw = function(ctx, x, y) {
          var advance;
          advance = true;
          currentframe = args.frames[that.frameindex];
          if (_.isFunction(currentframe)) {
            advance = currentframe(ctx, args.name, x, y);
          } else {
            spritemanager.draw(ctx, args.name, currentframe, x, y);
          }
          if (advance) {
            return that.frameindex = (that.frameindex + 1) % frameslength;
          }
        };
        return that;
      };
    };
  });
}).call(this);
