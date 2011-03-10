# Concrete tiles for use in Burrow Defender.

loki.define('assets', 'world', 'components', 'tileutils', 'mob', (env) ->
  tilesize = env.tilesize
  tile = env.tile
  damageable = env.damageable
  mob = env.mob
  dirtitem = env.dirtitem
  imagemanager = env.imagemanager
  
  imagemanager.add('dirt', 'assets/images/dirt.png')
  imagemanager.add('grass', 'assets/images/grass.png')
  
  loki.modules.tiles = (env) ->
    # When a tile is dug, it produces lots of tiny fragments.
    env.tilefrag = (args) ->
      that = mob(args)
      that.created = new Date().getTime()
      that.size = {
        x: 5
        y: 5
      }
      that.vel = {
        x: Math.round(Math.random() * 4) - 2
        y: -1
      }
      
      that.tick = ->
        # Under the effect of gravity.
        mob.gravitytick.call(that)
        # Disappears after a few seconds.
        current = new Date().getTime()
        that.killed = true if current - that.created > 3000
      
      that.draw = (drawthing) ->
        drawthing.sprite2.push((ctx) ->
          ctx.fillStyle('rgb(192, 192, 192)')
          ctx.fillRect(that.x, that.y, that.size.x, that.size.y)
        )
        
      return that
    
    # A dirt tile that has been dug.
    env.dug = (args) ->
      that = tile(args)
      that.diggable = false
      that.solid = false
      
      that.draw = (ctx) ->
        ctx.fillStyle = 'rgb(40, 15, 0)'
        ctx.fillRect(0, 0, tilesize + 1, tilesize + 1)
      
      return that
    
    # The other really common tile.
    env.dirt = (args) ->
      args.genminedtile = (args) ->
        env.dug(args)
      
      that = tile(args)
      # Dirt tiles can be damaged.
      damageable(that, {
        health: 20
        whendamaged: ->
          that.lasthealed = null;
      })
      
      that.draw = (ctx) ->
        ctx.fillStyle = 'rgb(102, 51, 0)'
        ctx.fillRect(0, tilesize - 2, tilesize, 3)
        imagemanager.draw(ctx, 'dirt', 0, 0)
        tile.drawdamage(ctx, that.health / that.maxhealth)
      
      return that
    
    # The surface tile. Looks like the really common dirt tile but with grass.
    env.dirtwithgrass = (args) ->
      that = env.dirt(args)
      
      that.draw = (ctx) ->
        ctx.fillStyle = 'rgb(102, 51, 0)'
        ctx.fillRect(0, tilesize - 2, tilesize, 3)
        imagemanager.draw(ctx, 'dirt', 0, 0)
        imagemanager.draw(ctx, 'grass', 0, 0)
        tile.drawdamage(ctx, that.health / that.maxhealth)
      
      return that
)
