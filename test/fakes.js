// Some fake things that we can use in our testing.

var FakeCtx = function() {
  this.fillStyleArgs = [];
  this.fillStyle = function(style) {
    this.fillStyleArgs.push(style);
  };
  this.strokeStyleArgs = [];
  this.strokeStyle = function(style) {
    this.strokeStyleArgs.push(style);
  };
  this.strokeRectArgs = [];
  this.strokeRect = function(stx, sty, stw, sth) {
    this.strokeRectArgs.push({
      stx: stx,
      sty: sty,
      stw: stw,
      sth: sth
    });
  }
  this.fillRectArgs = [];
  this.fillRect = function(frx, fry, frw, frh) {
    this.fillRectArgs.push({
			frx: frx,
			fry: fry,
			frw: frw,
			frh: frh,
			offx: this.offset.x,
			offy: this.offset.y
    });
  },
  this.drawImage = function(img, drx, dry) {
    this.drawImageArgs.push({
      img: img,
      drx: drx,
      dry: dry,
      offx: this.offset.x,
      offy: this.offset.y
    });
  };
  this.drawImageArgs = [];
  this.offset = {
    x: 0,
    y: 0
  };
};

var FakeGame = function() {
  this.width = 600;
  this.height = 500;
  this.added = [];
  this.eventbus = {
    subscribed: [],
    subscribe: function(eventname, callback) {
      this.subscribed.push({
        eventname: eventname,
        callback: callback
      });
    },
    fired: [],
    fire: function(eventname, eventarg) {
      this.fired.push({
        eventname: eventname,
        eventarg: eventarg
      });
    }
  };
  this.add = function(thing) {
    this.added.push(thing);
  };
  this.canvas = {};
	this.playeroffset = {
		x: 16,
		y: 16
	};
	this.worldoffset = {
	  x: 0,
	  y: 0
	};
	this.player = {
	  x: 0,
	  y: 0
	};
	this.keyboardmanager = {
		keymap: {
			'w': false,
			'a': false,
			's': false,
			'd': false,
			'shift': false
		}
	};
	this.tilemap = {
		set: function(tile) {
			this.stile = tile;
		},
		get: function(x, y) {
		  this.gx = x;
		  this.gy = y;
		  return {
		    solid: false
		  }
		},
		offset: {
		  x: 0,
		  y: 0
		}
	};
	this.spatialhash = {
	  set: function(t) {
	    this.st = t;
	  },
		remove: function(t) {
			this.rt = t;
		}
	};
	this.mousemanager = {
	  pos: {
	    x: 0,
	    y: 0
	  },
	  leftbutton: false,
	  rightbutton: false
	};
};

var FakeEventObject = function() {
  this.preventedDefault = false;
  this.stoppedPropagation = false;
  this.removedEventListener = false;
  this.pageX = 0;
  this.pageY = 0;

  this.preventDefault = function() {
    this.preventedDefault = true;
  };
  
  this.stopPropagation = function() {
    this.stoppedPropagation = true;
  };
  
  this.removeEventListener = function() {
    this.removedEventListener = true;
  }
}