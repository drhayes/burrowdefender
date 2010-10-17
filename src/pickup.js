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

})(window, jQuery)