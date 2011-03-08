# The base loki package and methods to define modules.
loki = {
  modules: {}
  define: (args...) ->
    env = {}
    callback = args.pop()
    modules = if args[0]? && typeof args[0] == 'string' then args else args[0]
    
    # Did the caller ask for any modules?
    if modules? and modules[0] == '*'
      modules = (module for own module of loki.modules)

    # Initialize the modules.
    if modules
      for modulename in modules
        if !loki.modules.hasOwnProperty(modulename)
          throw {
            name: 'Mission module'
            message: 'Trying to import module: ' + modulename
            toString: () -> @message
          }
        loki.modules[modulename](env)
      
    # Call the callback, we're done.
    callback(env)
}

Function::ratelimit = (interval) ->
  lastcalled = 0
  limiter = (args...) =>
    current = new Date().getTime()
    if current - lastcalled >= interval || limiter.force
      limiter.force = false;
      lastcalled = current
      return @apply(@, args)

# Expose this globally
@loki = loki
