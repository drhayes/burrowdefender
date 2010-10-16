// game.js
//
// The object that handles everthing about showing the game.
//
// Depends: on everything else...

(function(global, $) {
  
  var Game = function(canvasid) {
    this.canvas = $(canvasid)[0];
    this.ctx = new DrawContext(this.canvas.getContext('2d'));
    this.width = this.canvas.width;
    this.height = this.canvas.height;
    this.tilemap = new TileMap(this.width, this.height);
    this.spatialhash = new SpatialHash();
    this.tilegenerator = new TileGenerator(this);
    this.keyboardmanager = new KeyboardManager();
    this.playeroffset = {
      x: this.width / 2,
      y: this.height / 2
    };
    this.updater = new Updater();
    this.drawables = [];
    this.movables = [];
    this.tickables = [];
    this.others = [];
    
    // temporary tile generation
		this.tilegenerator.generate(31 * Tile.tilesize, 0);
		this.tilegenerator.generate(0, 0);
		this.tilegenerator.generate(-10 * Tile.tilesize, 0);
    
    // methods
    this.start = function() {
      this.updater.start();
    };
    
    var me = this;
    
    // Whatever this thing is, add it to the appropriate update buckets. If it
    // can draw itself, add to drawables. If it ticks, add it there. Etc...
    this.add = function(thing) {
      if (typeof(thing.tick) === 'function') {
        var tick = function() {
          thing.tick();
        };
        tick.thing = thing;
        this.tickables.push(tick);
      };
      if (typeof(thing.move) === 'function') {
        var move = function() {
          thing.move(me.spatialhash.get(thing, thing.vel.x, thing.vel.y));
        };
        move.thing = thing;
        this.movables.push(move);
      };
      if (typeof(thing.draw) === 'function') {
        var draw = function(drawthing) {
          thing.draw(drawthing);
        }
        draw.thing = thing;
        this.drawables.push(draw);
      };
      if (typeof(thing) === 'function') {
        // this statement is awesome!
        thing.thing = thing;
        this.others.push(thing);
      };
    };
    
    this.update = function() {
      // update the tilemap
      this.tilemap.tick();
      $.each(this.others, function(index, other) {
        other();
      });
      $.each(this.tickables, function(index, tickable) {
        tickable();
      });
      $.each(this.movables, function(index, movable) {
        movable();
      });
    };
    
    var drawiterate = function(drawthing, layer) {
      var drawthings = drawthing[layer];
      $.each(drawthings, function(i, thing) {
        me.ctx.offset = {
          // x: me.playeroffset.x,
          // y: me.playeroffset.y
          x: -(me.player.x - me.playeroffset.x),
          y: -(me.player.y - me.playeroffset.y)
        };
        thing(me.ctx);
      });
    };
    
    this.draw = function() {
      var drawthing = {
        background: [],
        tile: [],
        sprite1: [],
        sprite2: [],
        hud: []
      };
      // get all the drawable functions from people
      $.each(this.drawables, function(i, drawable) {
        drawable(drawthing);
      });
      drawiterate(drawthing, 'background');
      drawiterate(drawthing, 'tile');
      drawiterate(drawthing, 'sprite1');
      drawiterate(drawthing, 'sprite2');
      drawiterate(drawthing, 'hud');
    };
    
    // add the update method to the updater thingy
    this.updater.add(function() {
      me.update();
    });
    // add the draw method to the updater thing
    this.updater.add(function() {
      me.draw();
    });
    
    this.clearbackground = function(ctx) {
      ctx.offset = {
        x: 0,
        y: 0
      };
			ctx.fillStyle('rgb(255, 255, 255)');
			ctx.fillRect(0, 0, this.width, this.height);
    };
    
    this.drawtiles = function(ctx) {
      this.tilemap.draw(ctx, this.player.x - this.playeroffset.x, this.player.y - this.playeroffset.y);
    };
    
    // add our drawing tasks
    var backgrounddraw = {
      draw: function(drawthing) {
        drawthing.background.push(function(ctx) {
          me.clearbackground(ctx);
        });
        drawthing.tile.push(function(ctx) {
          me.drawtiles(ctx);
        });
      }
    };
    this.add(backgrounddraw);
    
    // last but not least, add the player
    this.player = new Player(this);
    this.player.x = 0;
    this.player.y = -200;
    this.add(this.player);
  };
  
  global.Game = Game;
  
})(window, jQuery)