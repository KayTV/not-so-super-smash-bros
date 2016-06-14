var players = [];
var inputs = [];
var ground;
var platforms;
var bullets;
var dieSound;
var mainSound;

function Game () {
  this.playerCount;
  this.platforms;
}


function powerUp () {
  for (var i=0; i<players.length; i++) {
    if (players[i].sprite.alive === true && players[i].sprite.powerUp !== 100) {
      players[i].sprite.powerUp += 10;
    }
  }
}


Game.prototype = {
  init: function (playerCount) {
    this.playerCount = playerCount;
    for (var i = 0; i <= playerCount; i++) {
        inputs.push({left: false, right: false, jump: false, fire: false, firePowerUp: false});
    }

    this.game.renderer.renderSession.roundPixels = true;
    this.game.stage.disableVisibilityChange = true;
    socket.on('connect', function(){
      console.log('connected');
    })
  },

  preload: function() {

  },
  create: function() {
    dieSound = this.add.audio('soundDie');
    mainSound = this.add.audio('mainSound');
    mainSound.play();
    mainSound.currentTime = 0.5;

    this.add.sprite(0, 0, 'sky');
    this.platforms = this.add.group();

    //  We will enable physics for any object that is created in this group
    this.platforms.enableBody = true;

    var ground = this.platforms.create(0, this.world.height - 64, 'ground');
    ground.body.immovable = true;

    ground.enableBody = true;

    var ledge = this.platforms.create(250, 350, 'box');
    ledge.body.immovable = true;

    ledge = this.platforms.create(600, 150, 'box');
    ledge.body.immovable = true;

    ledge = this.platforms.create(-50, 150, 'box');
    ledge.body.immovable = true;

    ledge = this.platforms.create(100, 350, 'littlebox');
    ledge.body.immovable = true;

		ledge = this.platforms.create(350, 200, 'littlebox');
    ledge.body.immovable = true;

		ledge = this.platforms.create(580, 450, 'pipe');
    ledge.body.immovable = true;

    setInterval(powerUp, 1000);


    // Phone Characters
    players = [];
    var self = this;

    socket.on('game-update', function(data) {
      inputs[data.player] = data;
    });


    var xHP = 0;

    for (var i = 0; i<this.playerCount; i++) {

      // Add unique bullets for each character
      this.bullets = this.add.group();
      this.bullets.enableBody = true;
      this.bullets.physicsBodyType = Phaser.Physics.ARCADE;
      this.bullets.setAll('anchor.x', 0.5);
      this.bullets.setAll('anchor.y', 0.5);
      this.bullets.createMultiple(200, 'bullet' + i);
      this.bullets.playerId = i;
      console.log(this.bullets);

      // Add powerUp Bullets
      this.superBullets = this.add.group();
      this.superBullets.enableBody = true;
      this.superBullets.physicsBodyType = Phaser.Physics.ARCADE;
      this.superBullets.setAll('anchor.x', 0.5);
      this.superBullets.setAll('anchor.y', 0.5);
      this.superBullets.createMultiple(200, 'bullet' + i);
      this.superBullets.playerId = i;

      this.superBullets2 = this.add.group();
      this.superBullets2.enableBody = true;
      this.superBullets2.physicsBodyType = Phaser.Physics.ARCADE;
      this.superBullets2.setAll('anchor.x', 0.5);
      this.superBullets2.setAll('anchor.y', 0.5);
      this.superBullets2.createMultiple(200, 'bullet' + i);
      this.superBullets2.playerId = i;

      this.superBullets3 = this.add.group();
      this.superBullets3.enableBody = true;
      this.superBullets3.physicsBodyType = Phaser.Physics.ARCADE;
      this.superBullets3.setAll('anchor.x', 0.5);
      this.superBullets3.setAll('anchor.y', 0.5);
      this.superBullets3.createMultiple(200, 'bullet' + i);
      this.superBullets3.playerId = i;

      players.push(new Character(i, this.platforms, this.bullets, this.superBullets, this.superBullets2, this.superBullets3, dieSound))
    }

  },
  update: function() {
    var count = 0
    var winner;

    for (var i=0; i < players.length; i++) {
        for (var n=0; n<players.length; n++) {
          this.physics.arcade.overlap(players[n].sprite, players[i].bullets, bulletCollision, null, this);

          this.physics.arcade.overlap(players[n].sprite, players[i].superBullets, bulletCollision, null, this);

          this.physics.arcade.overlap(players[n].sprite, players[i].superBullets2, bulletCollision, null, this);

          this.physics.arcade.overlap(players[n].sprite, players[i].superBullets3, bulletCollision, null, this);

          // Handling bullet to platform collision
          this.physics.arcade.overlap(this.platforms, players[i].bullets, bulletCollisionPlatform, null, this);

          this.physics.arcade.overlap(this.platforms, players[i].superBullets, bulletCollisionPlatform, null, this);

          this.physics.arcade.overlap(this.platforms, players[i].superBullets2, bulletCollisionPlatform, null, this);

          this.physics.arcade.overlap(this.platforms, players[i].superBullets3, bulletCollisionPlatform, null, this);

        }
        if (players[i].sprite.alive) {
          count ++;
          players[i].update(inputs);
          winner = i;
      }
    }

    if (count <= 1) {
      game.time.events.repeat(2000, 1, function() {
        game.state.start('GameOver', true, false, winner, this.playerCount);
      }.bind(this), game);
    }

  }
}
