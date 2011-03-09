(function() {
  var __slice = Array.prototype.slice;
  loki.define('actions', function(env) {
    var actionmanager;
    actionmanager = env.actionmanager;
    return loki.modules.components = function(env) {
      env.damageable = function(thing, args) {
        if (typeof args.health !== 'number') {
          console.error('args.health required!');
        }
        thing.health = args.health;
        thing.maxhealth = args.health;
        if (typeof thing.vel === 'object') {
          return thing.damage = function(amt, fromright) {
            var velxfactor;
            thing.health -= amt;
            velxfactor = fromright ? -1 : 1;
            thing.vel.x = -2 * velxfactor;
            thing.vel.y = -4;
            if (typeof args.whendamaged === 'function') {
              return args.whendamaged(amt);
            }
          };
        } else {
          return thing.damage = function(amt) {
            thing.health -= amt;
            if (typeof args.whendamaged === 'function') {
              return args.whendamaged(amt);
            }
          };
        }
      };
      return env.actionable = function(thing) {
        var am;
        am = actionmanager();
        thing.addaction = function(action) {
          return am.add(action);
        };
        return thing.executeactions = function() {
          var args;
          args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
          return am.execute.apply(am, args);
        };
      };
    };
  });
}).call(this);
