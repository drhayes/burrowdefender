# The tile generator, tile map, and spatial hash necessary for constructing
# and maintaining a coherent world.

loki.define('assets', 'tileutils', (env) ->
  tilesize = env.tilesize
  totilepos = env.totilepos
  CHUNK_SCALAR = 30
  CHUNK_SIZE = tilesize * CHUNK_SCALAR
  cellsize = tilesize * 2
  imagemanager = env.imagemanager
  
  imagemanager.add('cracks1', 'assets/images/cracks1.png')
  imagemanager.add('cracks2', 'assets/images/cracks2.png')
  imagemanager.add('cracks3', 'assets/images/cracks3.png')
  
  genscalar = (s) -> Math.floor(s / CHUNK_SIZE)
  keyscalar = (x) -> Math.floor(x / cellsize)
  makerawkey = (x, y) -> x + ':' + y
  makekey = (x, y) -> makerawkey(keyscalar(x), keyscalar(y))
  makeid = () -> Math.random() + ':' + Math.random() + ':' + Math.random()
  
  loki.modules.world = (env) ->
    # Procedurally generates the world the player can walk around in.
    # Args:
    # - game: the game mediator with access to tilemap and spatialhash
    # - surfacetile: function used to generate a tile suitable for placement
    #   on the surface
    # - firstgroundtile: function used to generate a tile suitable for just
    #   underground
    env.tilegenerator = (args) ->
      that = {
        generated: {}
      }
      game = args.game
      tilemap = args.game.tilemap
      spatialhash = args.game.spatialhash
      
      # x, y given in world coordinates. Will check for generation around
      # this coordinate and, if none, will generate some terrain.
      # TODO: This only does surface for now! Dig deeper!
      that.generate = (x, y) ->
        key = env.tilegenerator.makekey(x, y)
        if that.generated.hasOwnProperty(key)
          # Tile has already been generated, get out.
          return
        # Generate some stuff!
        that.generated[key] = true
        # What tile x are we starting from?
        x1 = totilepos(genscalar(x) * CHUNK_SIZE, 0).x;
        x2 = x1 + CHUNK_SCALAR
        gen_y = 0
        gentile = null
        for i in [x1...x2]
          gen_y = env.tilegenerator.gensurface(i)
          for j in [0...20]
            tileargs = {
              game: game
              x: i * tilesize
              y: (gen_y + j) * tilesize
            }
            if i != 0 and j == 0
              gentile = args.surfacetile(tileargs)
            else
              gentile = args.firstgroundtile(tileargs)
            tilemap.set(gentile)
            spatialhash.set(gentile)
        
      that
      
    # Given x,y in world-space, give key.
    env.tilegenerator.makekey = (x, y) ->
      genscalar(x) + ':' + genscalar(y)
      
    # Given an x in tilespace, returns a y in tilespace that is the surface
    # of the land at this tile x.
    env.tilegenerator.gensurface = (x) ->
      y = 1.25 * Math.sin(0.02 * x) - 2.3 * Math.sin(0.3 * x) +
        0.5 * Math.cos(0.9 * x) + 3 * Math.sin(0.1 * x) -
        5.1 * Math.cos(0.09 * x)
      Math.round(y)
    
    # A tile the player can walk around on in the game.
    # Args:
    # - game: the mediator object that has spatialhash and tilemap.
    # - x: the x position in worldspace of this tile.
    # - y: the y position in worldspace of this tile.
    # - genminedtile: function that generates tile to replace this tile when
    #   it is mined.
    env.tile = (args) ->
      that = {
        diggable: true
        solid: true
        x: args.x
        y: args.y
        x1: args.x
        y1: args.y
        x2: tilesize + that.x1
        y2: tilesize + that.y1
        halfwidth: (that.x2 - that.x1) / 2
        halfheight: (that.y2 - that.y1) / 2
        halfx: that.halfwidth + that.x1
        halfy: that.halfheight + that.y1
        mine: () ->
          # Are we diggable?
          return if not that.diggable
          # If we're not dead, do nothing.
          return if that.health > 0
          # This tile has been mined.
          minedtile = args.genminedtile({
            game: args.game
            x: that.x
            y: that.y
          })
          args.game.tilemap.set(minedtile)
          args.game.spatialhash.remove(that)
          # Fire an event notifying that this tile has been mined.
          args.game.eventbus.fire('mined', that)
        healtick: () ->
          # Do we have anything to heal?
          return if that.health == that.maxhealth
          # If we haven't healed recently, set that
          if not that.lasthealed
            that.lasthealed = new Date().getTime()
            return
          currenttime = new Date().getTime()
          if currenttime - that.lasthealed >= 750
            that.health += 1
          if that.health >= that.maxhealth
            that.lasthealed = null
            that.health = that.maxhealth
        tick: () ->
          # Is this tile getting dug?
          that.mine()
          # Is this tile in need of healing?
          that.healtick()

      }

      
    env.tile.drawdamage = (ctx, percentage) ->
      # Do we have any damage to draw?
      return if percentage == 1
      # Figure out which image of cracks to draw.
      image = 'cracks1'
      if percentage <= 0.3
        image = 'cracks3'
      else if percentage <= 0.6
        image = 'cracks2'
      imagemanager.draw(ctx, image, 0, 0)
    
    env.tilemap = (args) ->
      that = {
        tilemap: {}
        ticktiles: {}
      }
      
      that.get = (x, y) ->
        key = env.tilemap.makekey(x, y)
        # TODO: Figure out why commenting out the following lines makes
        # CPU usage drop 15%.
        if that.tilemap.hasOwnProperty(key)
          that.tilemap[key]
        else
          null
          
      that.set = (t) ->
        tilepos = totilepos(t.x, t.y)
        that.tilemap[env.tilemap.makekey(tilepos.x, tilpos.y)] = t
        
      iterateviewabletiles = (tilefunc) ->
        startx = Math.floor(args.game.worldoffset.x / tilesize)
        starty = Math.floor(args.game.worldoffset.y / tilesize)
        endx = Math.floor((args.game.worldoffset.x + args.game.width) / tilesize) + 1
        endy = Math.floor((args.game.worldoffset.y + args.game.height) / tilesize) + 1
        for x in [startx...endx]
          for y in [starty...endy]
            sometile = that.get(x, y)
            if !sometile
              continue
            tilex = x * tilesize
            tiley = y * tilesize
            tilefunc(sometile, tilex, tiley)
      
      that.draw = (ctx) ->
        iterateviewabletiles((sometile, tilex, tiley) ->
          ctx.save()
          ctx.translate(tilex, tiley)
          sometile.draw(ctx)
          ctx.restore()
        )
        
      that.tick = () ->
        # Tick the tiles
        iterateviewabletiles((tile, tilex, tiley) ->
          if typeof tile.tick == 'function'
            tile.tick()
        )
        # Find the nonvisables that we're supposed to tick...
        nonvis = _.select(that.ticktiles, (tile) ->
          typeof tile.tick == 'function'
        )
        # ...and tick them. If their tick routine returns true, remove
        # them from the list of tickables.
        that.ticktiles = _.reject(that.ticktiles, (tile) ->
          tile.tick()
        )
      
      that.addticktile = (tile) ->
        key = env.tilemap.makekey(tile.x, tile.y)
        that.ticktiles[key] = tile
      
      that
      
    env.tilemap.makekey = (x, y) ->
      x + ':' + y
      
    env.tilemap.parsekey = (key) ->
      nums = key.split(':')
      {x: nums[0], y: nums[1]}
    
    env.spatialhash = () ->
      that = {
        spacemap: {}
      }
      
      innerget = (key) ->
        if that.spacemap.hasOwnProperty(key)
          l = []
          cell = that.spacemap[key]
          for thing of cell
            l.push(cell[thing])
          l
        []
        
      that.iterate = (r, func) ->
        kx1 = keyscalar(r.x1)
        ky1 = keyscalar(r.y1)
        kx2 = keyscalar(r.x2)
        ky2 = keyscalar(r.y2)
        for i in [kx1..kx2]
          for j in [ky1..ky2]
            key = makerawkey(i, j)
            func.apply(this, [key, r])
      
      that.get = (r, vx, vy) ->
        things = []
        seenkeys = {}
        addmeup = (key, r) ->
          seenkeys[key] = true
          things = things.concat(innerget.apply(this, [key]))
        that.iterate(r, (key, r) ->
          addmeup.apply(this, [key, r])
        )
        rv = {
          x1: r.x1 + vx
          y1: r.y1 + vy
          x2: r.x2 + vx
          y2: r.y1 + vy
        }
        that.iterate(rv, (key, r) ->
          # Dedupe on velocity check
          return if seenkeys.hasOwnProperty(key)
          addmeup.apply(this, [key, r])
        )
        things
      
      # Given a {x1,y1,x2,y2} rect, put it in the right place in the
      # spatial hash. If it's a big rect, let it span buckets in the hash.
      that.set = (r) ->
        r.shid = makeid()
        that.iterate(r, (key, r) ->
          if not that.spacemap.hasOwnProperty(key)
            that.spacemap[key] = {}
          that.spacemap[key][r.shid] = r
        )
      
      that.remove = (r) ->
        that.iterate(r, (key, r) ->
          if that.spacemap.hasOwnProperty(key)
            l = that.spacemap[key]
            delete l[r.shid]
        )
        
      that.move = () -> null
      
      that
)
