// game.js
//
// The object that handles everthing about showing the game.
//
// Depends: on everything else...

(function(global, $) {
  
  var game = function(canvasid) {
    var that = {};
    that.canvas = $(canvasid)[0];
    that.ctx = drawcontext(that.canvas.getContext('2d'));
    that.width = that.canvas.width;
    that.height = that.canvas.height;
    that.tilemap = tilemap(that.width, that.height);
    that.spatialhash = spatialhash();
    that.tilegenerator = tilegenerator(that);
    that.keyboardmanager = keyboardmanager();
    that.playeroffset = {
      x: that.width / 2,
      y: that.height / 2
    };
    that.updater = new Updater();
    that.things = [];
    that.addthings = [];
    
    // temporary tile generation
		that.tilegenerator.generate(31 * Tile.tilesize, 0);
		that.tilegenerator.generate(0, 0);
		that.tilegenerator.generate(-10 * Tile.tilesize, 0);
    
    // methods
    that.start = function() {
      that.updater.start();
    };
    
    // Whatever this thing is, add it to the appropriate update buckets. If it
    // can draw itself, add to drawables. If it ticks, add it there. Etc...
    that.add = function(thing) {
      that.addthings.push(thing);
    };
    
    that.update = function() {
      // update the tilemap
      that.tilemap.tick();
      // things can kill themselves on tick, so we need a new list of the
      // unkilled things after each update cycle...
      var newthings = [];
      // gather the drawables
      that.drawables = [];
      // run all the updates on the things
      $.each(that.things, function(index, thing) {
        if (typeof(thing) === 'function') {
          thing();
        };
        if (thing.tick) {
          thing.tick();
        };
        if (thing.move) {
          thing.move(that.spatialhash.get(thing, thing.vel.x, thing.vel.y));
        };
        if (thing.draw) {
          that.drawables.push(function(drawthing) {
            thing.draw(drawthing);
          });
        };
        if (typeof(thing.killed) === 'undefined' || !thing.killed) {
          console.log('not killed');
          newthings.push(thing);
        }
      });
      // swap the list if anything was killed and add anything that was added
      // during the update cycle.
      that.things = newthings;
      if (that.addthings.length > 0) {
        that.things = newthings.concat(that.addthings);
      }
      that.addthings = [];
    };
    
    var drawiterate = function(drawthing, layer) {
      var drawthings = drawthing[layer];
      $.each(drawthings, function(i, thing) {
        that.ctx.offset = {
          x: -(that.player.x - that.playeroffset.x),
          y: -(that.player.y - that.playeroffset.y)
        };
        thing(that.ctx);
      });
    };
    
    that.draw = function() {
      var drawthing = {
        background: [],
        tile: [],
        sprite1: [],
        sprite2: [],
        hud: []
      };
      // get all the drawable functions from people
      $.each(that.drawables, function(i, drawable) {
        drawable(drawthing);
      });
      drawiterate(drawthing, 'background');
      drawiterate(drawthing, 'tile');
      drawiterate(drawthing, 'sprite1');
      drawiterate(drawthing, 'sprite2');
      drawiterate(drawthing, 'hud');
    };
    
    // add the update method to the updater thingy
    that.updater.add(function() {
      that.update();
    });
    // add the draw method to the updater thing
    that.updater.add(function() {
      that.draw();
    });
    
    that.clearbackground = function(ctx) {
      ctx.offset = {
        x: 0,
        y: 0
      };
			ctx.fillStyle('rgb(255, 255, 255)');
			ctx.fillRect(0, 0, that.width, that.height);
    };
    
    that.drawtiles = function(ctx) {
      that.tilemap.draw(ctx, that.player.x - that.playeroffset.x, that.player.y - that.playeroffset.y);
    };
    
    // add our drawing tasks
    var backgrounddraw = {
      draw: function(drawthing) {
        drawthing.background.push(function(ctx) {
          that.clearbackground(ctx);
        });
        drawthing.tile.push(function(ctx) {
          that.drawtiles(ctx);
        });
      }
    };
    that.add(backgrounddraw);
    
    // last but not least, add the player
    that.player = new Player(that);
    that.player.x = 0;
    that.player.y = -200;
    that.add(that.player);
    
    return that;
  };
  
  global.game = game;
  
})(window, jQuery)