// item.js
//
// Things that go in inventory and are contained in pickups.

(function(global, $) {

  var dirtitemimage = new Image();
  dirtitemimage.src = 'assets/images/dirtitem.png';

  var item = function(options) {
    var that = {};
    that.type = options.type;

    that.drawimage = function(ctx) {
      // this version does nothing...
    };
    
    // called when this item is placed back in the world... x,y is given
    // in world coordinates
    that.place = function(x, y) {
      
    };

    return that;
  };

  item.types = {
    DIRT: '1'
  };

  item.dirtitem = function() {
    var that = item({
      type: item.types.DIRT
    });
    
    that.drawimage = function(ctx) {
      ctx.drawImage(dirtitemimage, 0, 0);
    };
    
    that.place = function(x, y) {
      
    };
    
    return that;
  };

  global.item = item;

})(window, jQuery)