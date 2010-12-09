// interface.js
//
// When input is translated into action, it's an interface that does it.

(function(global, $) {
  
  loki.define('tileutils', 'assets', function(env) {
    var tilesize = env.tilesize,
      totilepos = env.totilepos,
      im = env.imagemanager;
    
    loki.modules.interfaces = function(env) {
      env.mininginterface = function(args) {
        var that = {};

        that.canact = false;
        that.mousesel = {
          x: 0,
          y: 0
        };

        // returns selected tile in tile-space coordinates.
        that.getselpos = function() {
          var t = totilepos(
            args.game.mousemanager.pos.x + args.game.worldoffset.x,
            args.game.mousemanager.pos.y + args.game.worldoffset.y);
          return t;
        }

        // returns a rect based on the current mouse position aligned with the
        // offset tiles underneath.
        that.reticlerect = function() {
          // clamp to tile coordinates
          var t = that.getselpos();
          return {
            x1: (t.x * tilesize) - args.game.worldoffset.x,
            y1: (t.y * tilesize) - args.game.worldoffset.y,
            x2: (t.x * tilesize) - args.game.worldoffset.x + tilesize,
            y2: (t.y * tilesize) - args.game.worldoffset.y + tilesize
          };
        }

        that.draw = function(drawthing) {
          drawthing.hud.push(function(ctx) {
            var rect = that.reticlerect();
            var style = that.canact ? 'hsla(120, 80%, 50%, 0.9)' : 'hsla(120, 0%, 50%, 0.9)';
            ctx.strokeStyle = style;
            ctx.strokeRect(rect.x1, rect.y1, rect.x2 - rect.x1, rect.y2 - rect.y1);
          })
        };

        that.setcanact = function() {
          // what tilepos is the player at?
          var playertilepos = totilepos(args.game.player.x, args.game.player.y);
          that.canact = Math.abs(that.mousesel.x - playertilepos.x) <= 1 &&
            Math.abs(that.mousesel.y - playertilepos.y) <= 1;
        }

        that.dig = function() {
          if (!that.canact || !args.game.mousemanager.leftbutton) {
            return;
          }
          var t = args.game.tilemap.get(that.mousesel.x, that.mousesel.y);
          t.damage(args.game.player.minedamage);
        };

        that.place = function() {
          if (!that.canact || !args.game.mousemanager.rightbutton) {
            return;
          }
    		  var i = args.game.player.inventory.getsel();
    		  // do we have anything to drop?
    		  if (i === null) {
    		    return;
    		  };
    		  // we have something to drop... place it
    		  var result = i.place(that.mousesel.x * tilesize, that.mousesel.y * tilesize);
    		  // did it actually get placed?
    		  if (!result) {
    		    return;
    		  }
    		  args.game.player.inventory.dropsel();
        };

        that.tick = function() {
          // get the mouse selection
          that.mousesel = that.getselpos();
          // can we act?
          that.setcanact();
          // are we digging?
          that.dig();
          // are we placing?
          that.place();
        };

        return that;
      }; // mininginterface
      
      env.craftinginterface = function(args) {
        var that = {};
        
        that.docraft = function() {
          $('#craftscreen').toggle();
        };
        
        // returns the HTML necessary to make a row corresponding to
        // the given recipe.
        that.makerow = function(recipe) {
          // create first cell's image tag and numeric label
          var firstcell = [];
          firstcell.push('<td>');
          for (var i = 0; i < recipe.ingredients.length; i++) {
            var ing = recipe.ingredients[i];
            firstcell.push('<img src="' + im.get(ing.type.imagename).src + '">');
            firstcell.push('&times; ');
            firstcell.push(ing.count);
            firstcell.push('<br>');
          }
          firstcell.push('</td>');
          // second cell is the result
          var secondcell = '<td><img src="' + im.get(recipe.resulttype.imagename).src + '"></td>';
          // third cell is the craft button
          return '<tr>' + firstcell.join('') + secondcell + '</tr>';
        }
        
        // add a Craft button to the game interface
        $('<button class="gameui" id="craftbutton">Craft</button>')
          .click(function() {
            that.docraft();
          })
          .insertAfter(args.game.canvas);
        
        // add a craft screen
        // craft screen is a table with three columns: ingredients, result,
        // and a craft button
        $('<div id="craftscreen"><table><thead><tr><td>Ingredients</td><td>Result</td><td></td></tr></thead><tbody></tbody></table></div>')
          .hide()
          .insertAfter(args.game.canvas);

        // insert a row for each recipe
        if (args.recipes && args.recipes.length) {
          var screenbody = $('#craftscreen tbody');
          for (var i = 0; i < args.recipes.length; i++) {
            var recipehtml = that.makerow(args.recipes[i]);
            $(recipehtml).appendTo(screenbody);
          }
        }
        
        return that;
      }; // craftinginterface
    };
    
  })
  
}(this, jQuery));