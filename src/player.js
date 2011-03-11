(function() {
  var CANVAS_HEIGHT, CANVAS_WIDTH, HEIGHT, MAXITEMS, PADDING, STOPFORCE, WIDTH, walking;
  walking = {
    LEFT: -1,
    STANDING: 0,
    RIGHT: 1,
    DOWN: 2,
    UP: 3
  };
  STOPFORCE = 0.2;
  PADDING = 5;
  CANVAS_WIDTH = 600;
  CANVAS_HEIGHT = 500;
  WIDTH = CANVAS_WIDTH - PADDING * 2;
  HEIGHT = 50;
  MAXITEMS = 8;
  loki.define('actions', 'assets', 'graphics', 'mob', 'tileutils', 'components', function(env) {
    var action, actionable, animation, animrepeat, animsequence, damageable, falling, imagemanager, jumping, mob, runningleft, runningright, spritemanager, standing, tilesize, totilepos;
    mob = env.mob;
    tilesize = env.tilesize;
    totilepos = env.totilepos;
    damageable = env.damageable;
    actionable = env.actionable;
    imagemanager = env.imagemanager;
    spritemanager = env.spritemanager;
    animation = env.animation;
    animsequence = env.sequence;
    animrepeat = env.repeater;
    action = env.action;
    imagemanager.add('heartfull', 'assets/images/heartfull.png');
    imagemanager.add('heartempty', 'assets/images/heartempty.png');
    imagemanager.add('player', 'assets/images/player.png');
    spritemanager.add('player', {
      x: 24,
      y: 32
    }, [
      {
        x: 0,
        y: 298
      }, {
        x: 25,
        y: 298
      }, {
        x: 50,
        y: 298
      }, {
        x: 75,
        y: 298
      }, {
        x: 100,
        y: 298
      }, {
        x: 125,
        y: 298
      }, {
        x: 150,
        y: 298
      }, {
        x: 175,
        y: 298
      }, {
        x: 200,
        y: 298
      }, {
        x: 225,
        y: 298
      }, {
        x: 0,
        y: 265
      }, {
        x: 25,
        y: 265
      }, {
        x: 50,
        y: 265
      }, {
        x: 75,
        y: 265
      }, {
        x: 100,
        y: 265
      }, {
        x: 125,
        y: 265
      }, {
        x: 150,
        y: 265
      }, {
        x: 175,
        y: 265
      }, {
        x: 200,
        y: 265
      }, {
        x: 225,
        y: 265
      }, {
        x: 0,
        y: 232
      }, {
        x: 25,
        y: 232
      }, {
        x: 50,
        y: 232
      }, {
        x: 75,
        y: 232
      }, {
        x: 100,
        y: 232
      }, {
        x: 125,
        y: 232
      }, {
        x: 150,
        y: 232
      }, {
        x: 175,
        y: 232
      }, {
        x: 200,
        y: 232
      }
    ]);
    standing = animation({
      name: 'player',
      frames: [animrepeat([0], 100, 180), 1, 2, 3, 4, 4, 3, 2, 1]
    });
    runningleft = animation({
      name: 'player',
      frames: [5, 5, 6, 6, 7, 7, 8, 8, 9, 9, 10, 10, 11, 11, 12, 12, 13, 13, 14, 14, 15, 15]
    });
    runningright = animation({
      name: 'player',
      frames: [16, 16, 17, 17, 18, 18, 19, 19, 20, 20, 21, 21, 22, 22, 23, 23, 24, 24, 25, 25, 26, 26]
    });
    falling = animation({
      name: 'player',
      frames: [28]
    });
    jumping = animation({
      name: 'player',
      frames: [27]
    });
    return loki.modules.player = function(env) {
      env.inventory = function() {
        var getthingbytype, that, typemap;
        that = {
          x1: PADDING,
          y1: CANVAS_HEIGHT - PADDING - HEIGHT,
          x2: PADDING + WIDTH,
          y2: CANVAS_HEIGHT - PADDING,
          things: {},
          sel: 1
        };
        typemap = {};
        getthingbytype = function(key) {
          return that.things[typemap[key]];
        };
        that.add = function(thing) {
          var index, key, _i, _results;
          if (!thing.hasOwnProperty('type')) {
            throw {
              message: 'Item must have type attribute'
            };
          }
          index = 1;
          key = JSON.stringify(thing.type);
          if (typemap.hasOwnProperty(key)) {
            return index = typemap[key];
          } else {
            index = _.detect((function() {
              _results = [];
              for (var _i = 1; 1 <= MAXITEMS ? _i <= MAXITEMS : _i >= MAXITEMS; 1 <= MAXITEMS ? _i += 1 : _i -= 1){ _results.push(_i); }
              return _results;
            }).apply(this, arguments), function(i) {
              return !that.things.hasOwnProperty(i) || that.things[i].key === key;
            });
            if (!that.things.hasOwnProperty(index)) {
              that.things[index] = {
                key: key,
                instance: thing,
                count: 0
              };
              typemap[key] = index;
            }
            return that.things[index].count += 1;
          }
        };
        that.remove = function(type, count) {
          var key, thing;
          if (count == null) {
            count = 1;
          }
          key = JSON.stringify(type);
          if (!typemap.hasOwnProperty(key)) {
            throw {
              message: 'Nothing of that type in inventory!'
            };
          }
          thing = getthingbytype(key);
          if (thing.count < count) {
            throw {
              message: 'Tried to remove too much!'
            };
          }
          thing.count -= count;
          if (thing.count === 0) {
            delete that.things[typemap[key]];
            return delete typemap[key];
          }
        };
        that.getsel = function() {
          var t;
          t = that.things[that.sel];
          if (!t || t.count === 0) {
            return null;
          } else {
            return t.instance;
          }
        };
        that.dropsel = function() {
          var t;
          t = that.things[that.sel];
          if (typeof t === 'undefined') {
            return null;
          } else {
            that.remove(t.instance.type);
            return t.instance;
          }
        };
        that.draw = function(drawthing) {
          return drawthing.hud.push(function(ctx) {
            var counstr, drawimage, i, invitem, r, selstyle, textwidth, unseltyle, _results;
            ctx.fillStyle = 'hsla(120, 0%, 0%, 0.3)';
            ctx.fillRect(that.x1, that.y1, WIDTH, HEIGHT);
            ctx.lineWidth = 2;
            ctx.fillStyle = 'hsla(120, 100%, 100%, 1.0)';
            ctx.font = '15px Impact';
            unseltyle = 'hsla(120, 10%, 50%, 0.6)';
            selstyle = 'hsla(120, 80%, 50%, 0.6)';
            _results = [];
            for (i = 1; (1 <= MAXITEMS ? i <= MAXITEMS : i >= MAXITEMS); (1 <= MAXITEMS ? i += 1 : i -= 1)) {
              ctx.strokeStyle = i === that.sel ? selstyle : unseltyle;
              r = that.itemrect(i);
              ctx.strokeRect(r.x1, r.y1, r.x2 - r.x1, r.y2 - r.y1);
              _results.push(that.things.hasOwnProperty(i) ? (invitem = that.things[i], drawimage = invitem.instance.drawimage, ctx.save(), ctx.translate(r.x1 + (r.width / 2) - 8, r.y1 + (r.height / 2) - 16), drawimage(ctx), counstr = invitem.count.toString(), textwidth = ctx.measureText(countstr), ctx.fillText(countstr, -(textwidth.width / 2) + 7, 32), ctx.restore()) : void 0);
            }
            return _results;
          });
        };
        that.itemrect = function(i) {
          var peritemwidth, rect, startx;
          i = i - 1;
          peritemwidth = (WIDTH - PADDING * 2) / MAXITEMS;
          startx = that.x1 + PADDING + peritemwidth * i;
          rect = {
            x1: startx + PADDING,
            y1: that.y1 + PADDING,
            x2: startx + peritemwidth - PADDING,
            y2: that.y2 - PADDING
          };
          rect.width = rect.x2 - rect.x1;
          rect.height = rect.y2 - rect.y1;
          return rect;
        };
        that.hasitem = function(type, count) {
          var key;
          if (count == null) {
            count = 1;
          }
          key = JSON.stringify(type);
          if (!typemap.hasOwnProperty(key)) {
            return false;
          }
          return getthingbytype(key).count >= count;
        };
        return that;
      };
      env.moveaction = function(args) {
        var game, keyman, player, that, tileposindirection;
        player = args.player;
        game = args.game;
        keyman = args.game.keyboardmanager;
        that = action();
        that.readkeyboard = function() {
          var _i, _results;
          player.movestate.mining = keyman.keymap['shift'];
          player.movestate.wantstojump = keyman.keymap['space'];
          player.movestate.placing = keyman.keymap['z'];
          if (keyman.keymap['s'] || keyman.keymap['down']) {
            player.movestate.walking = walking.DOWN;
          } else if (keyman.keymap['a'] || keyman.keymap['left']) {
            player.movestate.walking = walking.LEFT;
          } else if (keyman.keymap['d'] || keyman.keymap['right']) {
            player.movestate.walking = walking.RIGHT;
          } else if (keyman.keymap['w'] || keyman.keymap['up']) {
            player.movestate.walking = walking.UP;
          } else {
            player.movestate.walking = walking.STANDING;
          }
          return player.inventory.sel = _.detect((function() {
            _results = [];
            for (var _i = 1; 1 <= MAXITEMS ? _i <= MAXITEMS : _i >= MAXITEMS; 1 <= MAXITEMS ? _i += 1 : _i -= 1){ _results.push(_i); }
            return _results;
          }).apply(this, arguments), function(i) {
            return keyman.keymap[i.toString()];
          });
        };
        tileposindirection = function() {
          var tilepos;
          tilepos = totilepos(player.x + player.size.x / 2, player.y + player.size.y / 2);
          if (player.movestate.walking === walking.LEFT) {
            tilepos.x -= 1;
          } else if (player.movestate.walking === walking.RIGHT) {
            tilepos.x += 1;
          } else if (player.movestate.walking === walking.UP) {
            tilepos.y -= 1;
          } else if (player.movestate.walking === walking.DOWN) {
            tilepos.y += 1;
          }
          return tilepos;
        };
        that.mine = function() {
          var digtile, tilepos;
          if (player.movestate.mining) {
            tilepos = tileposindirection();
            digtile = game.tilemap.get(tilepos.x, tilepos.y);
            if (digtile && _.isFunction(digtile.damage)) {
              return digtile.damage(player.minedamage);
            }
          }
        };
        that.walk = function() {
          if (!player.movestate.placing) {
            if (player.movestate.walking === walking.LEFT) {
              player.vel.x = player.velocities.walkleft;
            }
            if (player.movestate.walking === walking.RIGHT) {
              player.vel.x = player.velocities.walkright;
            }
          } else {
            player.vel.x = player.vel.x < 0 ? Math.min(0, player.vel.x + STOPFORCE) : Math.min(0, player.vel.x - STOPFORCE);
          }
          if (player.movestate.wantstojump) {
            return player.jump();
          }
        };
        that.place = function() {
          var i, result, tilepos;
          if (!player.movestate.placing || player.movestate.walking === walking.STANDING) {
            return;
          }
          i = player.inventory.getsel();
          if (i === null) {
            return;
          }
          tilepos = tileposindirection();
          result = i.place(tilepos.x * tilesize, tilepos.y * tilesize);
          if (!result) {
            return;
          }
          return player.inventory.dropsel();
        };
        that.tick = function() {
          that.readkeyboard();
          that.mine();
          that.walk();
          return that.place();
        };
        that.draw = function(drawthing) {
          return drawthing.sprite1.push(function(ctx) {
            if (!player.movestate.standing && player.vel.y > 0) {
              return falling.draw(ctx, player.x, player.y);
            } else if (!player.movestate.standing && player.vel.y < 0) {
              return jumping.draw(ctx, player.x, player.y);
            } else if (player.movestate.walking === walking.LEFT) {
              return runningleft.draw(ctx, player.x, player.y);
            } else if (player.movestate.walking === walking.RIGHT) {
              return runningright.draw(ctx, player.x, player.y);
            } else {
              return standing.draw(ctx, player.x, player.y);
            }
          });
        };
        return that;
      };
      return env.player = function(args) {
        var moveaction, that;
        that = mob(args);
        that.size = {
          x: 24,
          y: 32
        };
        that.solid = false;
        that.movestate.mining = false;
        that.movestate.wantstojump = false;
        that.movestate.walking = walking.STANDING;
        that.movestate.placing = false;
        that.minedamage = 1;
        damageable(that, {
          health: 5,
          whendamaged: function(amt) {
            return that.movestate.standing = false;
          }
        });
        that.delicious = true;
        actionable(that);
        moveaction = env.moveaction({
          player: that,
          game: args.game
        });
        that.addaction(moveaction);
        that.inventory = env.inventory();
        that.draw = function(drawthing) {
          that.executeactions('draw', drawthing);
          drawthing.hud.push(function(ctx) {
            var i, image, startx, starty, _ref, _results;
            startx = 10;
            starty = 10;
            _results = [];
            for (i = 0, _ref = that.maxhealth; (0 <= _ref ? i < _ref : i > _ref); (0 <= _ref ? i += 1 : i -= 1)) {
              image = 'heartempty';
              if (that.health > i) {
                image = 'heartfull';
              }
              _results.push(imagemanager.draw(ctx, image, startx + (18 * i), starty));
            }
            return _results;
          });
          return that.inventory.draw(drawthing);
        };
        that.tick = function() {
          mob.gravitytick.call(that);
          return that.executeactions('tick');
        };
        return that;
      };
    };
  });
}).call(this);
