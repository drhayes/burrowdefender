// pickup.js
//
// Anything that can be picked up. Can only be picked up by things that have
// an inventory to be added to.
//
// Depends: mob.js

(function(global, $) {
  var pickup = function(args) {
    var that = mob(args);
    that.vel.y = -2;
    that.solid = false;
    
    that.collide = function(collider) {
      if (!collider.inventory) {
        return;
      };
      collider.inventory.add(this);
      that.killed = true;
      // have to get the rect to remove from spatial hash
      that.updaterect();
      args.game.spatialhash.remove(this);
    };
    
    that.tick = function() {
      mob.gravitytick.call(that);
    }
    
    return that;    
  };
  global.pickup = pickup;
  
  // let's define some pickups...
  
  var dirtpickup = function(args) {
    var that = pickup(args);

    that.draw = function(drawthing) {
      drawthing.sprite1.push(function(ctx) {
        ctx.fillStyle('rgb(255, 255, 255)');
        ctx.fillRect(that.x, that.y, that.size.x, that.size.y);
      });
    };
    
    return that;
  };
  global.dirtpickup = dirtpickup;

})(window, jQuery)