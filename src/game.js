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
          thing.move();
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
  };
  
  global.Game = Game;
  
})(window, jQuery)