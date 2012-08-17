# Burrow Defender

JS game prototype where you play a (mostly) defenseless little bunny who is being stalked and attacked by an army of foxes in a procedurally generated world.

## Overview

This prototype achieves the following goals:

 * Player can move around the world using the arrow keys and jump using the spacebar.
 * Player can dig by holding down SHIFT and the arrow keys.
 * Player can place dug dirt by pressing Z and the arrow keys.
 * Procedurally generate a small section of the world.
 * Craft defenses by hitting the craft button.
 * Select different slots in inventory by hitting 1 - 8 keys.

## To Play

Checkout the repo and type this into the command line:

    python -m SimpleHTTPServer

You should be able to navigate to `localhost:8000` and play the game.

## The Future

 * Procedurally generate an infinite world with terrain differentiation at lower levels, possible using [Perlin noise][perlin] for interest.
 * Enemies that are generated and come after the player semi-intelligently.
 * More crafting recipes for more interesting items.

   [perlin]: http://en.wikipedia.org/wiki/Perlin_noise
