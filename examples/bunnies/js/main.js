var game = new Phaser.Game(800,600, Phaser.AUTO, '', { preload: preload, create: create });


function preload() {
    game.load.image('bunny', 'assets/bunny.png');
}

function create() {
    game.add.plugin(Phaser.Plugin.ECS);

    // setup our Components
    Phaser.ECS.registerComponent(Position);
    Phaser.ECS.registerComponent(Velocity);
    Phaser.ECS.registerComponent(Clock);
    Phaser.ECS.registerComponent(Radius);
    Phaser.ECS.registerComponent(Display);

    Phaser.ECS.registerSystem(new GravitySystem());
    Phaser.ECS.registerSystem(new CollisionSystem());
    Phaser.ECS.registerSystem(new MovementSystem());
    Phaser.ECS.registerSystem(new RenderingSystem());
    Phaser.ECS.registerSystem(new LifetimeSystem());

    game.input.keyboard.addKeyCapture([Phaser.Keyboard.SPACEBAR]);
    var spacebar = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
    spacebar.onDown.add(function() { createBunnies(10); });
}

function rand(min, max) {
    return min + Math.random() * (max - min + 1) | 0;
}

function createBunnies(number) {
    while (number--) {
        var bunny = Phaser.ECS.create();

        bunny.add(new Position(rand(0, 800), rand(0, 600)), Phaser.ECS.getComponent(Position));
        bunny.add(new Velocity(rand(10, 100), rand(10, 100)), Phaser.ECS.getComponent(Velocity));
        bunny.add(new Radius(rand(10, 50)), Phaser.ECS.getComponent(Radius));
        bunny.add(new Clock(rand(5, 10)), Phaser.ECS.getComponent(Clock));
        bunny.add(new Display('bunny'), Phaser.ECS.getComponent(Display));
    }
}
