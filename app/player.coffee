# The player. Y'know, of the game.

walking = {
  LEFT: -1
  STANDING: 0
  RIGHT: 1
  DOWN: 2
  UP: 3
}

STOPFORCE = 0.2

# Inventory constants.
PADDING = 5
CANVAS_WIDTH = 600
CANVAS_HEIGHT = 500
WIDTH = CANVAS_WIDTH - PADDING * 2
HEIGHT = 50
MAXITEMS = 8

loki.define('actions', 'assets', 'graphics', 'mob', 'tileutils', 'components', (env) ->
  mob = env.mob
  tilesize = env.tilesize
  totilepos = env.totilepos
  damageable = env.damageable
  actionable = env.actionable
  imagemanager = env.imagemanager
  spritemanager = env.spritemanager
  animation = env.animation
  animsequence = env.sequence
  animrepeat = env.repeater
  action = env.action
  
  # Add player images.
  imagemanager.add('heartfull', 'assets/images/heartfull.png')
  imagemanager.add('heartempty', 'assets/images/heartempty.png')
  imagemanager.add('player', 'assets/images/player.png')
  
  # Define player sprite.
  spritemanager.add('player', {x: 24, y: 32}, [
    {x: 0, y: 298} # Standing
    {x: 25, y: 298} # Blinking
    {x: 50, y: 298}
    {x: 75, y: 298}
    {x: 100, y: 298}
    {x: 125, y: 298} # Running left
    {x: 150, y: 298}
    {x: 175, y: 298}
    {x: 200, y: 298}
    {x: 225, y: 298}
    {x: 0, y: 265}
    {x: 25, y: 265}
    {x: 50, y: 265}
    {x: 75, y: 265}
    {x: 100, y: 265}
    {x: 125, y: 265}
    {x: 150, y: 265} # Running right
    {x: 175, y: 265}
    {x: 200, y: 265}
    {x: 225, y: 265}
    {x: 0, y: 232}
    {x: 25, y: 232}
    {x: 50, y: 232}
    {x: 75, y: 232}
    {x: 100, y: 232}
    {x: 125, y: 232}
    {x: 150, y: 232}
    {x: 175, y: 232} # Jumping
    {x: 200, y: 232} # Falling
  ])
  
  # Define player animations.
  standing = animation({
    name: 'player'
    frames: [animrepeat([0], 100, 180), 1, 2, 3, 4, 4, 3, 2, 1]
  })
  runningleft = animation({
    name: 'player'
    frames: [5, 5, 6, 6, 7, 7, 8, 8, 9, 9, 10, 10, 11, 11, 12, 12, 13, 13, 14, 14, 15, 15]
  })
  runningright = animation({
    name: 'player'
    frames: [16, 16, 17, 17, 18, 18, 19, 19, 20, 20, 21, 21, 22, 22, 23, 23, 24, 24, 25, 25, 26, 26]
  })
  falling = animation({
    name: 'player'
    frames: [28]
  })
  jumping = animation({
    name: 'player'
    frames: [27]
  })
  
  loki.modules.player = (env) ->
    # Maintains a 1-based map of things the player is carrying. This maps
    # neatly to the scheme of getting the player to press number keys to specify
    # a particular spot in the player's inventory.
    env.inventory = ->
      that = {
        x1: PADDING
        y1: CANVAS_HEIGHT - PADDING - HEIGHT
        x2: PADDING + WIDTH
        y2: CANVAS_HEIGHT - PADDING
        things: {}
        sel: 1
      }
      typemap = {}
      
      getthingbytype = (key) ->
        that.things[typemap[key]]
      
      that.add = (thing) ->
        # Make sure thing has a type attribute.
        if not thing.hasOwnProperty('type')
          throw {
            message: 'Item must have type attribute'
          }
        # Find the index for this thing.
        index = 1
        # I pray the following doesn't bite me in the ass later...
        key = JSON.stringify(thing.type)
        if typemap.hasOwnProperty(key)
          index = typemap[key]
        else
          # Find an open slot
          index = _.detect([1..MAXITEMS], (i) ->
            return !that.things.hasOwnProperty(i) || that.things[i].key == key
          )
          if not that.things.hasOwnProperty(index)
            that.things[index] = {
              key: key
              instance: thing
              count: 0
            }
            typemap[key] = index
          that.things[index].count += 1
      
      that.remove = (type, count = 1) ->
        key = JSON.stringify(type)
        if not typemap.hasOwnProperty(key)
          throw {
            message: 'Nothing of that type in inventory!'
          }
        thing = getthingbytype(key)
        if thing.count < count
          throw {
            message: 'Tried to remove too much!'
          }
        thing.count -= count
        if thing.count == 0
          delete that.things[typemap[key]]
          delete typemap[key]
      
      that.getsel = ->
        t = that.things[that.sel]
        if not t or t.count == 0
          null
        else
          t.instance
      
      that.dropsel = ->
        t = that.things[that.sel]
        if typeof t == 'undefined'
          null
        else
          that.remove(t.instance.type)
          t.instance
      
      that.draw = (drawthing) ->
        drawthing.hud.push((ctx) ->
          # Draw the background.
          ctx.fillStyle = 'hsla(120, 0%, 0%, 0.3)'
          ctx.fillRect(that.x1, that.y1, WIDTH, HEIGHT)
          # Draw the itemrects...
          ctx.lineWidth = 2
          ctx.fillStyle = 'hsla(120, 100%, 100%, 1.0)'
          ctx.font = '15px Impact'
          unseltyle = 'hsla(120, 10%, 50%, 0.6)'
          selstyle = 'hsla(120, 80%, 50%, 0.6)'
          for i in [1..MAXITEMS]
            ctx.strokeStyle = if i == that.sel then selstyle else unseltyle
            r = that.itemrect(i)
            ctx.strokeRect(r.x1, r.y1, r.x2 - r.x1, r.y2 - r.y1)
            # Now draw the icon, if we have one.
            if that.things.hasOwnProperty(i)
              invitem = that.things[i]
              drawimage = invitem.instance.drawimage
              ctx.save()
              ctx.translate(r.x1 + (r.width / 2) - 8, r.y1 + (r.height / 2) - 16)
              drawimage(ctx)
              # How many do we have? Center that text.
              counstr = invitem.count.toString()
              textwidth = ctx.measureText(countstr)
              ctx.fillText(countstr, -(textwidth.width / 2) + 7, 32)
              ctx.restore()
        )
      
      # For the ith item, return a rectangle of the space it occupies when
      # drawing it. Items are currently 16x16 so this should be bigger.
      # This is 1-based, just like the inventory.
      that.itemrect = (i) ->
        i = i - 1
        peritemwidth = (WIDTH - PADDING * 2) / MAXITEMS
        startx = that.x1 + PADDING + peritemwidth * i
        rect = {
          x1: startx + PADDING
          y1: that.y1 + PADDING
          x2: startx + peritemwidth - PADDING
          y2: that.y2 - PADDING
        }
        rect.width = rect.x2 - rect.x1
        rect.height = rect.y2 - rect.y1
        rect
      
      that.hasitem = (type, count = 1) ->
        # Do we even have one of those?
        key = JSON.stringify(type)
        return false if not typemap.hasOwnProperty(key)
        # Do we have the required count?
        return getthingbytype(key).count >= count
      
      return that
    
    # Move action expects the following args:
    # - player: The player whose action this is.
    # - game: The game where this taking place.
    env.moveaction = (args) ->
      player = args.player
      game = args.game
      keyman = args.game.keyboardmanager
      that = action()
      that.readkeyboard = ->
        player.movestate.mining = keyman.keymap['shift']
        player.movestate.wantstojump = keyman.keymap['space']      
        player.movestate.placing = keyman.keymap['z']
        # This order is pretty important. Don't want down to be the
        # one that wins, for instance.
        if keyman.keymap['s'] or keyman.keymap['down']
          player.movestate.walking = walking.DOWN
        else if keyman.keymap['a'] or keyman.keymap['left']
          player.movestate.walking = walking.LEFT
        else if keyman.keymap['d'] or keyman.keymap['right']
          player.movestate.walking = walking.RIGHT
        else if keyman.keymap['w'] or keyman.keymap['up']
          player.movestate.walking = walking.UP
        else
          player.movestate.walking = walking.STANDING
        # Set the currently selected thing in inventory
        player.inventory.sel = _.detect([1..MAXITEMS], (i) ->
          keyman.keymap[i.toString()]
        )
      tileposindirection = ->
        # Respect player's center of mass.
        tilepos = totilepos(player.x + player.size.x / 2, player.y + player.size.y / 2)
        if player.movestate.walking == walking.LEFT
          tilepos.x -= 1
        else if player.movestate.walking == walking.RIGHT
          tilepos.x += 1
        else if player.movestate.walking == walking.UP
          tilepos.y -= 1
        else if player.movestate.walking == walking.DOWN
          tilepos.y += 1
        tilepos
      
      that.mine = ->
        if player.movestate.mining
          # Convert the player's current walking direction to tile.
          tilepos = tileposindirection()
          # Is it a diggable tile?
          digtile = game.tilemap.get(tilepos.x, tilepos.y)
          digtile.damage(player.minedamage) if digtile and _.isFunction(digtile.damage)
      
      that.walk = ->
        if not player.movestate.placing
          player.vel.x = player.velocities.walkleft if player.movestate.walking == walking.LEFT
          player.vel.x = player.velocities.walkright if player.movestate.walking == walking.RIGHT
        else
          player.vel.x = if player.vel.x < 0 then Math.min(0, player.vel.x + STOPFORCE) else Math.min(0, player.vel.x - STOPFORCE)
        player.jump() if player.movestate.wantstojump
      
      that.place = ->
        return if not player.movestate.placing or player.movestate.walking == walking.STANDING
        i = player.inventory.getsel()
        return if i == null
        # We have something to drop so place it.
        # Convert the player's current walking direction to tile.
        tilepos = tileposindirection()
        result = i.place(tilepos.x * tilesize, tilepos.y * tilesize)
        # Did it actually get placed?
        return if not result
        player.inventory.dropsel()
      
      that.tick = ->
        # Read the state of the keyboard.
        that.readkeyboard()
        # Are we mining?
        that.mine()
        # Walk somewhere.
        that.walk()
        # Placing anything?
        that.place()
      
      that.draw = (drawthing) ->
        drawthing.sprite1.push((ctx) ->
          if not player.movestate.standing and player.vel.y > 0
            falling.draw(ctx, player.x, player.y)
          else if not player.movestate.standing and player.vel.y < 0
            jumping.draw(ctx, player.x, player.y)
          else if player.movestate.walking == walking.LEFT
            runningleft.draw(ctx, player.x, player.y)
          else if player.movestate.walking == walking.RIGHT
            runningright.draw(ctx, player.x, player.y)
          else
            standing.draw(ctx, player.x, player.y)
        )
      
      return that
    
    env.player = (args) ->
      # Player is a mob.
      that = mob(args)
      # Set player defaults.
      that.size = {
        x: 24
        y: 32
      }
      that.solid = false
      
      # Special player movestates.
      that.movestate.mining = false
      that.movestate.wantstojump = false
      that.movestate.walking = walking.STANDING
      that.movestate.placing = false
      
      # Mining damage.
      that.minedamage = 1
      
      # Health stuff.
      damageable(that, {
        health: 5
        whendamaged: (amt) ->
          that.movestate.standing = false
      })
      
      # Enemies like to eat players.
      that.delicious = true
      
      # Player is actionable.
      actionable(that)
      
      # Add default moveaction.
      moveaction = env.moveaction({
        player: that
        game: args.game
      })
      that.addaction(moveaction)
      
      that.inventory = env.inventory()
      
      that.draw = (drawthing) ->
        # Draw the player's current action.
        that.executeactions('draw', drawthing)
        # Draw the health bar.
        drawthing.hud.push((ctx) ->
          startx = 10
          starty = 10
          for i in [0...that.maxhealth]
            image = 'heartempty'
            image = 'heartfull' if that.health > i
            imagemanager.draw(ctx, image, startx + (18 * i), starty)
        )
        # Draw the inventory.
        that.inventory.draw(drawthing)
      
      # Update the player every tick.
      that.tick = ->
        # Gravity affects the player.
        mob.gravitytick.call(that)
        # Tick the current action.
        that.executeactions('tick')
      
      return that
)
