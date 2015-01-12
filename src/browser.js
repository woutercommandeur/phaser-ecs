var World = require('./world');

var ECSWorld = new World();
Phaser.ECS = ECSWorld;

/**
 * @class Phaser.Plugin.ECS
 * @classdesc Phaser - ECS Plugin based on makrjs by ooflorent
 *
 * @constructor
 * @extends Phaser.Plugin
 *
 * @param {Phaser.Game} game - A reference to the currently running game.
 * @param {Any} parent - The object that owns this plugin, usually Phaser.PluginManager.
 */
function ECS(game, parent) {
    Phaser.Plugin.call(this, game, parent);
    ECSWorld.game = game;
}

//  Extends the Phaser.Plugin template, setting up values we need
ECS.prototype = Object.create(Phaser.Plugin.prototype);
ECS.prototype.constructor = ECS;

module.exports = ECS;

ECS.prototype.init = function () {};

ECS.prototype.update = function() {
    ECSWorld.update(this.game.time.physicsElapsed);
};

ECS.prototype.destroy = function () {
    Phaser.Plugin.prototype.destroy.apply(this, arguments);
    // Do destruction of our own here
};
