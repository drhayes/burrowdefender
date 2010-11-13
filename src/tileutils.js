// tileutils.js
//
// Utilities and constants that concern tiles.

(function(global, $) {
  
  loki.modules.tileutils = function(env) {
    // Tiles are square. Measured in pixels.
    env.tilesize = 32;
    
    // Given an x,y in worldspace returns an {x,y} position in tilespace.
    env.totilepos = function(x, y) {
      return {
        x: Math.floor(x/env.tilesize),
        y: Math.floor(y/env.tilesize)
      };
    };
  }
  
}(this, jQuery));