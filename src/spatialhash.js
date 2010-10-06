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
      if (this.spacemap.hasOwnProperty(key)) {
        return this.spacemap[key];
      }
      return [];
    };

    this.set = function(x, y, o) {
      var key = this.makekey(x, y);
      if (this.spacemap.hasOwnProperty(key)) {
        this.spacemap[key].push(o);
      }
      else {
        this.spacemap[key] = [o];
      }
    };

    this.remove = function(x, y, o) {
      var l = this.get(x, y);
      // find the element we're trying to remove
      var index = -1;
      for (var i = 0; i < l.length; i++) {
        if (l[i] === o) {
          index = i;
          break;
        }
      }
      if (index !== -1) {
        var key = this.makekey(x, y);
        this.spacemap[key].splice(index, 1);
      }
    };
  };

  global.SpatialHash = SpatialHash;

})(window, jQuery)