// spatialhash.js
//
// Keeps track of what we should check collisions against by partitioning
// worldspace into a grid. Every object that intersects any cell is added to
// a list corresponding to that cell.

(function(global, $) {

  var SpatialHash = function() {
    
  };

  window.SpatialHash = SpatialHash;

})(window, jQuery)