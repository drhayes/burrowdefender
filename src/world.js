(function() {
  loki.define('assets', 'tileutils', function(env) {
    var CHUNK_SCALAR, CHUNK_SIZE, cellsize, genscalar, imagemanager, keyscalar, makeid, makekey, makerawkey, tilesize, totilepos;
    tilesize = env.tilesize;
    totilepos = env.totilepos;
    CHUNK_SCALAR = 30;
    CHUNK_SIZE = tilesize * CHUNK_SCALAR;
    cellsize = tilesize * 2;
    imagemanager = env.imagemanager;
    imagemanager.add('cracks1', 'assets/images/cracks1.png');
    imagemanager.add('cracks2', 'assets/images/cracks2.png');
    imagemanager.add('cracks3', 'assets/images/cracks3.png');
    genscalar = function(s) {
      return Math.floor(s / CHUNK_SIZE);
    };
    keyscalar = function(x) {
      return Math.floor(x / cellsize);
    };
    makerawkey = function(x, y) {
      return x + ':' + y;
    };
    makekey = function(x, y) {
      return makerawkey(keyscalar(x), keyscalar(y));
    };
    makeid = function() {
      return Math.random() + ':' + Math.random() + ':' + Math.random();
    };
    return loki.modules.world = function(env) {
      env.tilegenerator = function(args) {
        var game, spatialhash, that, tilemap;
        that = {
          generated: {}
        };
        game = args.game;
        tilemap = args.game.tilemap;
        spatialhash = args.game.spatialhash;
        that.generate = function(x, y) {
          var gen_y, gentile, i, j, key, tileargs, x1, x2, _results;
          key = env.tilegenerator.makekey(x, y);
          if (that.generated.hasOwnProperty(key)) {
            return;
          }
          that.generated[key] = true;
          x1 = totilepos(genscalar(x) * CHUNK_SIZE, 0).x;
          x2 = x1 + CHUNK_SCALAR;
          gen_y = 0;
          gentile = null;
          _results = [];
          for (i = x1; (x1 <= x2 ? i < x2 : i > x2); (x1 <= x2 ? i += 1 : i -= 1)) {
            gen_y = env.tilegenerator.gensurface(i);
            _results.push((function() {
              var _results;
              _results = [];
              for (j = 0; j < 20; j++) {
                tileargs = {
                  game: game,
                  x: i * tilesize,
                  y: (gen_y + j) * tilesize
                };
                if (i !== 0 && j === 0) {
                  gentile = args.surfacetile(tileargs);
                } else {
                  gentile = args.firstgroundtile(tileargs);
                }
                tilemap.set(gentile);
                _results.push(spatialhash.set(gentile));
              }
              return _results;
            })());
          }
          return _results;
        };
        return that;
      };
      env.tilegenerator.makekey = function(x, y) {
        return genscalar(x) + ':' + genscalar(y);
      };
      env.tilegenerator.gensurface = function(x) {
        var y;
        y = 1.25 * Math.sin(0.02 * x) - 2.3 * Math.sin(0.3 * x) + 0.5 * Math.cos(0.9 * x) + 3 * Math.sin(0.1 * x) - 5.1 * Math.cos(0.09 * x);
        return Math.round(y);
      };
      env.tile = function(args) {
        var that;
        return that = {
          diggable: true,
          solid: true,
          x: args.x,
          y: args.y,
          x1: args.x,
          y1: args.y,
          x2: tilesize + that.x1,
          y2: tilesize + that.y1,
          halfwidth: (that.x2 - that.x1) / 2,
          halfheight: (that.y2 - that.y1) / 2,
          halfx: that.halfwidth + that.x1,
          halfy: that.halfheight + that.y1,
          mine: function() {
            var minedtile;
            if (!that.diggable) {
              return;
            }
            if (that.health > 0) {
              return;
            }
            minedtile = args.genminedtile({
              game: args.game,
              x: that.x,
              y: that.y
            });
            args.game.tilemap.set(minedtile);
            args.game.spatialhash.remove(that);
            return args.game.eventbus.fire('mined', that);
          },
          healtick: function() {
            var currenttime;
            if (that.health === that.maxhealth) {
              return;
            }
            if (!that.lasthealed) {
              that.lasthealed = new Date().getTime();
              return;
            }
            currenttime = new Date().getTime();
            if (currenttime - that.lasthealed >= 750) {
              that.health += 1;
            }
            if (that.health >= that.maxhealth) {
              that.lasthealed = null;
              return that.health = that.maxhealth;
            }
          },
          tick: function() {
            that.mine();
            return that.healtick();
          }
        };
      };
      env.tile.drawdamage = function(ctx, percentage) {
        var image;
        if (percentage === 1) {
          return;
        }
        image = 'cracks1';
        if (percentage <= 0.3) {
          image = 'cracks3';
        } else if (percentage <= 0.6) {
          image = 'cracks2';
        }
        return imagemanager.draw(ctx, image, 0, 0);
      };
      env.tilemap = function(args) {
        var iterateviewabletiles, that;
        that = {
          tilemap: {},
          ticktiles: {}
        };
        that.get = function(x, y) {
          var key;
          key = env.tilemap.makekey(x, y);
          if (that.tilemap.hasOwnProperty(key)) {
            return that.tilemap[key];
          } else {
            return null;
          }
        };
        that.set = function(t) {
          var tilepos;
          tilepos = totilepos(t.x, t.y);
          return that.tilemap[env.tilemap.makekey(tilepos.x, tilpos.y)] = t;
        };
        iterateviewabletiles = function(tilefunc) {
          var endx, endy, sometile, startx, starty, tilex, tiley, x, y, _results;
          startx = Math.floor(args.game.worldoffset.x / tilesize);
          starty = Math.floor(args.game.worldoffset.y / tilesize);
          endx = Math.floor((args.game.worldoffset.x + args.game.width) / tilesize) + 1;
          endy = Math.floor((args.game.worldoffset.y + args.game.height) / tilesize) + 1;
          _results = [];
          for (x = startx; (startx <= endx ? x < endx : x > endx); (startx <= endx ? x += 1 : x -= 1)) {
            _results.push((function() {
              var _results;
              _results = [];
              for (y = starty; (starty <= endy ? y < endy : y > endy); (starty <= endy ? y += 1 : y -= 1)) {
                sometile = that.get(x, y);
                if (!sometile) {
                  continue;
                }
                tilex = x * tilesize;
                tiley = y * tilesize;
                _results.push(tilefunc(sometile, tilex, tiley));
              }
              return _results;
            })());
          }
          return _results;
        };
        that.draw = function(ctx) {
          return iterateviewabletiles(function(sometile, tilex, tiley) {
            ctx.save();
            ctx.translate(tilex, tiley);
            sometile.draw(ctx);
            return ctx.restore();
          });
        };
        that.tick = function() {
          var nonvis;
          iterateviewabletiles(function(tile, tilex, tiley) {
            if (typeof tile.tick === 'function') {
              return tile.tick();
            }
          });
          nonvis = _.select(that.ticktiles, function(tile) {
            return typeof tile.tick === 'function';
          });
          return that.ticktiles = _.reject(that.ticktiles, function(tile) {
            return tile.tick();
          });
        };
        that.addticktile = function(tile) {
          var key;
          key = env.tilemap.makekey(tile.x, tile.y);
          return that.ticktiles[key] = tile;
        };
        return that;
      };
      env.tilemap.makekey = function(x, y) {
        return x + ':' + y;
      };
      env.tilemap.parsekey = function(key) {
        var nums;
        nums = key.split(':');
        return {
          x: nums[0],
          y: nums[1]
        };
      };
      return env.spatialhash = function() {
        var innerget, that;
        that = {
          spacemap: {}
        };
        innerget = function(key) {
          var cell, l, thing;
          if (that.spacemap.hasOwnProperty(key)) {
            l = [];
            cell = that.spacemap[key];
            for (thing in cell) {
              l.push(cell[thing]);
            }
            l;
          }
          return [];
        };
        that.iterate = function(r, func) {
          var i, j, key, kx1, kx2, ky1, ky2, _results;
          kx1 = keyscalar(r.x1);
          ky1 = keyscalar(r.y1);
          kx2 = keyscalar(r.x2);
          ky2 = keyscalar(r.y2);
          _results = [];
          for (i = kx1; (kx1 <= kx2 ? i <= kx2 : i >= kx2); (kx1 <= kx2 ? i += 1 : i -= 1)) {
            _results.push((function() {
              var _results;
              _results = [];
              for (j = ky1; (ky1 <= ky2 ? j <= ky2 : j >= ky2); (ky1 <= ky2 ? j += 1 : j -= 1)) {
                key = makerawkey(i, j);
                _results.push(func.apply(this, [key, r]));
              }
              return _results;
            }).call(this));
          }
          return _results;
        };
        that.get = function(r, vx, vy) {
          var addmeup, rv, seenkeys, things;
          things = [];
          seenkeys = {};
          addmeup = function(key, r) {
            seenkeys[key] = true;
            return things = things.concat(innerget.apply(this, [key]));
          };
          that.iterate(r, function(key, r) {
            return addmeup.apply(this, [key, r]);
          });
          rv = {
            x1: r.x1 + vx,
            y1: r.y1 + vy,
            x2: r.x2 + vx,
            y2: r.y1 + vy
          };
          that.iterate(rv, function(key, r) {
            if (seenkeys.hasOwnProperty(key)) {
              return;
            }
            return addmeup.apply(this, [key, r]);
          });
          return things;
        };
        that.set = function(r) {
          r.shid = makeid();
          return that.iterate(r, function(key, r) {
            if (!that.spacemap.hasOwnProperty(key)) {
              that.spacemap[key] = {};
            }
            return that.spacemap[key][r.shid] = r;
          });
        };
        that.remove = function(r) {
          return that.iterate(r, function(key, r) {
            var l;
            if (that.spacemap.hasOwnProperty(key)) {
              l = that.spacemap[key];
              return delete l[r.shid];
            }
          });
        };
        that.move = function() {
          return null;
        };
        return that;
      };
    };
  });
}).call(this);
