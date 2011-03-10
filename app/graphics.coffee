# Objects responsible for animation sequences and such.

loki.define('assets', (env) ->
  spritemanager = env.spritemanager
  
  loki.modules.graphics = (env) ->
    # Run the following frames in sequence.
    env.sequence = (frames) ->
      index = 0
      return (ctx, name, x, y) ->
        spritemanager.draw(ctx, name, frames[index], x, y)
        index += 1
        if index == frames.length
          index = 0
          true
        else
          false
    
    # Repeat the given frames some number of times randomly chosen between
    # lo inclusive and hi exclusive.
    env.repeater = (frames, lo, hi) ->
      target = null
      choosetarget = ->
        if hi?
          target = Math.floor(Math.random() * (hi - lo)) + lo
        else
          target = lo

      choosetarget()
      count = 0
      return (ctx, name, x, y) ->
        spritemanager.draw(ctx, name, 0, x, y)
        count += 1
        if count == target
          choosetarget()
          count = 0
          true
        else
          false
    
    # Assumes the given image is in the spritemanager.
    # Args:
    # - name: name of the sprite to use
    # - frames: array of indices into the frames of the sprite
    env.animation = (args) ->
      that = {
        frameindex: 0
      }
      
      frameslength = args.frames.length
      currentframe = args.frames[0]
      
      that.draw = (ctx, x, y) ->
        advance = true
        currentframe = args.frames[that.frameindex]
        if _.isFunction(currentframe)
          advance = currentframe(ctx, args.name, x, y)
        else
          spritemanager.draw(ctx, args.name, currentframe, x, y)
        
        that.frameindex = (that.frameindex + 1) % frameslength if advance
      
      return that
)
