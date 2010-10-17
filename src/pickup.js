// pickup.js
//
// Anything that can be picked up. Can only be picked up by things that have
// an inventory to be added to.
//
// Depends: mob.js

(function(global, $) {
  var Pickup = function(game) {
    this.game = game;
    var me = this;
    
    this.collide = function(collider) {
      if (!collider.inventory) {
        return;
      };
      collider.inventory.add(this);
      this.killed = true;
      // have to get the rect to remove from spatial hash
      this.updaterect();
      this.game.spatialhash.remove(this);
    };
    
    this.tick = Mob.gravitytick;
    
  };
  Pickup.prototype = new Mob();
  global.Pickup = Pickup;
  
  // let's define some pickups...
  
  var DirtPickup = function() {
    var me = this;

    this.draw = function(drawthing) {
      drawthing.sprite1.push(function(ctx) {
        ctx.fillStyle('rgb(255, 255, 255)');
        ctx.fillRect(me.x, me.y, me.size.x, me.size.y);
      });
    };
  };
  DirtPickup.prototype = new Pickup();
  global.DirtPickup = DirtPickup;

})(window, jQuery)