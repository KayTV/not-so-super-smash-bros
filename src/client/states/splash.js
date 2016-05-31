function Splash() {}

Splash.prototype = {
    loadScripts: function () {
      game.load.script('menu', 'states/menu.js');
      game.load.script('game', 'states/game.js');
    },
    loadAssets: function () {
      // Map assets
      game.load.image('sky', 'assets/marioLevel/MarioLevelBackground.png');
      game.load.image('ground', 'assets/marioLevel/ground.png');
      game.load.image('move-box', 'assets/marioLevel/box.png')
  		game.load.image('box', 'assets/marioLevel/ledge2.png');
  		game.load.image('littlebox', 'assets/marioLevel/box.png');
  		game.load.image('pipe', 'assets/marioLevel/pipe2.png');

      // Sprite Assets
      game.load.image('bullet', 'assets/weapons/bullet2.png')
      game.load.spritesheet('megaman0', 'assets/sprites/MegaManSprite2.png', 55, 55);
      game.load.spritesheet('kirby1', 'assets/sprites/kirbySprite2.png', 23, 22);
      game.load.spritesheet('pikachu2', 'assets/sprites/pikachuSprite.png', 40, 30);
      game.load.spritesheet('kirby', 'assets/sprites/kirbySprite2.png', 23, 22);
      game.load.spritesheet('pikachu', 'assets/sprites/pikachuSprite.png', 40, 30);
      game.load.spritesheet('mario3', 'assets/sprites/mario1.png', 24, 38);

    },
    init: function() {
      this.status = game.make.text(game.world.centerX, 380, 'Loading...', {fill: 'blue'});
      this.status.anchor.setTo(0.5);
    },
    preload: function() {

      game.add.existing(this.status);

      this.loadScripts();
      this.loadAssets();
    },
    addGameStates: function() {
      game.state.add('Menu', Menu)
      game.state.add('Game', Game);
    },
    create: function () {
      this.status.setText('Loaded!')
      this.addGameStates();

      setTimeout(function() {
        game.state.start('Menu');
      }, 1000);
    }
};
