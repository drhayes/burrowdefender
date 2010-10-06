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

  var keyscalar = function(x) {
    return Math.floor(x / cellsize);
  }

  var makekey = function(x, y) {
    return keyscalar(x) + ':' + keyscalar(y);
  };

  var SpatialHash = function() {
    this.spacemap = {};
    
    var innerget = function(x, y) {
      var key = makekey(x, y);
      if (this.spacemap.hasOwnProperty(key)) {
        return this.spacemap[key];
      }
      return [];
    }

    // Given in world coordinates.
    this.get = function(x, y, vx, vy) {
      var posresults = innerget.apply(this, [x, y]);
      // we must account for velocity, if any
      vx = vx || 0;
      vy = vy || 0;
      var velresults = [];
      if (vx !== 0 || vy !== 0) {
        velresults = innerget.apply(this, [x + vx, y + vy]);
      }
      return posresults.concat(velresults);
    };

    this.set = function(x, y, o) {
      var key = makekey(x, y);
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
        var key = makekey(x, y);
        this.spacemap[key].splice(index, 1);
      }
    };
  };

  global.SpatialHash = SpatialHash;

})(window, jQuery)