console.log('SANITY');
var game = new Phaser.Game(800, 600, Phaser.AUTO, 'game');

var MarioGame = function() {
  this.player1 = null;
  this.platforms;
  this.cursors;
  this.bullets;
  this.stars;
  this.moveBox;
  this.score = 0;
  this.scoreText;
  this.pOneHealth = 100;
  this.pOneHealthText;
  this.fireButton;
  this.fireRate = 100;
  this.nextFire = 0;
  this.bulletTime = 0;
}

MarioGame.prototype = {
  init: function () {
    this.game.renderer.renderSession.roundPixels = true;
    this.physics.startSystem(Phaser.Physics.ARCADE);
  },

  preload: function() {
    this.load.image('sky', 'assets/marioLevel/MarioLevelBackground.png');
    this.load.image('ground', 'assets/marioLevel/ground.png');
    this.load.image('star', 'assets/marioLevel/marioStar.png');
		this.load.image('box', 'assets/marioLevel/ledge2.png');
		this.load.image('littlebox', 'assets/marioLevel/box.png');
		this.load.image('pipe', 'assets/marioLevel/pipe2.png');
		this.load.image('bullet', 'assets/weapons/bullet2.png')
    this.load.spritesheet('dude', 'assets/sprites/MegaManSprite2.png', 55, 55);
    this.load.spritesheet('turtle', 'assets/marioLevel/marioBad.png', 45, 45);
    this.load.image('move-box', 'assets/marioLevel/box.png')
  },
  create: function() {
    this.add.sprite(0, 0, 'sky');
    this.platforms = this.add.group();

    //  We will enable physics for any object that is created in this group
    this.platforms.enableBody = true;

    // Here we create the ground.
    var ground = this.platforms.create(0, this.world.height - 64, 'ground');

    //  This stops it from falling away when you jump on it
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

    this.moveBox = this.add.physicsGroup();

    var moveBox1 = new CloudPlatform(this.game, 600, 100, 'move-box', this.moveBox);

    moveBox1.addMotionPath([
        { x: "-600", xSpeed: 3000, xEase: "Linear", y: "-0", ySpeed: 3000, yEase: "Sine.easeIn" },
        { x: "+600", xSpeed: 3000, xEase: "Linear", y: "0", ySpeed: 3000, yEase: "Sine.easeOut" },
    ]);

    this.baddies = this.add.physicsGroup();
    this.turtle = new Baddie(this.game, 800, 300, 'turtle', this.baddies)
    this.turtle.addMotionPath([
      { x: "-900", xSpeed: 3500, xEase: "Linear", y: "-0", ySpeed: 6000, yEase: "Sine.easeIn",
     }
    ])

    // Run animation for baddies
    this.baddies.callAll('start');

    // The player1 and its settings
    this.player1 = this.add.sprite(32, this.world.height - 150, 'dude');

    //  We need to enable physics on the player1
		this.player1.anchor.set(0.5);

    this.physics.enable(this.player1, Phaser.Physics.ARCADE);

    //  Player physics properties. Give the little guy a slight bounce.
    this.player1.body.bounce.y = 0.2;
    this.player1.body.gravity.y = 300;
    this.player1.body.collideWorldBounds = true;

    this.player1.animations.add('left', [0, 1, 2, 3], 13, true);
    this.player1.animations.add('right', [6, 7, 8, 9], 13, true);
		this.player1.animations.add('jump', [10], 13, true);
		this.player1.animations.add('jumpdown', [11], 13, true);
    this.player1.animations.add('hit', [12], 13, true);

    //bullets for megaman
		this.bullets = this.add.group();
    this.bullets.enableBody = true;
    this.bullets.physicsBodyType = Phaser.Physics.ARCADE;
    this.bullets.setAll('anchor.x', 0.5);
    this.bullets.setAll('anchor.y', 1);
    this.bullets.createMultiple(50, 'bullet');
    this.bullets.setAll('checkWorldBounds', true);
    this.bullets.setAll('outOfBoundsKill', true);

    //  Finally some stars to collect
    this.stars = this.add.group();

    //  We will enable physics for any star that is created in this group
    this.stars.enableBody = true;

    //  Here we'll create 12 of them evenly spaced apart
    for (var i = 0; i < 15; i++)
    {
        //  Create a star inside of the 'stars' group
        var star = this.stars.create(i * 70, 0, 'star');

        //  Let gravity do its thing
        star.body.gravity.y = 300;

        //  This just gives each star a slightly random bounce value
        star.body.bounce.y = 0.7 + Math.random() * 0.2;
    }

		//  The score
    this.scoreText = this.add.text(16, 16, 'score: 0', { fontSize: '32px', fill: '#000' });
    //Health
    this.pOneHealthText = this.add.text(16, 48, 'Player Health: 100', {
      fontSize: '32px',
      fill: '#000'
    });

    //  Our controls.
    this.cursors = this.input.keyboard.createCursorKeys();
		this.fireButton = this.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
    this.moveBox.callAll('start');

  },
  customSep: function (player1, platform) {
      if (!this.locked && player1.body.velocity.y > 0)
      {
          this.locked = true;
          this.lockedTo = platform;
          platform.playerLocked = true;
          player1.body.velocity.y = 0;
      }
  },
  checkLock: function () {
      this.player1.body.velocity.y = 0;
      //  If the player has walked off either side of the platform then they're no longer locked to it
      if (this.player1.body.right < this.lockedTo.body.x || this.player1.body.x > this.lockedTo.body.right)
      {
          this.cancelLock();
      }
  },
  cancelLock: function () {
      this.wasLocked = true;
      this.locked = false;
  },
  preRender: function () {
      if (this.game.paused)
      {
          //  Because preRender still runs even if your game pauses!
          return;
      }
      if (this.locked || this.wasLocked)
      {
          this.player1.x += this.lockedTo.deltaX;
          this.player1.y = this.lockedTo.y - 48;
          if (this.player1.body.velocity.x !== 0)
          {
              this.player1.body.velocity.y = 0;
          }
      }
      if (this.willJump)
      {
          this.willJump = false;
          if (this.lockedTo && this.lockedTo.deltaY < 0 && this.wasLocked)
          {
              //  If the platform is moving up we add its velocity to the players jump
              this.player1.body.velocity.y = -400 + (this.lockedTo.deltaY * 10);
          }
          else
          {
              this.player1.body.velocity.y = -400;
          }
          this.jumpTimer = this.time.time + 750;
      }
      if (this.wasLocked)
      {
          this.wasLocked = false;
          this.lockedTo.playerLocked = false;
          this.lockedTo = null;
      }
  },
  update: function() {
    //  Collide the player1 and the stars with the platforms
    this.physics.arcade.collide(this.player1, this.platforms);
    this.physics.arcade.collide(this.stars, this.platforms);
    this.physics.arcade.collide(this.player1, this.moveBox, this.customSep, null, this);
    // this.physics.arcade.collide(this.player1, this.turtle);

    var standing = this.player1.body.blocked.down || this.player1.body.touching.down || this.locked;

    //  Checks to see if the player1 overlaps with any of the stars, if he does call the collectStar function
    this.physics.arcade.overlap(this.player1, this.stars, this.collectStar, null, this);

    // Decease player health
    this.physics.arcade.overlap(this.player1, this.turtle, this.lowerHealth, null, this);

    //  Reset the player1s velocity (movement)
    this.player1.body.velocity.x = 0;

    if (this.cursors.left.isDown)
    {
        //  Move to the left
        this.player1.body.velocity.x = -150;
        this.player1.animations.play('left');
    }
    else if (this.cursors.right.isDown)
    {
        //  Move to the right
        this.player1.body.velocity.x = 150;
        this.player1.animations.play('right');
    }
		else if(this.cursors.up.isDown)
		{
			this.player1.animations.play('jump');
		}
		else if(this.cursors.down.isDown)
		{
			this.player1.animations.play('jumpdown');
		}
    else
    {
        //  Stand still
        this.player1.animations.stop();
        this.player1.frame = 5;
    }
    if(this.fireButton.isDown)
		{
			this.fire();
		}
    //  Allow the player1 to jump if they are touching the ground.
    if (this.cursors.up.isDown && this.player1.body.touching.down)
    {
        this.player1.body.velocity.y = -350;
    }
    if (standing && this.cursors.up.isDown && this.time.time > this.jumpTimer)
    {
        if (this.locked)
        {
            this.cancelLock();
        }
        this.willJump = true;
        jump.play();
    }
    if (this.locked)
    {
        this.checkLock();
    }

  },
  collectStar: function(player1, star) {
    // Removes the star from the screen
    star.kill();
		//  Add and update the score
    this.score += 10;
    this.scoreText.text = 'Score: ' + this.score;
  },
  fire: function() {
    if (this.time.now > this.nextFire && this.bullets.countDead() > 0)
    {
        this.nextFire = this.time.now + this.fireRate;

        var bullet = this.bullets.getFirstDead();

        bullet.reset(this.player1.x, this.player1.y);
        if(this.cursors.right.isDown || this.cursors.up.isDown) {
          bullet.body.velocity.x = 400;
        }
        if(this.cursors.left.isDown || this.cursors.down.isDown) {
          bullet.body.velocity.x = -400;
        }
        else {
          bullet.body.velocity.x = 400;
        }
        // this.physics.arcade.moveToXY(bullet, 500, 500, 400);
    }
  },
  // Function: Lower player playerHealth, kill player
  lowerHealth: function(player1, turtle) {
    this.pOneHealth -= 10;
    this.player1.animations.play('hit');
    this.pOneHealthText.text = 'Health:' + this.pOneHealth;
    if (this.pOneHealth === 0) {
      this.player1.animations.play('hit');
      player1.kill();

    }
  }
}

