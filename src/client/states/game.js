var socket = io();

var players = [];
var inputs = [];
// var bullets;

function Game () {
  this.bullets;
  this.player1 = null;
  this.player2 = null;
  this.player3 = null;
  this.playerCount;
  this.platforms;
  this.cursors;
  this.fireButton;
  this.fireRate = 100;
  this.nextFire = 0;
  this.bulletTime = 0;
  this.right = false;
}

Game.prototype = {
  init: function (playerCount) {
    this.playerCount = playerCount;
        console.log("PlayerCount:",playerCount);
        for (var i = 0; i <= playerCount; i++) {
            inputs.push({left: false, right: false, jump: false, fire: false});
        }

    this.game.renderer.renderSession.roundPixels = true;
    this.game.stage.disableVisibilityChange = true;
    this.physics.startSystem(Phaser.Physics.ARCADE);
    socket.on('connect', function(){
      console.log('connected');
    })
  },

  preload: function() {

  },
  create: function() {
    this.add.sprite(0, 0, 'sky');
    this.platforms = this.add.group();

    //  We will enable physics for any object that is created in this group
    this.platforms.enableBody = true;

    var ground = this.platforms.create(0, this.world.height - 64, 'ground');
    ground.body.immovable = true;

    var ledge = this.platforms.create(250, 350, 'box');
    ledge.body.immovable = true;

    ledge = this.platforms.create(650, 100, 'box');
    ledge.body.immovable = true;

    ledge = this.platforms.create(100, 350, 'littlebox');
    ledge.body.immovable = true;

		ledge = this.platforms.create(350, 200, 'littlebox');
    ledge.body.immovable = true;

		ledge = this.platforms.create(580, 450, 'pipe');
    ledge.body.immovable = true;

    // Player1/Player and settings
    // this.player1 = this.add.sprite(32, this.world.height - 150, 'megaman');

    // Phone Characters
    socket.on('game-update', function(data) {
      inputs[data.player] = data;
    });
    for (var i = 0; i<this.playerCount; i++) {
      players.push(new Character(i))
    }

    this.player2 = this.add.sprite(200, this.world.height - 150, 'kirby');
    this.player2.scale.setTo(1.5,1.5);
    this.player3 = this.add.sprite(300, this.world.height -150, 'pikachu');

    //  We need to enable physics on the player1
		// this.player1.anchor.set(0.5);
    this.player2.anchor.set(2);
    this.player3.anchor.set(0.5);

    // this.physics.enable(this.player1, Phaser.Physics.ARCADE);
    this.physics.enable(this.player2, Phaser.Physics.ARCADE);
    this.physics.enable(this.player3, Phaser.Physics.ARCADE);

    //  Player physics properties. Give the little guy a slight bounce.
    // this.player1.body.bounce.y = 0.2;
    // this.player1.body.gravity.y = 300;
    // this.player1.body.collideWorldBounds = true;

    this.player2.body.bounce.y = 0.2;
    this.player2.body.gravity.y = 300;
    this.player2.body.collideWorldBounds = true;

    this.player3.body.bounce.y = 0.2;
    this.player3.body.gravity.y = 300;
    this.player3.body.collideWorldBounds = true;

    // this.player1.animations.add('left', [0, 1, 2, 3], 13, true);
    // this.player1.animations.add('right', [6, 7, 8, 9], 13, true);
		// this.player1.animations.add('jump', [10], 13, true);
    // this.player1.animations.add('hit', [12], 13, true);

    this.player2.animations.add('left', [20, 19, 18, 17, 16, 15, 14, 13, 12, 11], 13, true);
    this.player2.animations.add('right', [0, 1, 2, 3, 4, 5, 6, 7, 8, 9], 13, true);
		// this.player2.animations.add('jump', [10], 13, true);

    this.player3.animations.add('left', [0, 1, 2], 8, true);
    this.player3.animations.add('right', [6, 7, 8], 8, true);
    this.player3.animations.add('jump', [4], 8, true);

    // console.log('player', this.player1);

    //bullets for megaman
		this.bullets = this.add.group();
    this.bullets.enableBody = true;
    this.bullets.physicsBodyType = Phaser.Physics.ARCADE;
    this.bullets.setAll('anchor.x', 0.5);
    this.bullets.setAll('anchor.y', 1);
    this.bullets.createMultiple(50, 'bullet');
    this.bullets.setAll('checkWorldBounds', true);
    this.bullets.setAll('outOfBoundsKill', true);

    //  Our controls.
    this.cursors = this.input.keyboard.createCursorKeys();
		this.fireButton = this.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
    this.A = this.input.keyboard.addKey(Phaser.Keyboard.A);
    this.D = this.input.keyboard.addKey(Phaser.Keyboard.D);
    this.W = this.input.keyboard.addKey(Phaser.Keyboard.W);

  },
  update: function() {
    //  Collide the player with platforms
    // this.physics.arcade.collide(this.player1, this.platforms);
    //

    this.physics.arcade.collide(this.player2, this.platforms);

    this.physics.arcade.collide(this.player3, this.platforms);
    this.physics.arcade.collide(this.player3, this.moveBox, this.customSep, null, this);

    // var standing = this.player1.body.blocked.down || this.player1.body.touching.down;
    //
    // //  Player1 Movement
    // this.player1.body.velocity.x = 0;

    // var self = this;
    // socket.on('game-update', function(data) {
    //   self.right = data.right;
    //   self.left = data.left;
    //   self.jump = data.jump;
    //   self.fire = data.fire;
    // })

    // if (this.left === true)
    // {
    //     //  Move to the left
    //     this.player1.body.velocity.x = -150;
    //     this.player1.animations.play('left');
    // }
    // else if (this.right === true)
    // {
    //     //  Move to the right
    //     // console.log("right");
    //     this.player1.body.velocity.x = 150;
    //     this.player1.animations.play('right');
    // }
		// else if(this.jump === true)
		// {
		// 	this.player1.animations.play('jump');
		// }
    // else
    // {
    //   //  Stand still
    //   this.player1.animations.stop();
    //   this.player1.frame = 5;
    // }
    // if(this.fire === true)
		// {
		// 	this.fireGun();
		// }
    // //  Allow the player1 to jump if they are touching the ground.
    // if (this.jump === true && this.player1.body.touching.down)
    // {
    //     this.player1.body.velocity.y = -350;
    // }

    // Player2 Movement
    this.player2.body.velocity.x = 0;
    if (this.cursors.left.isDown)
    {
        //  Move to the left
        this.player2.body.velocity.x = -150;
        this.player2.animations.play('left');
    }
    else if (this.cursors.right.isDown)
    {
        //  Move to the right
        this.player2.body.velocity.x = 150;
        this.player2.animations.play('right');
    }
		// else if(this.cursors.up.isDown)
		// {
		// 	this.player2.animations.play('jump');
		// }
    else
    {
      //  Stand still
      this.player2.animations.stop();
      this.player2.frame = 10;
    }
        //  Allow the player2 to jump if they are touching the ground.
    if (this.cursors.up.isDown && this.player2.body.touching.down)
    {
        this.player2.body.velocity.y = -350;
    }
    this.physics.arcade.collide(this.player3, this.platforms);

    this.player3.body.velocity.x = 0;

    if (this.A.isDown) {
      this.player3.body.velocity.x = -150;
      this.player3.animations.play('left');
    }
    else if (this.D.isDown) {
      this.player3.body.velocity.x = 150;
      this.player3.animations.play('right');
    } else {
      this.player3.animations.stop();
      this.player3.frame = 3;
    }

    // Conditional for jumping (P3)
    if (this.W.isDown && this.player3.body.touching.down) {
      this.player3.animations.play('jump');
      this.player3.body.velocity.y = -350;
    }

  },
  // fireGun: function() {
  //   if (this.time.now > this.nextFire && this.bullets.countDead() > 0)
  //   {
  //       this.nextFire = this.time.now + this.fireRate;
  //
  //       var bullet = this.bullets.getFirstDead();
  //
  //       bullet.reset(this.player1.x, this.player1.y);
  //       if(this.right === true) {
  //         bullet.body.velocity.x = 400;
  //       }
  //       if(this.left === true) {
  //         bullet.body.velocity.x = -400;
  //       }
  //       else {
  //         bullet.body.velocity.x = 400;
  //       }
  //       // this.physics.arcade.moveToXY(bullet, 500, 500, 400);
  //   }
  // },
}
