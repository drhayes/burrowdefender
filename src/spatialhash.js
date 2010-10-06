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

  var makerawkey = function(x, y) {
    return x + ':' + y;
  }

  var makekey = function(x, y) {
    return makerawkey(keyscalar(x), keyscalar(y));
  };
  
  var SpatialHash = function() {
    this.spacemap = {};
    
    var innerget = function(key) {
      if (this.spacemap.hasOwnProperty(key)) {
        return this.spacemap[key];
      }
      return [];
    }

    this.iterate = function(r, func) {
      var kx1 = keyscalar(r.x1);
      var ky1 = keyscalar(r.y1);
      var kx2 = keyscalar(r.x2);
      var ky2 = keyscalar(r.y2);
      for (var i = kx1; i <= kx2; i++) {
        for (var j = ky1; j <= ky2; j++) {
          var key = makerawkey(i, j);
          func.apply(this, [key, r]);
        }
      }
    };

    // Given in world coordinates.
    this.get = function(r, vx, vy) {
      var things = [];
      var seenkeys = {};
      var addemup = function(key, r) {
        seenkeys[key] = true;
        things = things.concat(innerget.apply(this, [key]));
      };
      this.iterate(r, function(key, r) {
        addemup.apply(this, [key, r]);
      });
      // we must account for velocity
      var rv = {
        x1: r.x1 + vx,
        y1: r.y1 + vy,
        x2: r.x2 + vx,
        y2: r.y2 + vy
      };
      this.iterate(rv, function(key, r) {
        // dedupe on velocity check
        if (seenkeys.hasOwnProperty(key)) {
          return;
        }
        addemup.apply(this, [key, r]);
      })
      return things;
    };
    
    // Given a {x1,y1,x2,y2} rect, put it in the right place in the
    // spatial hash. If it's a big rect, let it span buckets in the hash.
    this.set = function(r) {
      this.iterate(r, function(key, r) {
        if (this.spacemap.hasOwnProperty(key)) {
          this.spacemap[key].push(r);
        }
        else {
          this.spacemap[key] = [r];
        }
      });
    };
    
    this.remove = function(r) {
      this.iterate(r, function(key, r) {
        if (this.spacemap.hasOwnProperty(key)) {
          var l = this.spacemap[key];
          var index = -1;
          for (var i = 0; i < l.length; i++) {
            if (l[i] === r) {
              index = i;
              break;
            }
          }
          if (index !== -1) {
            this.spacemap[key].splice(index, 1);
          }
        }
      });
    };
  };

  global.SpatialHash = SpatialHash;

})(window, jQuery)