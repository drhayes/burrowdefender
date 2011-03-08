(function() {
  var im, image_counter, images, loaded, sm, sprites, toload;
  toload = [];
  loaded = false;
  images = {};
  image_counter = 0;
  im = {
    add: function(name, src) {
      if (loaded) {
        throw {
          error: 'Adding after load'
        };
      }
      return toload.push({
        name: name,
        src: src
      });
    },
    load: function(prefix) {
      var img, load, _i, _len, _results;
      prefix = (prefix != null) || '';
      loaded = true;
      _results = [];
      for (_i = 0, _len = toload.length; _i < _len; _i++) {
        load = toload[_i];
        img = new Image();
        img.onload = function() {
          return image_counter++;
        };
        img.src = prefix + load.src;
        _results.push(images[load.name] = img);
      }
      return _results;
    },
    readywait: function(callback) {
      var loader, loadfunc;
      loadfunc = function() {
        if (image_counter > toload.length) {
          clearInterval(loader);
          return callback();
        }
      };
      return loader = setInterval(loadfunc, 100);
    },
    draw: function(ctx, name, x, y) {
      if (!loaded) {
        return false;
      }
      return ctx.drawImage(images[name], x, y);
    },
    get: function(name) {
      return images[name];
    },
    reset: function() {
      toload = [];
      loaded = false;
      return images = {};
    }
  };
  sprites = {};
  sm = {
    add: function(name, size, frames) {
      var img, sprite;
      img = im.get(name);
      sprite = {
        image: img,
        size: size,
        frames: frames
      };
      return sprites[name] = sprite;
    },
    draw: function(ctx, name, frame, x, y) {
      var sprite;
      sprite = sprites[name];
      if (!sprite.image) {
        sprite.image = im.get(name);
      }
      frame = sprite.frames[frame];
      if (!frame) {
        console.log('did not get frame for ' + name + ' frame ' + frame);
        return;
      }
      return ctx.drawImage(sprite.image, frame.x, frame.y, sprite.size.x, sprite.size.y, x, y, sprite.size.x, sprite.size.y);
    },
    reset: function() {
      return sprites = {};
    }
  };
  loki.modules.assets = function(env) {
    env.imagemanager = im;
    return env.spritemanager = sm;
  };
}).call(this);
