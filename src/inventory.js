// inventory.js
//
// Tracks what the player is carrying.

(function(global, $) {
  
  // maintains a 1-based map of things the player is carrying. this maps neatly
  // to the scheme of getting the player to press number keys to specify
  // a particular spot in the player's inventory.
  var inventory = function(options) {
    var that = {};
    
    that.things = {};
    
    var thingtospotmap = {};
    var nextindex = 1;
    
    // thing is a constant representing something that can be picked up in
    // the game world. add will find the first available inventory slot
    // for this type of thing and will add it to the count found there.
    that.add = function(thing) {
      // find the index for this thing
      if (!thingtospotmap.hasOwnProperty(thing)) {
        // this must be a string
        thingtospotmap[thing] = '' + nextindex;
        nextindex++;
      }
      var spot = thingtospotmap[thing];
      if (!that.things.hasOwnProperty(spot)) {
        that.things[spot] = {
          type: thing,
          count: 0
        };
      };
      that.things[spot].count += 1;
    };
    
    that.draw = function(drawthing) {
      drawthing.hud.push(function(ctx) {
        ctx.fillStyle('hsla(120, 0%, 0%, 0.5)');
        ctx.fillRect(50, 0, 500, 100);
      });
    };
    
    return that;
  };
  
  global.inventory = inventory;
  
})(window, jQuery);