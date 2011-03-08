(function() {
  loki.modules.tileutils = function(env) {
    env.tilesize = 32;
    return env.totilepos = function(x, y) {
      return {
        x: Math.floor(x / env.tilesize),
        y: Math.floor(y / env.tilesize)
      };
    };
  };
}).call(this);
