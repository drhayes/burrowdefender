# The base loki package and methods to define modules.
loki = {
  modules: {}
  define: (args...) ->
    env = {}
    callback = args.pop()
    modules = if args[0]? && typeof args[0] == 'string' then args[0] else args

    # Did the caller ask for any modules?
    if modules?
      if modules[0] == '*'
        modules = (module for own module in loki.modules)
    
    # Initialize the modules.
    for own modulename of modules
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

class Function
Function::ratelimit = (interval) ->
  lastcalled = 0
  limiter = (args...) ->    
    current = new Date().getTime()
    if current - lastcalled >= interval || limiter.force
      limiter.force = false;
      lastcalled = current
      return @apply(@, args)

# Expose this globally
@loki = loki
