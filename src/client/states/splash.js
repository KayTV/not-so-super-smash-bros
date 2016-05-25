function Splash() {}

Splash.prototype = {
    loadScripts: function () {
      game.load.script('game', 'states/game.js');
    },
    loadAssets: function () {
      // Map assets
      this.load.image('sky', '../assets/marioLevel/MarioLevelBackground.png');
      this.load.image('ground', '../assets/marioLevel/ground.png');
      this.load.image('move-box', '../assets/marioLevel/box.png')
  		this.load.image('box', '../assets/marioLevel/ledge2.png');
  		this.load.image('littlebox', '../assets/marioLevel/box.png');
  		this.load.image('pipe', '../assets/marioLevel/pipe2.png');

      // Sprite Assets
      this.load.image('bullet', '../assets/weapons/bullet2.png')
      this.load.spritesheet('dude', '../assets/sprites/MegaManSprite2.png', 55, 55);
      this.load.spritesheet('turtle', '../assets/marioLevel/marioBad.png', 45, 45);
      this.load.image('star', '../assets/marioLevel/marioStar.png');

    },
    preload: function() {
      this.loadScripts();
      this.loadAssets();
    },
    addGameStates: function() {
      game.state.add('Game', Game);
    },
};
