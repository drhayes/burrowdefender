// Some fake things that we can use in our testing.

var FakeCtx = function() {
  this.fillStyle = 'old';
  this.fillRectArgs = [];
  this.fillRect = function(frx, fry, frw, frh) {
    this.fillRectArgs.push({
			frx: frx,
			fry: fry,
			frw: frw,
			frh: frh
    });
  }
};
