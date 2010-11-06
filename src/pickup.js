// pickup.js
//
// Anything that can be picked up. Can only be picked up by things that have
// an inventory to be added to.
//
// Depends: mob.js, item.js

(function(global, $) {
  var pickup = function(args) {
    var that = mob(args);
    that.vel.y = -2;
    that.solid = false;
    that.bounce = 0.63;
    that.created = new Date().getTime();
    that.taken = false;
    
    var pickupcollide = function(collider) {
      if (!collider.inventory) {
        return;
      };
      if (that.taken) {
        return;
      }
      that.taken = true;
      collider.inventory.add(args.item);
      that.killed = true;
      // have to get the rect to remove from spatial hash
      that.updaterect();
      args.game.spatialhash.remove(this);
      // stop colliding
      return true;
    };
    
    that.tick = function() {
      mob.gravitytick.call(that);
      // are we pickupable yet?
      if (new Date().getTime() - that.created > 300) {
        that.collide = pickupcollide;
      }
    };
    
    that.draw = function(drawthing) {
      drawthing.sprite1.push(function(ctx) {
        ctx.offset.x += that.x;
        ctx.offset.y += that.y;
        args.item.drawimage(ctx);
      });
    };
    
    return that;    
  };
  global.pickup = pickup;

})(this, jQuery)