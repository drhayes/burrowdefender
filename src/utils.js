// utils.js
//
// Utility functions.

(function(global, $) {
  
  window.utils = {
    collide: function(rect1, rect2) {
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
    },
    intersect: function(a1, a2, b1, b2) {
      if (a2 < b1) {
        return false;
      }
      if (a1 > b2) {
        return false;
      }
      return true;
    }
  }
  
})(window, jQuery)