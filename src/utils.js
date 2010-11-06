// utils.js
//
// Utility functions.

(function(global, $) {
  
  global.utils = {
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
    },
    // pass any object to this method and it will gain a damage method and
    // attributes suitable for tracking health
    damageable: function(thing, args) {
      if (typeof args.health !== 'number') {
        console.error('args.health required!');
      }
      thing.health = args.health;
      thing.maxhealth = args.health;
      // is this a something that should have its velocity affected by damage?
      if (typeof thing.vel === 'object') {
        thing.damage = function(amt, fromright) {
          thing.health -= amt;
          var velxfactor = fromright ? -1 : 1;
          thing.vel.x = -2 * velxfactor;
          thing.vel.y = -4;
          if (typeof args.whendamaged === 'function') {
            args.whendamaged(amt);
          }
        }
      }
      else {
        thing.damage = function(amt) {
          thing.health -= amt;
          if (typeof args.whendamaged === 'function') {
            args.whendamaged(amt);
          }
        }
      }
    }
  };
  
  // modify the Function prototype to provide rate-limiting for functions that
  // shouldn't actually run until some time limit has passed by.
  Function.prototype.ratelimit = function(interval) {
    var lastcalled = 0;
    var me = this;
    return function limiter() {
      var current = new Date().getTime();
      // force is in place for debugging purposes and is reset every call
      if (current - lastcalled >= interval || limiter.force) {
        limiter.force = false;
        lastcalled = current;
        return me.apply(me, arguments);
      }
    }
  };
  
})(this, jQuery)