// inventory.js
//
// Tracks what the player is carrying.

(function(global, $) {
  
  var inventory = function(options) {
    var that = {};
    
    that.things = {};
    
    // thing is a constant representing something that can be picked up in
    // the game world. add will find the first available inventory slot
    // for this type of thing and will add it to the count found there.
    that.add = function(thing) {
      if (!that.things.hasOwnProperty('0')) {
        that.things['0'] = {
          type: thing,
          count: 0
        };
      };
      that.things['0'].count += 1;
    };
    
    return that;
  };
  
  global.inventory = inventory;
  
})(window, jQuery);