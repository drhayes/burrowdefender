# Mobile objects that can collide with other objects. Mobs have a position
# in world space and a velocity.

FORCE_OF_GRAVITY = 0.25
MAX_OF_GRAVITY = 12

defaults = {
  x: 0
  y: 0
  size: {
    x: 16
    y: 16
  }
  vel: {
    x: 0
    y: 0
  }
  movestate: {
    jumping: false
    standing: false
  }
  velocities: {
    jump: -6
    walkleft: -2
    walkright: 2
  }
  friction: 1
  bounce: 0
}

loki.define('utils', (env) ->
  collide = env.collide
  
  loki.modules.mob = (env) ->
    env.mob = (args) ->
      that = _.extend({}, defaults, args)
      # that.x = args.x
      # that.y = args.y
      # that.size = {
      #   x: args.size.x
      #   y: args.size.y
      # }
      # that.vel = {
      #   x: args.vel.x
      #   y: args.vel.y
      # }
      # that.friction = args.friction
      # that.bounce = args.bounce
      # that.movestate = {
      #   # Jumping is defined as having jumped but not yet become standing.
      #   jumping: args.movestate.jumping
      #   # Standing is having 0 effective y velocity.
      #   standing: args.movestate.standing
      # }
      # that.velocities = {
      #   jump: args.velocities.jump
      #   walkleft: args.velocities.walkleft
      #   walkright: args.velocities.walkright
      # }
      that.updaterect = ->
        that.x1 = that.x
        that.y1 = that.y
        that.x2 = that.x + that.size.x
        that.y2 = that.y + that.size.y
        that.halfwidth = (that.x2 - that.x1) / 2
        that.halfheight = (that.y2 - that.y1) / 2
        that.halfx = that.halfwidth + that.x1
        that.halfy = that.halfheight + that.y1
      
      that.move = (collides = []) ->
        # Remove from the spatial hash.
        args.game.spatialhash.remove(that)
        # If velocity is tiny, make it zero.
        that.vel.x = 0 if Math.abs(that.vel.x) < 0.1
        that.vel.y = 0 if Math.abs(that.vel.y) < 0.1
        # Adjust for velocity
        that.x += that.vel.x
        that.y += that.vel.y
        that.updaterect()
        that.movestate.standing = false
        aftervel = {
          x: 0
          y: 0
        }
        _.each(collides, (r) ->
          # Am I colliding with myself?
          return if r == that
          # Are we actually colliding?
          return if not collide(that, r)
          # Does what we're colliding with have a collide function?
          stop = false
          stop |= r.collide(that) if typeof r.collide == 'function'
          # Converse, too...
          stop |= that.collide(r) if typeof that.collide == 'funcion'
          # If any of these collide methods returned false, stop colliding.
          return false if stop
          # Is this thing solid?
          return if r.solid? and not r.solid
          # Do projection-based collision detection.
          dx = that.halfx - r.halfx
          dy = that.halfy - r.halfy
          # Combine'em.
          tx = Math.abs(that.halfwidth + r.halfwidth - Math.abs(dx) + 1)
          ty = Math.abs(that.halfheight + r.halfheight - Math.abs(dy) + 1)
          # Get the vectors off the sign of the projection scalar.
          vx = -dx / Math.abs(dx)
          vy = -dy / Math.abs(dy)
          # The shorter one is the one we adjust by.
          if tx < ty
            that.x -= tx * vx
            aftervel.x = -that.vel.x * that.bounce
          else
            that.y -= ty * vy
            aftervel.y = -that.vel.y * that.bounce
            # Are we standing or jumping anymore?
            that.movestate.standing = (vy > 0)
            that.movestate.jumping = (vy <= 0)
          that.updaterect()
        )
        if Math.abs(aftervel.y) > 1
          that.vel.y = aftervel.y
          that.movestate.standing = false
        if Math.abs(aftervel.x) > 1
          that.vel.x = aftervel.x
        args.game.spatialhash.set(that)
        
      that.jump = ->
        # Can't jump if already in the air.
        return false if that.movestate.jumping or !that.movestate.standing
        that.vel.y = that.velocities.jump
        that.movestate.jumping = true
        that.movestate.standing = false
      
      return that
      
    env.mob.gravitytick = ->
      if this.movestate.standing
        this.vel.y = 1
        return
      if this.vel.y < MAX_OF_GRAVITY
        this.vel.y += FORCE_OF_GRAVITY
)
