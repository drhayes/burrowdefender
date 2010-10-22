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
    
    return that;
  };

  global.item = item;

})(window, jQuery)