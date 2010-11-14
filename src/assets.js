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
      // for testing only!
      reset: function() {
        toload = [];
        loaded = false;
        images = {};
      }
    };
  }())
  
  loki.modules.assets = function(env) {
    // the single imagemanager
    env.imagemanager = im;
  }
  
}(this, jQuery));