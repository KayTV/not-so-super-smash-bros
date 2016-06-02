var bulletTime = 0;
var fireRate = 100;
var nextFire = 0;


function bulletCollision (character, bullet) {
  // console.log("bullet",bullet);
  // console.log("character", character);
  if (bullet.playerId !== character.playerId) {
    bullet.kill();
    character.health -= 10;
    character.healthText.text = "P" + character.playerId + " HP:" + character.health;
  }
}

function Character (controller, platforms, bullets) {
  this.platforms = platforms;
  this.bullets = bullets;
  // this.bullets.playerId = playerId;

  var x, y, character, left, right, jump;
  switch(controller) {
    case 0:
      x = 50;
      y = game.world.height - 250;
      character = 'megaman';
      left = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
      right = [11, 12, 13, 14, 15, 16, 17, 18, 19, 20];
      jumpRight = [33];
      jumpLeft = [34];
      // jump is a default below until code is written for jumpLeft and jumpRight
      jump = [33];
      fireRight = [25, 26, 24];
      fireLeft = [22, 21, 23];
      // fire is a default below until code is written for fireLeft and fireRight
      fire = [25, 26, 24];
      die = [28, 29];
      stand = [10];
      scale = 1.5;
      xHP = 40;
      break;
    case 1:
      x = 200;
      y = game.world.height - 250;
      character = 'kirby';
      left = [20, 19, 18, 17, 16, 15, 14, 13, 12, 11];
      right = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
      jump = [10];
      stand = [10];
      fireRight = [21];
      fireLeft = [22];
      fire = [21];
      die = [23];
      scale = 2.3;
      xHP = 230;
      break;
    case 2:
      x = 400;
      y = game.world.height - 250;
      character = 'pikachu';
      left = [0, 1, 2];
      right = [6, 7, 8];
      jump = [4];
      fire = [8];
      stand = [3];
      scale = 1.8;
      xHP = 430;
      break;
    case 3:
      x = 500;
      y = game.world.height - 250;
      character = 'mario';
      left = [1, 2, 3, 4, 5, 6, 7];
      right = [9, 10, 11, 12, 13, 14, 15];
      jump = [17];
      fire = [8];
      stand = [8];
      scale = 1.3;
      xHP = 630;
      break;
  }

  // Controller is the index of input array where this chars inputs are stored.
  this.controller = controller;

  // Sprites
  this.sprite = game.add.sprite(x, y, character + (this.controller));
  this.sprite.animations.add('left', left, 13, true);
  this.sprite.animations.add('right', right, 13, true);
  this.sprite.animations.add('jump', jump, 13, true);
  this.sprite.animations.add('stand', stand, 13, true);
  this.sprite.animations.add('fire', fire, 13, true);
  this.sprite.playerId = this.controller;
  this.sprite.scale.set(scale, scale);

  // Set Sprite health
  this.sprite.health = 200;

  // Create Sprite HP Text
  this.sprite.healthText = game.add.text(xHP, 0, 'P' + (this.controller + 1) + ' HP:' + this.sprite.health, {
    font: '17px PressStart2P',
    fill: '#000',
    align: 'center',
    backgroundColor: '#98e800'
  })

  // Enable physics
  game.physics.enable(this.sprite, Phaser.Physics.ARCADE);
  this.sprite.body.collideWorldBounds = true;
  this.sprite.body.bounce.y = 0.2;
  this.sprite.body.gravity.y = 300;
}

Character.prototype = {
  update: function (inputs) {

    game.physics.arcade.collide(this.sprite, this.platforms);
    var standing = this.sprite.body.blocked.down || this.sprite.body.touching.down;
    this.sprite.body.velocity.x = 0;

    // Check sprite health
    if (this.sprite.health <= 0) {
      this.sprite.kill()
    }

    // Sprite Movement
    if(inputs[this.controller].left === true) {
      this.sprite.body.velocity.x = -150;
      this.sprite.animations.play('left');
    } else if (inputs[this.controller].right === true) {
      this.sprite.body.velocity.x = 150;
      this.sprite.animations.play('right');
    } else if(inputs[this.controller].jump === true) {
      // this.sprite.body.velocity.y = -350;
      this.sprite.animations.play('jump');
    }
    else {
      this.sprite.animations.stop();
      this.sprite.animations.play('stand');
    }
    if (inputs[this.controller].jump === true && this.sprite.body.touching.down)
    {
        this.sprite.body.velocity.y = -350;
    }
    if (inputs[this.controller].fire === true)
		{
			this.fireGun();
      this.sprite.animations.play('fire');
		}
  },
  fireGun: function() {

    if (game.time.now > nextFire && this.bullets.countDead() > 0)
    {
        nextFire = game.time.now + fireRate;
        this.bullets.playerId = this.controller;
        // console.log('bullets', this.bullets);

        var bullet = this.bullets.getFirstDead();
        bullet.playerId = this.controller;

        if (this.controller === 0 || this.controller === 3) {
          bullet.reset(this.sprite.x + 25, this.sprite.y + 35);
        } else {
          bullet.reset(this.sprite.x + 25, this.sprite.y + 20);
        }

        if(inputs[this.controller].right === true || inputs[this.controller].jump === true) {
          bullet.body.velocity.x = 400;
          // console.log('right', bullet);
        }
        if(inputs[this.controller].left === true) {
          bullet.body.velocity.x = -400;
        }
        else {
          bullet.body.velocity.x = 400;
        }
    }
  }
}
