// spatialhash.js
//
// Keeps track of what we should check collisions against by partitioning
// worldspace into a grid. Every object that intersects any cell is added to
// a list corresponding to that cell.
// Takes world coordinates converts it to an internal representation.
//
// Depends: tile.js

(function(global, $) {

  var cellsize = Tile.tilesize * 2;

  var SpatialHash = function() {
    this.spacemap = {};
    
    this.makekey = function() {
      
    };
    
    // Given in world coordinates.
    this.get = function(x, y) {
      return [];
    };
    
    this.set = function() {
      
    };
  };

  global.SpatialHash = SpatialHash;

})(window, jQuery)