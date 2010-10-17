// pickup.js
//
// Anything that can be picked up. Can only be picked up by things that have
// an inventory to be added to.
//
// Depends: mob.js

(function(global, $) {
  var Pickup = function(game) {
    this.game = game;
    
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
    
  };
  Pickup.prototype = new Mob();
  global.Pickup = Pickup;
  
  // let's define some pickups...
  
  var DirtPickup = function() {
    this.draw = function(drawthing) {
      drawthing.sprite2.push(function(ctx) {
        ctx.fillStyle('rgb(192, 192, 192)');
        ctx.fillRect(0, 0, this.size.x, this.size.y);
      });
    };
  };
  DirtPickup.prototype = new Pickup();
  global.DirtPickup = DirtPickup;

})(window, jQuery)