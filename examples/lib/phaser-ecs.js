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

},{"./world":12}],2:[function(require,module,exports){
/**
 * @class BitSet
 * @constructor
 * @param {Uint} size
 */
function BitSet(size) {
  /**
   * @private
   * @property {Uint} _length
   */
  var length = this._length = Math.ceil(size / 32);

  /**
   * @private
   * @property {Array} _words
   */
  var words = this._words = new Array(length);

  // Create empty words
  while (length--) {
    words[length] = 0;
  }
}

/**
 * @method set
 * @param {Uint} index
 * @param {Boolean} value
 */
BitSet.prototype.set = function(index, value) {
  var wordOffset = index / 32 | 0;
  var bitOffset = index - wordOffset * 32;

  if (value) {
    this._words[wordOffset] |= 1 << bitOffset;
  } else {
    this._words[wordOffset] &= ~(1 << bitOffset);
  }
};

/**
 * @method get
 * @param  {Uint} index
 * @return {Boolean}
 */
BitSet.prototype.get = function(index) {
  var wordOffset = index / 32 | 0;
  var bitOffset = index - wordOffset * 32;

  return !!(this._words[wordOffset] & (1 << bitOffset));
};

/**
 * @method reset
 */
BitSet.prototype.reset = function() {
  var words = this._words;
  var i = this._length;

  while (i--) {
    words[i] = 0;
  }
};

/**
 * @method contains
 * @param  {BitSet} other
 * @return {Boolean}
 */
BitSet.prototype.contains = function(other) {
  var words = this._words;
  var i = this._length;

  if (i != other._length) {
    return false;
  }

  while (i--) {
    if ((words[i] & other._words[i]) != other._words[i]) {
      return false;
    }
  }

  return true;
};

module.exports = BitSet;

},{}],3:[function(require,module,exports){
var makr = require('./global');
var BitSet = require('./bit_set');
var FastBitSet = require('./fast_bit_set');

/**
 * @final
 * @class Entity
 * @constructor
 */
function Entity(world, id) {
  /**
   * @private
   * @property {Uint} _id
   */
  this._id = id;

  /**
   * @private
   * @property {World} _world
   */
  this._world = world;

  /**
   * @private
   * @property {Boolean} _alive
   */
  this._alive = true;

  /**
   * @private
   * @property {Boolean} _waitingForRefresh
   */
  this._waitingForRefresh = false;

  /**
   * @private
   * @property {Boolean} _waitingForRemoval
   */
  this._waitingForRemoval = false;

  /**
   * @private
   * @property {BitSet} _componentMask
   */
  this._componentMask = makr.MAX_COMPONENTS <= 32
    ? new FastBitSet()
    : new BitSet(makr.MAX_COMPONENTS);

  /**
   * @private
   * @property {BitSet} _groupMask
   */
  this._groupMask = makr.MAX_GROUPS <= 32
    ? new FastBitSet()
    : new BitSet(makr.MAX_GROUPS);

  /**
   * @private
   * @property {BitSet} _systemMask
   */
  this._systemMask = makr.MAX_SYSTEMS <= 32
    ? new FastBitSet()
    : new BitSet(makr.MAX_SYSTEMS);
}

/**
 * @method get
 * @param  {Uint} type
 * @return {Object}
 */
Entity.prototype.get = function Entity_get(type) {
  return this._world._getComponent(this, type);
};

/**
 * @method add
 * @param {Object} component
 * @param {Uint} type
 */
Entity.prototype.add = function Entity_add(component, type) {
  this._world._addComponent(this, component, type);
};

/**
 * @method remove
 * @param {Uint} type
 */
Entity.prototype.remove = function Entity_remove(type) {
  this._world._removeComponent(this, type);
};

/**
 * @method clear
 */
Entity.prototype.clear = function Entity_clear() {
  this._world._removeComponents(this);
};

/**
 * @method kill
 */
Entity.prototype.kill = function Entity_kill() {
  this._world.kill(this);
};

/**
 * @property {Uint} id
 */
Object.defineProperty(Entity.prototype, 'id', {
  get: function() {
    return this._id;
  }
});

/**
 * @property {Boolean} alive
 */
Object.defineProperty(Entity.prototype, 'alive', {
  get: function() {
    return this._alive;
  }
});

module.exports = Entity;

},{"./bit_set":2,"./fast_bit_set":4,"./global":5}],4:[function(require,module,exports){
/**
 * @class FastBitSet
 * @constructor
 */
function FastBitSet() {
  /**
   * @private
   * @property {Uint} _bits
   */
  this._bits = 0;
}

/**
 * @method set
 * @param {Uint} index
 * @param {Boolean} value
 */
FastBitSet.prototype.set = function(index, value) {
  if (value) {
    this._bits |= 1 << index;
  } else {
    this._bits &= ~(1 << index);
  }
};

/**
 * @method get
 * @param  {Uint} index
 * @return {Boolean}
 */
FastBitSet.prototype.get = function(index) {
  return !!(this._bits & (1 << index));
};

/**
 * @method reset
 */
FastBitSet.prototype.reset = function() {
  this._bits = 0;
};

/**
 * @method contains
 * @param  {FastBitSet} other
 * @return {Boolean}
 */
FastBitSet.prototype.contains = function(other) {
  return (this._bits & other._bits) == other._bits;
};

module.exports = FastBitSet;

},{}],5:[function(require,module,exports){
/**
 * @module makr
 * @param {Object} config
 */
function makr(config) {
  if (config) {
    for (var p in config) {
      if (config.hasOwnProperty(p)) {
        makr[p] = config[p];
      }
    }
  }
}

module.exports = makr;

},{}],6:[function(require,module,exports){
var makr = require('./global')

// Install default config
makr.MAX_COMPONENTS = 32;
makr.MAX_GROUPS = 32;
makr.MAX_SYSTEMS = 32;

// Register makr classes
makr.BitSet = require('./bit_set');
makr.FastBitSet = require('./fast_bit_set');
makr.IteratingSystem = require('./iterating_system');
makr.System = require('./system');
makr.World = require('./world');

module.exports = makr;

},{"./bit_set":2,"./fast_bit_set":4,"./global":5,"./iterating_system":7,"./system":8,"./world":9}],7:[function(require,module,exports){
var System = require('./system');

/**
 * @class IteratingSystem
 * @extends {System}
 * @constructor
 */
function IteratingSystem() {
  System.call(this);
}

// Extend System
IteratingSystem.prototype = Object.create(System.prototype, {
  constructor: {
    value: IteratingSystem,
    enumerable: false,
    writable: true,
    configurable: true
  }
});

/**
 * @override
 */
IteratingSystem.prototype.processEntities = function(entities, elapsed) {
  var i = 0;
  var n = entities.length;

  for (i = 0; i < n; i++) {
    this.process(entities[i], elapsed);
  }
};

/**
 * @method process
 * @param {Entity} entity
 * @param {Float} elapsed
 */
IteratingSystem.prototype.process = function(entity, elapsed) {};

module.exports = IteratingSystem;

},{"./system":8}],8:[function(require,module,exports){
var makr = require('./global');
var BitSet = require('./bit_set');
var FastBitSet = require('./fast_bit_set');

/**
 * A system that processes entities.
 *
 * @class System
 * @constructor
 */
function System() {
  /**
   * @private
   * @property {BitSet} _componentMask
   */
  this._componentMask = makr.MAX_COMPONENTS <= 32
    ? new FastBitSet()
    : new BitSet(makr.MAX_COMPONENTS);

  /**
   * @private
   * @property {Entity[]} _entities
   */
  this._entities = [];

  /**
   * @private
   * @property {World} _world
   */
  this._world = null;

  /**
   * @property {Boolean} enabled
   */
  this.enabled = true;
}

/**
 * @final
 * @method registerComponent
 * @param {Uint} type
 */
System.prototype.registerComponent = function(type) {
  this._componentMask.set(type, 1);
};

/**
 * @final
 * @method update
 * @param {Float} elapsed
 */
System.prototype.update = function(elapsed) {
  if (this.enabled) {
    this.onBegin();
    this.processEntities(this._entities, elapsed);
    this.onEnd();
  }
};

/**
 * @method processEntities
 * @param {Entity[]} entities
 * @param {Float} elapsed
 */
System.prototype.processEntities = function(entities, elapsed) {};

/**
 * @method onRegistered
 */
System.prototype.onRegistered = function() {};

/**
 * @method onBegin
 */
System.prototype.onBegin = function() {};

/**
 * Called after the end of processing.
 *
 * @method onEnd
 */
System.prototype.onEnd = function() {};

/**
 * Called when an entity is added to this system
 *
 * @method onAdded
 * @param {Entity} entity
 */
System.prototype.onAdded = function(entity) {};

/**
 * Called when an entity is removed from this system
 *
 * @method onRemoved
 * @param {Entity} entity
 */
System.prototype.onRemoved = function(entity) {};

/**
 * @private
 * @method _addEntity
 * @param {Entity} entity
 */
System.prototype._addEntity = function(entity) {
  var entities = this._entities;
  if (entities.indexOf(entity) < 0) {
    entities.push(entity);
    this.onAdded(entity);
  }
};

/**
 * @private
 * @method _removeEntity
 * @param {Entity} entity
 */
System.prototype._removeEntity = function(entity) {
  var entities = this._entities;
  var i = entities.indexOf(entity);
  if (i >= 0) {
    entities[i] = entities[entities.length - 1];
    entities.pop();
    this.onRemoved(entity);
  }
};

/**
 * @property {Boolean} world
 */
Object.defineProperty(System.prototype, 'world', {
  get: function() {
    return this._world;
  }
});

module.exports = System;

},{"./bit_set":2,"./fast_bit_set":4,"./global":5}],9:[function(require,module,exports){
var Entity = require('./entity');

/**
 * The primary instance for the framework. It contains all the managers.
 * You must use this to create, delete and retrieve entities.
 *
 * @final
 * @class World
 * @constructor
 */
function World() {
  /**
   * @private
   * @property {System[]} _systems
   */
  this._systems = [];

  /**
   * @private
   * @property {Uint} _nextEntityID
   */
  this._nextEntityID = 0;

  this._nextGroupId = 0;
  this._groups = [];
  this._groupIDs = {};

  /**
   * @private
   * @property {Entity[]} _alive
   */
  this._alive = [];

  /**
   * @private
   * @property {Entity[]} _dead
   */
  this._dead = [];

  /**
   * @private
   * @property {Entity[]} _removed
   */
  this._removed = [];

  /**
   * @private
   * @property {Entity[]} _refreshed
   */
  this._refreshed = [];

  /**
   * @private
   * @property {Object[][]} _componentBags
   */
  this._componentBags = [];
}

/**
 * Registers the specified system.
 *
 * @method registerSystem
 * @param {System} system
 */
World.prototype.registerSystem = function(system) {
  if (this._systems.indexOf(system) >= 0) {
    throw "Cannot register a system twice";
  }

  this._systems.push(system);

  system._world = this;
  system.onRegistered();
};

/**
 * Creates a new entity.
 *
 * @method create
 * @return {Entity}
 */
World.prototype.create = function() {
  var entity;
  if (this._dead.length > 0) {
    // Revive entity
    entity = this._dead.pop();
    entity._alive = true;
  } else {
    entity = new Entity(this, this._nextEntityID++);
  }

  this._alive.push(entity);
  return entity;
};

/**
 * Kills the specified entity.
 *
 * @method kill
 * @param {Entity} entity
 */
World.prototype.kill = function(entity) {
  if (!entity._waitingForRemoval) {
    entity._waitingForRemoval = true;
    this._removed.push(entity);
  }
};

/**
 * Queues the entity to be refreshed.
 *
 * @method refresh
 * @param {Entity} entity
 */
World.prototype.refresh = function(entity) {
  if (!entity._waitingForRefresh) {
    entity._waitingForRefresh = true;
    this._refreshed.push(entity);
  }
};

/**
 * Updates all systems.
 *
 * @method update
 * @param {Float} elapsed
 */
World.prototype.update = function(elapsed) {
  // Process entities
  this.loopStart();

  var systems = this._systems;
  var i = 0;
  var n = systems.length;

  for (; i < n; i++) {
    systems[i].update(elapsed);
  }
};

/**
 * Processes all queued entities.
 *
 * @method loopStart
 */
World.prototype.loopStart = function() {
  var i;

  // Process entities queued for removal
  for (i = this._removed.length; i--;) {
    this._removeEntity(this._removed[i]);
  }

  this._removed.length = 0;

  // Process entities queued for refresh
  for (i = this._refreshed.length; i--;) {
    this._refreshEntity(this._refreshed[i]);
  }

  this._refreshed.length = 0;
};

/**
 * Add the entity to the specified group.
 *
 * @method addToGroup
 * @param {Entity} entity
 * @param {String} groupName
 */
World.prototype.addToGroup = function(entity, groupName) {
  var group;
  var groupID = this._groupIDs[groupName];
  if (groupID === undefined) {
    groupID = this._groupIDs[groupName] = this._nextGroupId++;
    group = this._groups[groupID] = [];
  } else {
    group = this._groups[groupID];
  }

  if (!entity._groupMask.get(groupID)) {
    entity._groupMask.set(groupID, 1);
    group.push(entity);
  }
};

/**
 * Remove the entity from the specified group.
 *
 * @method removeFromGroup
 * @param {Entity} entity
 * @param {String} groupName
 */
World.prototype.removeFromGroup = function(entity, groupName) {
  var groupID = this._groupIDs[groupName];
  if (groupID !== undefined) {
    var group = this._groups[groupID];
    if (entity._groupMask.get(groupID)) {
      entity._groupMask.set(groupID, 0);
      group[group.indexOf(entity)] = group[group.length - 1];
      group.pop();
    }
  }
};

/**
 * Remove the entity from all groups.
 *
 * @method removeFromGroups
 * @param {Entity} entity
 */
World.prototype.removeFromGroups = function(entity) {
  for (var groupID = this._nextGroupId; groupID--;) {
    if (entity._groupMask.get(groupID)) {
      var group = this._groups[groupID];
      group[group.indexOf(entity)] = group[group.length - 1];
      group.pop();
    }
  }

  entity._groupMask.reset();
};

/**
 * Get all entities of the specified group.
 *
 * @method getEntitiesByGroup
 * @param  {String} groupName
 * @return {Entity[]}
 */
World.prototype.getEntitiesByGroup = function(groupName) {
  var groupID = this._groupIDs[groupName];
  return groupID !== undefined ? this._groups[groupID] : [];
};

/**
 * Get whether the entity is in the specified group.
 *
 * @param  {Entity} entity
 * @param  {String} groupName
 * @return {Boolean}
 */
World.prototype.isInGroup = function(entity, groupName) {
  var groupID = this._groupIDs[groupName];
  return groupID !== undefined && entity._groupMask.get(groupID);
};

/**
 * @private
 * @method _refreshEntity
 * @param {Entity} entity
 */
World.prototype._refreshEntity = function(entity) {
  // Unset refresh flag
  entity._waitingForRefresh = false;

  var systems = this._systems;
  var i = 0;
  var n = systems.length;

  for (; i < n; i++) {
    var contains = entity._systemMask.get(i);
    var interested = entity._componentMask.contains(systems[i]._componentMask);

    if (contains && !interested) {
      // Remove entity from the system
      systems[i]._removeEntity(entity);
      entity._systemMask.set(i, 0);
    } else if (!contains && interested) {
      // Add entity to the system
      systems[i]._addEntity(entity);
      entity._systemMask.set(i, 1);
    }
  }
};

/**
 * @private
 * @method _removeEntity
 * @param {Entity} entity
 */
World.prototype._removeEntity = function(entity) {
  if (entity._alive) {
    // Unset removal flag
    entity._waitingForRemoval = false;

    // Murder the entity!
    entity._alive = false;

    // Remove from alive entities by swapping with the last entity
    this._alive[this._alive.indexOf(entity)] = this._alive[this._alive.length - 1];
    this._alive.pop();

    // Add to dead entities
    this._dead.push(entity);

    // Reset component mask
    entity._componentMask.reset();

    // Remove from groups
    this.removeFromGroups(entity);

    // Refresh entity
    this._refreshEntity(entity);
  }
};

/**
 * @private
 * @method _getComponent
 * @param  {Entity} entity
 * @param  {Uint} type
 * @return {Object}
 */
World.prototype._getComponent = function(entity, type) {
  if (entity._componentMask.get(type)) {
    return this._componentBags[entity._id][type];
  }

  return null;
};

/**
 * @private
 * @method _addComponent
 * @param {Entity} entity
 * @param {Object} component
 * @param {type} type
 */
World.prototype._addComponent = function(entity, component, type) {
  entity._componentMask.set(type, 1);

  this._componentBags[entity._id] || (this._componentBags[entity._id] = []);
  this._componentBags[entity._id][type] = component;

  this.refresh(entity);
};

/**
 * @private
 * @method _removeComponent
 * @param {Entity} entity
 * @param {Uint} type
 */
World.prototype._removeComponent = function(entity, type) {
  entity._componentMask.set(type, 0);
  this.refresh(entity);
};

/**
 * @private
 * @method _removeComponents
 * @param {Entity} entity
 */
World.prototype._removeComponents = function(entity) {
  entity._componentMask.reset();
  this.refresh(entity);
};

module.exports = World;

},{"./entity":3}],10:[function(require,module,exports){
'use strict';

var makr = require('makr');

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

},{"makr":6}],11:[function(require,module,exports){
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

},{}],12:[function(require,module,exports){
var makr = require('makr'),
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

},{"./system":10,"./utils":11,"makr":6}]},{},[1])(1)
});