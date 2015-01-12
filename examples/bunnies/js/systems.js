// Gravity
// -------

function GravitySystem() {
    Phaser.ECS.System.call(this);

    this.registerComponent(this.getComponent(Velocity));
}
GravitySystem.prototype = Object.create(Phaser.ECS.System.prototype);
GravitySystem.prototype.constructor = Phaser.ECS.System;

GravitySystem.POWER = 500;

GravitySystem.prototype.process = function(entity, elapsed) {
    entity.get(this.getComponent(Velocity)).dy += elapsed * GravitySystem.POWER;
};

// Collisions
// ----------

function CollisionSystem() {
    Phaser.ECS.System.call(this);

    // Register Components
    // The system will receive only entities that have these 3 components
    this.registerComponent(this.getComponent(Position));
    this.registerComponent(this.getComponent(Velocity));
    this.registerComponent(this.getComponent(Radius));

}
CollisionSystem.prototype = Object.create(Phaser.ECS.System.prototype);
CollisionSystem.prototype.constructor = Phaser.ECS.System;

CollisionSystem.FRICTION = 0.95;

CollisionSystem.prototype.process = function(entity, elapsed) {
    var position = entity.get(this.getComponent(Position));
    var velocity = entity.get(this.getComponent(Velocity));
    var radius = entity.get(this.getComponent(Radius));

    if ((position.x - radius.r < 0 && velocity.dx < 0) || (position.x + radius.r > this.game.width && velocity.dx > 0)) {
        velocity.dx = -velocity.dx * CollisionSystem.FRICTION;
    }

    if ((position.y - radius.r < 0 && velocity.dy < 0) || (position.y + radius.r > this.game.height && velocity.dy > 0)) {
        velocity.dy = -velocity.dy * CollisionSystem.FRICTION;
    }
};

// Movement
// --------

function MovementSystem() {
    Phaser.ECS.System.call(this);

    this.registerComponent(this.getComponent(Position));
    this.registerComponent(this.getComponent(Velocity));
}

MovementSystem.prototype = Object.create(Phaser.ECS.System.prototype);
MovementSystem.prototype.constructor = Phaser.ECS.System;

MovementSystem.prototype.process = function(entity, elapsed) {
    var position = entity.get(this.getComponent(Position));
    var velocity = entity.get(this.getComponent(Velocity));

    position.x += velocity.dx * elapsed;
    position.y += velocity.dy * elapsed;
};

// Expiration
// ----------

function LifetimeSystem() {
    Phaser.ECS.System.call(this);

    this.registerComponent(this.getComponent(Clock));
}

LifetimeSystem.prototype = Object.create(Phaser.ECS.System.prototype);
LifetimeSystem.prototype.constructor = Phaser.ECS.System;

LifetimeSystem.prototype.process = function(entity, elapsed) {
    var clock = entity.get(this.getComponent(Clock));

    clock.t -= elapsed;
    if (clock.t < 0) {
        entity.kill();
    }
};


// Rendering
// ---------

function RenderingSystem() {
    Phaser.ECS.System.call(this);

    this.registerComponent(this.getComponent(Position));
    this.registerComponent(this.getComponent(Radius));
    this.registerComponent(this.getComponent(Clock));
    this.registerComponent(this.getComponent(Display));

    this.sprites = [];

    this.spriteGroup = this.game.add.group();

}

RenderingSystem.prototype = Object.create(Phaser.ECS.System.prototype);
RenderingSystem.prototype.constructor = Phaser.ECS.System;

RenderingSystem.prototype.onAdded = function(entity) {
    var position = entity.get(this.getComponent(Position));
    var radius = entity.get(this.getComponent(Radius));
    var display = entity.get(this.getComponent(Display));

    var sprite = this.spriteGroup.getFirstDead();
    if (!sprite) {
      sprite = this.game.add.sprite(position.x, position.y, display.sprite);
      this.spriteGroup.add(sprite);
    }  else {
        sprite.revive();
    }
    sprite.x = position.x;
    sprite.y = position.y;
    sprite.anchor.setTo(0.5, 0.5);
    sprite.width = radius.r*2
    sprite.height = radius.r*2
    this.sprites[entity.id] = sprite;
};

RenderingSystem.prototype.onRemoved = function(entity) {
    this.sprites[entity.id].kill();
    this.sprites[entity.id] = undefined;
}

RenderingSystem.prototype.process = function(entity, elapsed) {
    var position = entity.get(this.getComponent(Position));
    var radius = entity.get(this.getComponent(Radius));
    var clock = entity.get(this.getComponent(Clock));

    var sprite = this.sprites[entity.id];
    sprite.x = position.x | 0;
    sprite.y = position.y | 0;
    sprite.alpha = clock.t / clock.lifespan;
};