Baddie = function (game, x, y, key, group) {
  if (typeof group === 'undefined') {
    group = game.world; }

  Phaser.Sprite.call(this, game, x, y, key);
  game.physics.arcade.enable(this);
  this.anchor.x = 0.5;
  this.body.customSeparateX = true;
  this.body.customSeparateY = true;
  this.body.allowGravity = false;
  this.body.immovable = true;
  this.playerLocked = false;
  group.add(this);
};

// Prototypes
Baddie.prototype = Object.create(Phaser.Sprite.prototype);
Baddie.prototype.constructor = Baddie;

Baddie.prototype.addMotionPath = function (motionPath) {
  this.tweenX = this.game.add.tween(this.body);
  this.tweenY = this.game.add.tween(this.body);

  for (var i = 0; i < motionPath.length; i++)
  { this.tweenX.to( { x: motionPath[i].x }, motionPath[i].xSpeed, motionPath[i].xEase);
    this.tweenY.to( { y: motionPath[i].y }, motionPath[i].ySpeed, motionPath[i].yEase);}
  this.tweenX.loop();
  this.tweenY.loop();
};

Baddie.prototype.start = function () {
  this.tweenX.start();
  this.tweenY.start();
};

Baddie.prototype.stop = function () {
  this.tweenX.stop();
  this.tweenY.stop();
};

