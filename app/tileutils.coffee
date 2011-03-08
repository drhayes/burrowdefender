# Utilities and constants that concern tiles.

loki.modules.tileutils = (env) ->
  env.tilesize = 32
  
  env.totilepos = (x, y) ->
    {
      x: Math.floor(x / env.tilesize)
      y: Math.floor(y / env.tilesize)
    }
