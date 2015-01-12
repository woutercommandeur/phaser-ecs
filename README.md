# Phaser ECS Plugin

This is an Entity Component System plugin (ECS) for the [Phaser][0] game framework. It is based upon the [makrjs][1] ECS.

[0]: https://github.com/photonstorm/phaser
[1]: https://github.com/speedr/makrjs

## How to use?

Use the phaser-ecs.js file from the dist folder in your project. See the examples folder for some usages.

This is essentially a pretty thin wrapper around makrjs.

## How to run the examples

Either copy the examples folder to the webroot of your webserver or run the gulp examples task.

To run the task after cloning this repo:

npm install

gulp examples

Then point your browser to http://localhost:9000/ and you should see a bunnies and invaders folder.