CloudPlatform = function (game, x, y, key, group) {
    if (typeof group === 'undefined') { group = game.world; }
    Phaser.Sprite.call(this, game, x, y, key);
    game.physics.arcade.enable(this);
    this.anchor.x = 0.5;
    this.body.customSeparateX = true;
    this.body.customSeparateY = true;
    this.body.allowGravity = false;
    this.body.immovable = true;
    this.playerLocked = false;
    group.add(this);
};

CloudPlatform.prototype = Object.create(Phaser.Sprite.prototype);
CloudPlatform.prototype.constructor = CloudPlatform;
CloudPlatform.prototype.addMotionPath = function (motionPath) {
    this.tweenX = this.game.add.tween(this.body);
    this.tweenY = this.game.add.tween(this.body);

    for (var i = 0; i < motionPath.length; i++)
    {
        this.tweenX.to( { x: motionPath[i].x }, motionPath[i].xSpeed, motionPath[i].xEase);
        this.tweenY.to( { y: motionPath[i].y }, motionPath[i].ySpeed, motionPath[i].yEase);
    }
    this.tweenX.loop();
    this.tweenY.loop();
};
CloudPlatform.prototype.start = function () {
    this.tweenX.start();
    this.tweenY.start();
};
CloudPlatform.prototype.stop = function () {
    this.tweenX.stop();
    this.tweenY.stop();
};

// Call game
game.state.add('Game', MarioGame, true);
