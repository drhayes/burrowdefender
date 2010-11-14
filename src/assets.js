// assets.js
//
// Everything concerned with loading and using images and sounds. Additionally,
// each of the managers in this module are singletons instantiated at import.

(function(global, $) {
  
  var im = (function() {
    var toload = [],
      loaded = false,
      images = {};
    return {
      // adds an image to the image manager. once the images are loaded, adding
      // another image is an error.
      add: function(name, src) {
        if (loaded) {
          throw {
            error: 'Adding after load'
          };
        };
        toload.push({
          name: name,
          src: src
        });
      },
      // loads all the added images at once
      load: function() {
        var load, img;
        loaded = true;
        var i = toload.length;
        while (i--) {
          load = toload[i];
          img = new Image();
          img.src = load.src;
          images[load.name] = img;
        }
      },
      // draw a named loaded image
      draw: function(ctx, name, x, y) {
        if (!loaded) {
          throw {
            error: 'Cannot draw before load'
          }
        }
        ctx.drawImage(images[name], x, y);
      },
      get: function(name) {
        return images[name];
      },
      // for testing only!
      reset: function() {
        toload = [];
        loaded = false;
        images = {};
      }
    };
  }());
  
  var sm = (function() {
    var sprites = {};
    return {
      add: function(name, size, frames) {
        var img = im.get(name);
        var sprite = {
          image: img,
          size: size,
          frames: frames
        };
        sprites[name] = sprite;
      },
      draw: function(ctx, name, frame, x, y) {
        var sprite = sprites[name];
        var frame = sprite.frames[frame];
        ctx.drawImage(sprite.image, frame.x, frame.y, sprite.size.x, sprite.size.y, x, y, sprite.size.x, sprite.size.y);
      },
      reset: function() {
        sprites = {};
      }
    }
  }());
  
  loki.modules.assets = function(env) {
    // the single imagemanager
    env.imagemanager = im;
    
    // the single spritemanager
    env.spritemanager = sm;
  }
  
}(this, jQuery));