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
    
    that.add = function(thing) {
      // find the index for this thing
      var index = 1;
      var key = '' + thing;
      for (var i = 1; i <= MAXITEMS; i++) {
        if (!that.things.hasOwnProperty(i) || that.things[i].key === key) {
          index = i;
          break;
        }
      }
      if (!that.things.hasOwnProperty(index)) {
        that.things[index] = {
          key: key,
          instance: thing,
          count: 0
        };
      };
      that.things[index].count += 1;
    };
    
    that.getsel = function() {
      var t = that.things[that.sel];
      if (!t || t.count === 0) {
        return null;
      }
      return t.instance;
    }
    
    that.dropsel = function() {
      var t = that.things[that.sel];
      if (typeof t === 'undefined') {
        return null;
      };
      t.count--;
      if (t.count === 0) {
        // if we're out at that slot, remove the counter object...
        delete that.things[that.sel];
      }
      return t.instance;
    }
    
    that.draw = function(drawthing) {
      drawthing.hud.push(function(ctx) {
        // draw the background
        ctx.fillStyle('hsla(120, 0%, 0%, 0.3)');
        ctx.fillRect(that.x1, that.y1, WIDTH, HEIGHT);
        // draw the itemrects...
        ctx.strokeStyle();
        ctx.lineWidth(2);
        ctx.fillStyle('hsla(120, 100%, 100%, 1.0)');
        ctx.font('15px Impact');
        var unselstyle = 'hsla(120, 10%, 50%, 0.6)';
        var selstyle = 'hsla(120, 80%, 50%, 0.6)';
        for (var i = 1; i <= 8; i++) {
          ctx.strokeStyle(i === that.sel ? selstyle : unselstyle);
          var r = that.itemrect(i);
          ctx.strokeRect(r.x1, r.y1, r.x2 - r.x1, r.y2 - r.y1);
          // now draw the icon, if we have one...
          if (that.things.hasOwnProperty(i)) {
            var oldoffset = ctx.offset;
            var invitem = that.things[i];
            var drawimage = invitem.instance.drawimage;
            ctx.offset = {
              x: ctx.offset.x + r.x1 + (r.width / 2) - 8,
              y: ctx.offset.y + r.y1 + (r.height / 2) - 16,
            }
            drawimage(ctx);
            // how many do we have? and center that text
            var countstr = '' + invitem.count;
            var textwidth = ctx.measureText(countstr);
            ctx.fillText(countstr, -(textwidth.width / 2) + 7, 32);
            ctx.offset = oldoffset;
          }
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
      var rect = {
        x1: startx + PADDING,
        y1: that.y1 + PADDING,
        x2: startx + peritemwidth - PADDING,
        y2: that.y2 - PADDING,
      };
      rect.width = rect.x2 - rect.x1;
      rect.height = rect.y2 - rect.y1;
      return rect;
    };
    
    return that;
  };
  
  global.inventory = inventory;
  
})(window, jQuery);