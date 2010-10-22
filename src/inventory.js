// inventory.js
//
// Tracks what the player is carrying.

(function(global, $) {
  
  var PADDING = 5;
  var CANVAS_WIDTH = 600;
  var CANVAS_HEIGHT = 500;
  var WIDTH = CANVAS_WIDTH - PADDING * 2;
  var HEIGHT = 50;
  var MAXITEMS = 8;
  
  // maintains a 1-based map of things the player is carrying. this maps neatly
  // to the scheme of getting the player to press number keys to specify
  // a particular spot in the player's inventory.
  var inventory = function(options) {
    var that = {};
    that.x1 = PADDING;
    that.y1 = CANVAS_HEIGHT - PADDING - HEIGHT;
    that.x2 = PADDING + WIDTH;
    that.y2 = CANVAS_HEIGHT - PADDING;
    that.things = {};
    that.sel = 1;
    
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
        // draw the background
        ctx.fillStyle('hsla(120, 0%, 0%, 0.3)');
        ctx.fillRect(that.x1, that.y1, WIDTH, HEIGHT);
        // draw the itemrects...
        ctx.strokeStyle();
        ctx.lineWidth(2);
        var unselstyle = 'hsla(120, 10%, 50%, 0.6)';
        var selstyle = 'hsla(120, 80%, 50%, 0.6)';
        for (var i = 1; i <= 8; i++) {
          ctx.strokeStyle(i === that.sel ? selstyle : unselstyle);
          var r = that.itemrect(i);
          ctx.strokeRect(r.x1, r.y1, r.x2 - r.x1, r.y2 - r.y1);
        }
      });
    };
    
    // for the ith item, return a rectangle of the space it occupies when
    // drawing it. items are currently 16x16 so this should be bigger...
    // this is 1-based, just like the inventory.
    that.itemrect = function(i) {
      i = i - 1;
      var peritemwidth = (WIDTH - PADDING * 2) / MAXITEMS;
      var startx = that.x1 + PADDING + peritemwidth * i;
      return {
        x1: startx + PADDING,
        y1: that.y1 + PADDING,
        x2: startx + peritemwidth - PADDING,
        y2: that.y2 - PADDING
      };
    };
    
    return that;
  };
  
  global.inventory = inventory;
  
})(window, jQuery);