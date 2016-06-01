// var socket = io();

var players = [];
var inputs = [];
var ground;
var platforms;
var bullets;
var health = 100;

function Game () {
  this.playerCount;
  this.platforms;
}

Game.prototype = {
  init: function (playerCount) {
    this.playerCount = playerCount;
    for (var i = 0; i <= playerCount; i++) {
        inputs.push({left: false, right: false, jump: false, fire: false});
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
    this.add.sprite(0, 0, 'sky');
    this.platforms = this.add.group();

    console.log('platforms',this.platforms);
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
    var self = this;

    socket.on('game-update', function(data) {
      inputs[data.player] = data;
    });


    var xHP = 0;
    for (var i = 0; i<this.playerCount; i++) {
      // Set health for each character
      xHP += 100;
      this.health = this.add.text(xHP, 0, 'P' + i + ' HP: 100', {
        fontSize: '15px',
        fill: '#000'
      })

      // Add unique bullets for each character
      this.bullets = this.add.group();
      this.bullets.enableBody = true;
      this.bullets.physicsBodyType = Phaser.Physics.ARCADE;
      this.bullets.setAll('anchor.x', 0.5);
      this.bullets.setAll('anchor.y', 0.5);
      this.bullets.createMultiple(50, 'bullet' + i);

      players.push(new Character(i, this.platforms, this.bullets))
    }

  },
  update: function() {
    var count = 0

    for (var i=0; i < players.length; i++) {
      if (players[i].sprite.alive) {
        count ++;
        players[i].update(inputs);

        this.physics.arcade.overlap(this.bullets, players[i].sprite, bulletCollision, null, this);
      }
    }

  }
}
