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
  
  var spatialhash = function() {
    var that = {};
    that.spacemap = {};
    
    var innerget = function(key) {
      if (that.spacemap.hasOwnProperty(key)) {
        return that.spacemap[key];
      }
      return [];
    }

    that.iterate = function(r, func) {
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
    that.get = function(r, vx, vy) {
      var things = [];
      var seenkeys = {};
      var addemup = function(key, r) {
        seenkeys[key] = true;
        things = things.concat(innerget.apply(this, [key]));
      };
      that.iterate(r, function(key, r) {
        addemup.apply(this, [key, r]);
      });
      // we must account for velocity
      var rv = {
        x1: r.x1 + vx,
        y1: r.y1 + vy,
        x2: r.x2 + vx,
        y2: r.y2 + vy
      };
      that.iterate(rv, function(key, r) {
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
    that.set = function(r) {
      that.iterate(r, function(key, r) {
        if (that.spacemap.hasOwnProperty(key)) {
          that.spacemap[key].push(r);
        }
        else {
          that.spacemap[key] = [r];
        }
      });
    };
    
    that.remove = function(r) {
      that.iterate(r, function(key, r) {
        if (that.spacemap.hasOwnProperty(key)) {
          var l = that.spacemap[key];
          var index = -1;
          for (var i = 0; i < l.length; i++) {
            var checkrect = l[i];
            if (checkrect.x1 === r.x1 && checkrect.y1 === r.y1 &&
                checkrect.x2 === r.x2 && checkrect.y2 === r.y2) {
              index = i;
              break;
            }
          }
          if (index !== -1) {
            that.spacemap[key].splice(index, 1);
          }
        }
      });
    };
    
    return that;
  };

  global.spatialhash = spatialhash;

})(window, jQuery)