'use strict';

var makr = require('makrjs');

function System() {
    makr.IteratingSystem.call(this);
    this.game = Phaser.ECS.game;
}

System.prototype = Object.create(makr.IteratingSystem.prototype);
System.prototype.constructor = System;

System.prototype.getComponent = function(component) {
    return Phaser.ECS.getComponent(component);
};

module.exports = System;
