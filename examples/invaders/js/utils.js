var EntityCreator = {
    createPlayer: function(x, y, shipController) {
        var player = Phaser.ECS.create();
        player.add(shipController, Phaser.ECS.getComponent(ShipController));
        player.add(new Position(x, y), Phaser.ECS.getComponent(Position));
        player.add(new Velocity(), Phaser.ECS.getComponent(Velocity));
        player.add(new Display('ship'), Phaser.ECS.getComponent(Display));
        return player;
    },
    createInvader: function(x, y) {
        var invader = Phaser.ECS.create();
        invader.add(new Position(x, y), Phaser.ECS.getComponent(Position));
        invader.add(new Radius(8), Phaser.ECS.getComponent(Radius));
        invader.add(new Display('invader'), Phaser.ECS.getComponent(Display));
        Phaser.ECS.addToGroup(invader, 'invaders');
        return invader;
    },
    createBullet: function(x, y) {
        var bullet = Phaser.ECS.create();
        bullet.add(new Position(x, y), Phaser.ECS.getComponent(Position));
        bullet.add(new Velocity(0, -300), Phaser.ECS.getComponent(Velocity));
        bullet.add(new Radius(8), Phaser.ECS.getComponent(Radius));
        bullet.add(new Display('bullet'), Phaser.ECS.getComponent(Display));
        Phaser.ECS.addToGroup(bullet, 'bullets');
        return bullet;
    }
};
