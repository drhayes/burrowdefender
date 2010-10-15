// Some fake things that we can use in our testing.

var FakeCtx = function() {
  this.fillStyleArgs = [];
  this.fillStyle = function(style) {
    this.fillStyleArgs.push(style);
  };
  this.fillRectArgs = [];
  this.fillRect = function(frx, fry, frw, frh) {
    this.fillRectArgs.push({
			frx: frx,
			fry: fry,
			frw: frw,
			frh: frh
    });
  },
  this.drawImage = function(img, drx, dry) {
    this.drawImageArgs.push({
      img: img,
      drx: drx,
      dry: dry
    });
  };
  this.drawImageArgs = [];
};
