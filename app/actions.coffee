# Framework for all things actiony.

loki.define('utils', (env) ->
  pqueue = env.pqueue
  
  loki.modules.actions = (env) ->
    env.action = () ->
      that = {}
      that.priority = 0
      that.completed = false
      that.interrupt = false
      that.tick = () -> null
      that.candoboth = (action) -> action != that
      that
    
    env.actionmanager = () ->
      that = {}
      active = pqueue()
      queue = pqueue()
      
      that.add = (action) ->
        queue.push(action)
        
      that.execute = (funcname = 'tick', args...) ->
        offset = 0
        # Do we have any interrupts?
        interrupt = _.detect(queue, (action) -> action.interrupt)
        if interrupt?
          # Dump the active actions and run this one now.
          active = pqueue()
          active.push(interrupt)
          # Remove from the current queue as well
          queue = _.reject(queue, (a) -> a == interrupt)
        
        queuecopy = queue.slice(0)
        
        for action in queuecopy
          # Can this action combine with the actives?
          canaddit = _.reduce(active, ((canaddit, a) ->
            canaddit and a.candoboth(action)), true)
          # If it can't be combined, skip it for now.
          if not canaddit
            continue
          # Remove from the queue and add to active.
          queue = _.reject(queue, (a) -> a == action )
          active.push(action)
        
        # Remove completed actions.
        active = _.reject(active, (action) -> action.completed)
        
        # Run the active actions.
        _.each(active, (a) ->
          if a.hasOwnProperty(funcname)
            a[funcname].apply(a, args)
          )
        
      that
)
