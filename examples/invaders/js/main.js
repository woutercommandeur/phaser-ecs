var game = new Phaser.Game(800,600, Phaser.AUTO, '', { preload: preload, create: create });


function preload() {
    game.load.image('ship', 'assets/ship.png');
    game.load.image('bullet', 'assets/bullet.png');
    game.load.image('invader', 'assets/invader.png');
}

function create() {
    game.add.plugin(Phaser.Plugin.ECS);

    // setup our Components
    var shipController = new ShipController();

    Phaser.ECS.registerComponent(ShipController);
    Phaser.ECS.registerComponent(Position);
    Phaser.ECS.registerComponent(Velocity);
    Phaser.ECS.registerComponent(Radius);
    Phaser.ECS.registerComponent(Display);

    Phaser.ECS.registerSystem(new ShipControlSystem());
    Phaser.ECS.registerSystem(new MovementSystem());
    Phaser.ECS.registerSystem(new BulletSystem());
    Phaser.ECS.registerSystem(new RenderingSystem());


    game.input.keyboard.addKeyCapture([Phaser.Keyboard.SPACEBAR,Phaser.Keyboard.LEFT,Phaser.Keyboard.RIGHT]);

    var spacebar = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
    spacebar.onDown.add(function() { shipController.shoot = true });
    spacebar.onUp.add(function() { shipController.shoot = false });

    var left = game.input.keyboard.addKey(Phaser.Keyboard.LEFT);
    left.onDown.add(function() { shipController.moveLeft = true });
    left.onUp.add(function() { shipController.moveLeft = false });

    var right = game.input.keyboard.addKey(Phaser.Keyboard.RIGHT);
    right.onDown.add(function() { shipController.moveRight = true });
    right.onUp.add(function() { shipController.moveRight = false });

    EntityCreator.createPlayer(400,500,shipController);

    for (var y = 0; y < 4; y++) {
        for (var x = 0; x < 10; x++) {
            EntityCreator.createInvader(170 + x * 48, 100 + y * 50);
        }
    }
}
