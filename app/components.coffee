# Mixins that can be invoked on objects in the game to give them new
# capabilities.

loki.define('actions', (env) ->
  actionmanager = env.actionmanager
  
  loki.modules.components = (env) ->
    # Makes this thing susceptible to damage.
    env.damageable = (thing, args) ->
      if typeof args.health != 'number'
        console.error('args.health required!')
      thing.health = args.health
      thing.maxhealth = args.health
      # Is this some thing that should have its velocity affected
      # by damage?
      if typeof thing.vel == 'object'
        thing.damage = (amt, fromright) ->
           thing.health -= amt
           velxfactor = if fromright then -1 else 1
           thing.vel.x = -2 * velxfactor
           thing.vel.y = -4
           if typeof args.whendamaged == 'function'
             args.whendamaged(amt)
      else
        thing.damage = (amt) ->
          thing.health -= amt
          if typeof args.whendamaged == 'function'
            args.whendamaged(amt)

    env.actionable = (thing) ->
      am = actionmanager()
      
      thing.addaction = (action) ->
        am.add(action)
      
      thing.executeactions = (args...) ->
        am.execute.apply(am, args)
)