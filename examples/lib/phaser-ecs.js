!function(e){if("object"==typeof exports&&"undefined"!=typeof module)module.exports=e();else if("function"==typeof define&&define.amd)define([],e);else{var n;"undefined"!=typeof window?n=window:"undefined"!=typeof global?n=global:"undefined"!=typeof self&&(n=self);var f=n;f=f.Phaser||(f.Phaser={}),f=f.Plugin||(f.Plugin={}),f.ECS=e()}}(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
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

},{"./world":5}],2:[function(require,module,exports){
(function (global){
(function(){function a(b){if(b)for(var c in b)b.hasOwnProperty(c)&&(a[c]=b[c])}function b(a){for(var b=this._length=Math.ceil(a/32),c=this._words=new Array(b);b--;)c[b]=0}function c(){this._bits=0}function d(d,e){this._id=e,this._world=d,this._alive=!0,this._waitingForRefresh=!1,this._waitingForRemoval=!1,this._componentMask=a.MAX_COMPONENTS<=32?new c:new b(a.MAX_COMPONENTS),this._groupMask=a.MAX_GROUPS<=32?new c:new b(a.MAX_GROUPS),this._systemMask=a.MAX_SYSTEMS<=32?new c:new b(a.MAX_SYSTEMS)}function e(){this._systems=[],this._nextEntityID=0,this._nextGroupId=0,this._groups=[],this._groupIDs={},this._alive=[],this._dead=[],this._removed=[],this._refreshed=[],this._componentBags=[]}function f(){this._componentMask=a.MAX_COMPONENTS<=32?new c:new b(a.MAX_COMPONENTS),this._entities=[],this._world=null,this.enabled=!0}function g(){f.call(this)}a.MAX_COMPONENTS=32,a.MAX_GROUPS=32,a.MAX_SYSTEMS=32;var h=[];b.prototype.set=function(a,b){var c=a/32|0,d=a-32*c;b?this._words[c]|=1<<d:this._words[c]&=~(1<<d)},b.prototype.get=function(a){var b=a/32|0,c=a-32*b;return!!(this._words[b]&1<<c)},b.prototype.reset=function(){for(var a=this._words,b=this._length;b--;)a[b]=0},b.prototype.contains=function(a){var b=this._words,c=this._length;if(c!=a._length)return!1;for(;c--;)if((b[c]&a._words[c])!=a._words[c])return!1;return!0},c.prototype.set=function(a,b){b?this._bits|=1<<a:this._bits&=~(1<<a)},c.prototype.get=function(a){return!!(this._bits&1<<a)},c.prototype.reset=function(){this._bits=0},c.prototype.contains=function(a){return(this._bits&a._bits)==a._bits},d.prototype.get=function(a){return this._world._getComponent(this,a)},d.prototype.add=function(a,b){this._world._addComponent(this,a,b)},d.prototype.remove=function(a){this._world._removeComponent(this,a)},d.prototype.clear=function(){this._world._removeComponents(this)},d.prototype.kill=function(){this._world.kill(this)},Object.defineProperty(d.prototype,"id",{get:function(){return this._id}}),Object.defineProperty(d.prototype,"alive",{get:function(){return this._alive}}),e.prototype.registerSystem=function(a){if(this._systems.indexOf(a)>=0)throw"Cannot register a system twice";this._systems.push(a),a._world=this,a.onRegistered()},e.prototype.create=function(){var a;return this._dead.length>0?(a=this._dead.pop(),a._alive=!0):a=new d(this,this._nextEntityID++),this._alive.push(a),a},e.prototype.kill=function(a){a._waitingForRemoval||(a._waitingForRemoval=!0,this._removed.push(a))},e.prototype.refresh=function(a){a._waitingForRefresh||(a._waitingForRefresh=!0,this._refreshed.push(a))},e.prototype.update=function(a){this.loopStart();for(var b=this._systems,c=0,d=b.length;d>c;c++)b[c].update(a)},e.prototype.loopStart=function(){var a;for(a=this._removed.length;a--;)this._removeEntity(this._removed[a]);for(this._removed.length=0,a=this._refreshed.length;a--;)this._refreshEntity(this._refreshed[a]);this._refreshed.length=0},e.prototype.addToGroup=function(a,b){var c,d=this._groupIDs[b];void 0===d?(d=this._groupIDs[b]=this._nextGroupId++,c=this._groups[d]=[]):c=this._groups[d],a._groupMask.get(d)||(a._groupMask.set(d,1),c.push(a))},e.prototype.removeFromGroup=function(a,b){var c=this._groupIDs[b];if(void 0!==c){var d=this._groups[c];a._groupMask.get(c)&&(a._groupMask.set(c,0),d[d.indexOf(a)]=d[d.length-1],d.pop())}},e.prototype.removeFromGroups=function(a){for(var b=this._nextGroupId;b--;)if(a._groupMask.get(b)){var c=this._groups[b];c[c.indexOf(a)]=c[c.length-1],c.pop()}a._groupMask.reset()},e.prototype.getEntitiesByGroup=function(a){var b=this._groupIDs[a];return void 0!==b?this._groups[b]:h},e.prototype.isInGroup=function(a,b){var c=this._groupIDs[b];return void 0!==c&&a._groupMask.get(c)},e.prototype._refreshEntity=function(a){a._waitingForRefresh=!1;for(var b=this._systems,c=0,d=b.length;d>c;c++){var e=a._systemMask.get(c),f=a._componentMask.contains(b[c]._componentMask);e&&!f?(b[c]._removeEntity(a),a._systemMask.set(c,0)):!e&&f&&(b[c]._addEntity(a),a._systemMask.set(c,1))}},e.prototype._removeEntity=function(a){a._alive&&(a._waitingForRemoval=!1,a._alive=!1,this._alive[this._alive.indexOf(a)]=this._alive[this._alive.length-1],this._alive.pop(),this._dead.push(a),a._componentMask.reset(),this.removeFromGroups(a),this._refreshEntity(a))},e.prototype._getComponent=function(a,b){return a._componentMask.get(b)?this._componentBags[a._id][b]:null},e.prototype._addComponent=function(a,b,c){a._componentMask.set(c,1),this._componentBags[a._id]||(this._componentBags[a._id]=[]),this._componentBags[a._id][c]=b,this.refresh(a)},e.prototype._removeComponent=function(a,b){a._componentMask.set(b,0),this.refresh(a)},e.prototype._removeComponents=function(a){a._componentMask.reset(),this.refresh(a)},f.prototype.registerComponent=function(a){this._componentMask.set(a,1)},f.prototype.update=function(a){this.enabled&&(this.onBegin(),this.processEntities(this._entities,a),this.onEnd())},f.prototype.processEntities=function(){},f.prototype.onRegistered=function(){},f.prototype.onBegin=function(){},f.prototype.onEnd=function(){},f.prototype.onAdded=function(){},f.prototype.onRemoved=function(){},f.prototype._addEntity=function(a){var b=this._entities;b.indexOf(a)<0&&(b.push(a),this.onAdded(a))},f.prototype._removeEntity=function(a){var b=this._entities,c=b.indexOf(a);c>=0&&(b[c]=b[b.length-1],b.pop(),this.onRemoved(a))},Object.defineProperty(f.prototype,"world",{get:function(){return this._world}}),g.prototype=Object.create(f.prototype,{constructor:{value:g,enumerable:!1,writable:!0,configurable:!0}}),g.prototype.processEntities=function(a,b){var c=0,d=a.length;for(c=0;d>c;c++)this.process(a[c],b)},g.prototype.process=function(){},a.BitSet=b,a.FastBitSet=c,a.IteratingSystem=g,a.System=f,a.World=e;var i={"boolean":!1,"function":!0,object:!0,number:!1,string:!1,undefined:!1},j=i[typeof window]&&window||this,k=i[typeof global]&&global;!k||k.global!==k&&k.window!==k||(j=k),"function"==typeof define&&"object"==typeof define.amd&&define.amd?define([],function(){return a}):i[typeof module]&&module.exports?module.exports=a:j.makr=a}).call(this);
}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}],3:[function(require,module,exports){
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

},{"makrjs":2}],4:[function(require,module,exports){
var utils = module.exports = {};

utils.ComponentRegister = (function() {
    var nextType = 0;
    var ctors = [];
    var types = [];

    return {
        register: function(ctor) {
            var i = ctors.indexOf(ctor);
            if (i < 0) {
                ctors.push(ctor);
                types.push(nextType++);
                return nextType-1;
            } else {
                return types[i];
            }
        },
        get: function(ctor) {
            var i = ctors.indexOf(ctor);
            if (i < 0) {
                throw "Unknown type " + ctor;
            }

            return types[i];
        }
    };
})();

utils.inherits = function(ctor, superCtor, methods) {
    ctor.prototype = Object.create(superCtor.prototype);
    ctor.prototype.constructor = ctor;

    if (methods) {
        for (var p in methods) {
            if (methods.hasOwnProperty(p)) {
                ctor.prototype[p] = methods[p];
            }
        }
    }
};

},{}],5:[function(require,module,exports){
var makr = require('makrjs'),
    System = require('./system'),
    utils = require('./utils');

function World() {
    makr.World.call(this);
    this.game = false;
    this.componentRegister = utils.ComponentRegister;
    this.System = System;
}

//  Extends the Phaser.Plugin template, setting up values we need
World.prototype = Object.create(makr.World.prototype);
World.prototype.constructor = makr.World;

World.prototype.getComponent = function(component) {
    return this.componentRegister.get(component);
};

World.prototype.registerComponent = function(component) {
    return this.componentRegister.register(component);
};

module.exports = World;

},{"./system":3,"./utils":4,"makrjs":2}]},{},[1])(1)
});