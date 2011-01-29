// interface.js
//
// When input is translated into action, it's an interface that does it.

(function(global, $) {
  
  loki.define('tileutils', 'assets', function(env) {
    var tilesize = env.tilesize,
      totilepos = env.totilepos,
      im = env.imagemanager;
    
    loki.modules.interfaces = function(env) {      
      // requires:
      // * game
      // * recipe - an array of recipes from the items module
      env.craftinginterface = function(args) {
        var that = {};
        
        that.docraft = function() {
          $('#craftscreen').toggle();
        };
        
        // returns the HTML necessary to make a row corresponding to
        // the given recipe.
        that.makerow = function(recipe, index) {
          index = index || 0;
          // first cell is the result
          var firstcell = '<td><img src="' + im.get(recipe.resulttype.imagename).src + '"></td>';
          // create second cell's image tag and numeric label
          var secondcell = [];
          secondcell.push('<td>');
          for (var i = 0; i < recipe.ingredients.length; i++) {
            var ing = recipe.ingredients[i];
            secondcell.push('<img src="' + im.get(ing.type.imagename).src + '">');
            secondcell.push(' &times; ');
            secondcell.push(ing.count);
            secondcell.push('<br>');
          }
          secondcell.push('</td>');
          // third cell is the craft button
          var thirdcell = '<td><button class="craftit gameui" data-recipe-index="' + index + '">Craft</button></td>';
          return '<tr>' + firstcell + secondcell.join('') + thirdcell + '</tr>';
        }
        
        // add a craft screen
        // craft screen is a table with three columns: ingredients, result,
        // and a craft button
        $('<div id="craftscreen"><table><thead><tr><td>To make...</td><td>You need...</td>' +
          '<td></td></tr></thead><tbody></tbody></table>' +
          '<div class="maxcenter"><button id="donebutton" class="gameui">Done</button></div>' +
          '</div>')
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

        // add a Craft button to the game interface
        $('<button class="gameui" id="craftbutton">Craft</button>')
          .click(function() {
            that.docraft();
          })
          .insertAfter(args.game.canvas);
        
        // set the done button to dismiss the craft screen
        $('#donebutton').click(function() {
          that.docraft();
        });
        
        // hook up those craft buttons...
        $('.craftit').click(function() {
          // retrieve the recipe index...
          var index = this.getAttribute('data-recipe-index');
          if (index) {
            var recipe = args.recipes[index];
            if (recipe) {
              if (!recipe.cancraft(args.game.player.inventory)) {
                alert("You don't have the inventory to craft that yet!");
                return;
              }
              var item = recipe.craft(args.game.player.inventory, args.game);
              // add the item to the player's inventory...
              args.game.player.inventory.add(item);
            }
          }
        });
        
        return that;
      }; // craftinginterface
    };
    
  })
  
}(this, jQuery));