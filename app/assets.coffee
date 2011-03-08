# Everything concerned with loading and using images and sounds.
# Additionally, each of the managers in this module are singletons
# instantiated at import.

toload = []
loaded = false
images = {}
image_counter = 0

# ImageManager singleton.
im = 
  # Adds an image to the image manager. Once the images are loaded, adding
  # another image is an error.  
  add: (name, src) ->
    if loaded
      throw {
        error: 'Adding after load'
      }
    toload.push({
      name: name,
      src: src
    })
    
  # Loads all the added images at once.
  load: (prefix) ->
    prefix = prefix? or ''
    loaded = true
    for load in toload
      img = new Image()
      img.onload = () ->
        image_counter++
      img.src = prefix + load.src
      images[load.name] = img
      
  readywait: (callback) ->
    # Busy wait while images are loading...
    loadfunc = () ->
      if image_counter > toload.length
        clearInterval(loader)
        callback()
    # Retry every 100ms.
    loader = setInterval(loadfunc, 100)

  # Draw a named, loaded image.
  draw: (ctx, name, x, y) ->
    return false if not loaded
    ctx.drawImage(images[name], x, y)
  
  get: (name) ->
    return images[name]
  
  # For testing only!
  reset: () ->
    toload = []
    loaded = false
    images = {}

sprites = {}

# SpriteManager singleton.
sm =  
  add: (name, size, frames) ->
    img = im.get(name)
    sprite = {
      image: img
      size: size
      frames: frames
    }
    sprites[name] = sprite
  
  draw: (ctx, name, frame, x, y) ->
    sprite = sprites[name]
    # The images might not have loaded when adding sprites. Check again to
    # be sure.
    if not sprite.image
      sprite.image = im.get(name)
    
    frame = sprite.frames[frame]
    if not frame
      console.log('did not get frame for ' + name + ' frame ' + frame)
      return
    
    ctx.drawImage(sprite.image, frame.x, frame.y, sprite.size.x,
      sprite.size.y, x, y, sprite.size.x, sprite.size.y)
    
  # For testing only.
  reset: () ->
    sprites = {}

loki.modules.assets = (env) ->
  env.imagemanager = im
  env.spritemanager = sm
