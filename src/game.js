// game.js
//
// The object that handles everthing about showing the game.
//
// Depends: on everything else...

(function(global, $) {
  
  var Game = function(canvasid) {
    this.canvas = $(canvasid)[0];
    this.ctx = this.canvas.getContext('2d');
    this.width = this.canvas.width;
    this.height = this.canvas.height;
    this.tilemap = new TileMap(this.width, this.height);
    this.spatialhash = new SpatialHash();
    this.tilegenerator = new TileGenerator(this.tilemap, this.spatialhash);
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
        this.tickables.push(function() {
          thing.tick();
        });
      };
      if (typeof(thing.move) === 'function') {
        this.movables.push(function() {
          thing.move(me.spatialhash.get(thing, thing.vel.x, thing.vel.y));
        });
      };
      if (typeof(thing.draw) === 'function') {
        this.drawables.push(function() {
          thing.draw(me.ctx);
        });
      };
      if (typeof(thing) === 'function') {
        this.others.push(thing);
      };
    };
    
    this.update = function() {
      $.each(this.tickables, function(index, tickable) {
        tickable();
      });
      $.each(this.movables, function(index, movable) {
        movable();
      });
      $.each(this.drawables, function(index, drawable) {
        drawable();
      });
      $.each(this.others, function(index, other) {
        other();
      });
    };
    
    // add the update method to the updater thingy
    this.updater.add(function() {
      me.update();
    });
    
    this.clearbackground = function(ctx) {
			ctx.fillStyle = 'rgb(255, 255, 255)';
			ctx.fillRect(0, 0, this.width, this.height);
    };
    
    this.drawtiles = function(ctx) {
      
    };
    
    // last but not least, add the player
    this.player = new Player();
    this.player.x = 0;
    this.player.y = -200;
  };
  
  global.Game = Game;
  
})(window, jQuery)