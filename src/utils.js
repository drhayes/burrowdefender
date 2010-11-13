// utils.js
//
// Utility functions.
//
// Depends: base.js

(function(global, $) {
  
  loki.modules.utils = function(env) {
    env.collide = function(rect1, rect2) {
      if (rect1.y2 < rect2.y1) {
        return false;
      }
      if (rect1.y1 > rect2.y2) {
        return false;
      }
      if (rect1.x2 < rect2.x1) {
        return false;
      }
      if (rect1.x1 > rect2.x2) {
        return false;
      }
      return true;
    }
  }
  
  global.utils = {
    // pass any object to this method and it will gain a damage method and
    // attributes suitable for tracking health
    damageable: 
  };
  
})(this, jQuery)