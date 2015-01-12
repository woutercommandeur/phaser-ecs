// Controller
// ----------

function ShipControlSystem() {
    Phaser.ECS.System.call(this);

    this.registerComponent(this.getComponent(ShipController));
    this.registerComponent(this.getComponent(Position));
    this.registerComponent(this.getComponent(Velocity));
}
ShipControlSystem.prototype = Object.create(Phaser.ECS.System.prototype);
ShipControlSystem.prototype.constructor = Phaser.ECS.System;

ShipControlSystem.prototype.process = function(entity, elapsed) {
    var controller = entity.get(this.getComponent(ShipController));
    var position = entity.get(this.getComponent(Position));
    var velocity = entity.get(this.getComponent(Velocity));

    if (controller.moveLeft) {
        velocity.dx = -ShipControlSystem.SPEED;
    } else if (controller.moveRight) {
        velocity.dx = ShipControlSystem.SPEED;
    } else {
        velocity.dx = 0;
    }

    var now = Date.now();
    if (controller.shoot) {
        if (controller.shootTimer + ShipControlSystem.FIRE_RATE < now) {
            controller.shootTimer = now;
            EntityCreator.createBullet(position.x, position.y);
        }
    }
};

ShipControlSystem.SPEED = 200;
ShipControlSystem.FIRE_RATE = 250;

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
}

// Bullets
// -------

function BulletSystem() {
    Phaser.ECS.System.call(this);
}

BulletSystem.prototype = Object.create(Phaser.ECS.System.prototype);
BulletSystem.prototype.constructor = Phaser.ECS.System;

BulletSystem.prototype.processEntities = function() {
    var bullets = Phaser.ECS.getEntitiesByGroup('bullets');
    var invaders = Phaser.ECS.getEntitiesByGroup('invaders');

    for (var b = bullets.length; b--;) {
        var bullet = bullets[b];
        var bulletPosition = bullet.get(this.getComponent(Position));
        var bulletRadius = bullet.get(this.getComponent(Radius));

        // Check viewport collisions
        if (bulletPosition.y < 0) {
            bullet.kill();
            continue;
        }

        // Check collisions against invaders
        for (var i = invaders.length; i--;) {
            var invader = invaders[i];
            var invaderPosition = invader.get(this.getComponent(Position));
            var invaderRadius = invader.get(this.getComponent(Radius));

            var collisionRadius = bulletRadius.r + invaderRadius.r;

            var dx = Math.abs(bulletPosition.x - invaderPosition.x);
            var dy = Math.abs(bulletPosition.y - invaderPosition.y);

            if (dx + dy < collisionRadius) {
                bullet.kill();
                invader.kill();
            }
        }
    }
}


// Rendering
// ---------

function RenderingSystem() {
    Phaser.ECS.System.call(this);

    this.registerComponent(this.getComponent(Position));
    this.registerComponent(this.getComponent(Display));

    this.sprites = [];

    this.bulletGroup = this.game.add.group();
    this.invaderGroup = this.game.add.group();

}

RenderingSystem.prototype = Object.create(Phaser.ECS.System.prototype);
RenderingSystem.prototype.constructor = Phaser.ECS.System;

RenderingSystem.prototype.onAdded = function(entity) {
    var position = entity.get(this.getComponent(Position));
    var display = entity.get(this.getComponent(Display));

    var sprite;
    if (display.sprite == 'bullet') {
        sprite = this.bulletGroup.getFirstDead();
    } else if (display.sprite == 'invader') {
        sprite = this.invaderGroup.getFirstDead();
    }

    if (!sprite) {
        sprite = this.game.add.sprite(position.x, position.y, display.sprite);
        if (display.sprite == 'bullet') {
            this.bulletGroup.add(sprite);
        } else if (display.sprite == 'invader') {
            this.invaderGroup.add(sprite);
        }
    } else {
        sprite.revive();
    }
    sprite.x = position.x;
    sprite.y = position.y;
    sprite.anchor.setTo(0.5, 0.5);
    this.sprites[entity.id] = sprite;
};

RenderingSystem.prototype.onRemoved = function(entity) {
    this.sprites[entity.id].kill();
    this.sprites[entity.id] = undefined;
}

RenderingSystem.prototype.process = function(entity, elapsed) {
    var position = entity.get(this.getComponent(Position));

    var sprite = this.sprites[entity.id];
    sprite.x = position.x | 0;
    sprite.y = position.y | 0;
};
