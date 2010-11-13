// components.js
//
// The mixins that can be invoked on objects in the game to give them new
// capabilities.
//
// Depends: base.js

(function(global, $) {
  
  loki.modules.components = function(env) {
    env.damageable = function(thing, args) {
      if (typeof args.health !== 'number') {
        console.error('args.health required!');
      }
      thing.health = args.health;
      thing.maxhealth = args.health;
      // is this a something that should have its velocity affected by damage?
      if (typeof thing.vel === 'object') {
        thing.damage = function(amt, fromright) {
          thing.health -= amt;
          var velxfactor = fromright ? -1 : 1;
          thing.vel.x = -2 * velxfactor;
          thing.vel.y = -4;
          if (typeof args.whendamaged === 'function') {
            args.whendamaged(amt);
          }
        }
      }
      else {
        thing.damage = function(amt) {
          thing.health -= amt;
          if (typeof args.whendamaged === 'function') {
            args.whendamaged(amt);
          }
        }
      }
    }
  };
  
}(this, jQuery));