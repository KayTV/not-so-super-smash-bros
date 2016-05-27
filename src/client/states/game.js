// var socket = io();

var players = [];
var inputs = [];
var ground;
var platforms;
// var bullets;

function Game () {
  // this.bullets;
  // this.player1 = null;
  // this.player2 = null;
  // this.player3 = null;
  this.playerCount;
  // this.platforms;
  // this.cursors;
  // this.fireButton;
  // this.fireRate = 100;
  // this.nextFire = 0;
  // this.bulletTime = 0;
  // this.right = false;
}

Game.prototype = {
  init: function (playerCount) {
    this.playerCount = playerCount;
    // console.log("PlayerCount:",playerCount);
    for (var i = 0; i <= playerCount; i++) {
        inputs.push({left: false, right: false, jump: false, fire: false});
    }
    // console.log("GameJS inputs:",inputs)

    this.game.renderer.renderSession.roundPixels = true;
    this.game.stage.disableVisibilityChange = true;
    // this.physics.startSystem(Phaser.Physics.ARCADE);
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

    ground.enableBody = true;

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


    // Phone Characters
    players = [];
    // console.log("GameJS Inputs before update:",inputs);
    var self = this;

    socket.on('game-update', function(data) {
      console.log('data', data);
      inputs[data.player] = data;
    });

    // console.log(this.inputs);

    for (var i = 0; i<this.playerCount; i++) {
      players.push(new Character(i))
      // console.log("GameJS players:",players);
    }

    this.physics.startSystem(Phaser.Physics.ARCADE);

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
    // this.cursors = this.input.keyboard.createCursorKeys();
		// this.fireButton = this.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
    // this.A = this.input.keyboard.addKey(Phaser.Keyboard.A);
    // this.D = this.input.keyboard.addKey(Phaser.Keyboard.D);
    // this.W = this.input.keyboard.addKey(Phaser.Keyboard.W);

    // console.log("players:", players);

  },
  update: function() {
    var count = 0

    for (var i=0; i < players.length; i++) {
      if (players[i].sprite.alive) {
        count ++;
        players[i].update(inputs);
      }
    }

    // game.physics.arcade.collide(players, this.platforms)

    // var self = this;
    // socket.on('game-update', function(data) {
    //   self.right = data.right;
    //   self.left = data.left;
    //   self.jump = data.jump;
    //   self.fire = data.fire;
    // })

    // if(this.fire === true)
		// {
		// 	this.fireGun();
		// }

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
