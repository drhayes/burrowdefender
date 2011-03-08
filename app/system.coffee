# Things that update, things that fire events.

loki.modules.system = (env) ->
  env.updater = () ->
    that = {}
    that.processes = []
    that.currentFrame = 0
    
    that.add = (updateMe) ->
      if typeof updateMe != 'function'
        throw new Error('must pass in a function')
      if !updateMe.hasOwnProperty('frequency')
        updateMe.frequency = 1
      that.processes.push(updateMe)
    
    that.remove = (removeMe) ->
      that.processes = _.filter(that.processes, (p) -> p != removeMe)
    
    that.update = () ->
      _.each(that.processes, (process, index, list) ->
        if that.currentFrame % process.frequency == 0
          process()
        )
      that.currentFrame++
    
    that.start = () ->
      if !that.timer?
        update = () -> that.update()
        that.timer = setInterval(update, 20)
    
    that.stop = () ->
      if that.timer?
        clearTimeout(that.timer)
        delete(that.timer)
    
    that

  env.eventer = () ->
    that = {}
    subscribers = {}
    
    that.subscribe = (eventName, callback) ->
      callbacks = subscribers[eventName]
      if !callbacks?
        callbacks = []
      callbacks.push(callback)
      subscribers[eventName] = callbacks
    
    that.fire = (eventName, eventArg) ->
      callbacks = subscribers[eventName]
      if callbacks?
        _.each(callbacks, (callback, index, list) ->
          callback(eventArg)
        )
    
    that