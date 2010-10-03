// spatialhash.js
//
// Keeps track of what we should check collisions against by partitioning
// worldspace into a grid. Every object that intersects any cell is added to
// a list corresponding to that cell.
// Takes world coordinates and converts it to an internal representation.
//
// Depends: tile.js

(function(global, $) {

  var cellsize = Tile.tilesize * 2;

  var SpatialHash = function() {
    this.spacemap = {};
    
    this.makekey = function(x, y) {
      var kx = Math.floor(x / cellsize);
      var ky = Math.floor(y / cellsize);
      return kx + ':' + ky;
    };
    
    // Given in world coordinates.
    this.get = function(x, y) {
      var key = this.makekey(x, y);
      if (key in this.spacemap) {
        return this.spacemap[key];
      }
      return [];
    };
    
    this.set = function(x, y, o) {
      var key = this.makekey(x, y);
      if (key in this.spacemap) {
        this.spacemap[key].push(o);
      }
      else {
        this.spacemap[key] = [o];
      }
    };
  };

  global.SpatialHash = SpatialHash;

})(window, jQuery)