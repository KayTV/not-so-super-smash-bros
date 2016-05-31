var bulletTime = 0;
var fireRate = 100;
var nextFire = 0;

function Character (controller, platforms, bullets) {
  this.platforms = platforms;
  this.bullets = bullets;

  var x, y, character, left, right, jump;
  switch(controller) {
    case 0:
      x = 50;
      y = game.world.height - 250;
      character = 'megaman';
      left = [0, 1, 2, 3];
      right = [6, 7, 8, 9];
      jump = [10];
      stand = [5];
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
      die = [23];
      break;
    case 2:
      x = 400;
      y = game.world.height - 250;
      character = 'pikachu';
      left = [0, 1, 2];
      right = [6, 7, 8];
      jump = [4];
      stand = [3];
      break;
    case 3:
      x = 500;
      y = game.world.height - 250;
      character = 'mario';
      left = [1, 2, 3, 4, 5, 6, 7];
      right = [9, 10, 11, 12, 13, 14, 15];
      jump = [17];
      stand = [8];
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

  // Enable physics
  game.physics.enable(this.sprite, Phaser.Physics.ARCADE);
  this.sprite.body.collideWorldBounds = true;
  this.sprite.playerId = this.controller;
  this.sprite.body.bounce.y = 0.2;
  this.sprite.body.gravity.y = 300;
}

Character.prototype = {
  update: function (inputs) {

    game.physics.arcade.collide(this.sprite, this.platforms);
    var standing = this.sprite.body.blocked.down || this.sprite.body.touching.down;
    this.sprite.body.velocity.x = 0;
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
    } else {
      this.sprite.animations.stop();
      this.sprite.animations.play('stand');
    }
    if(inputs[this.controller].fire === true)
		{
			this.fireGun();
		}
    if (inputs[this.controller].jump === true && this.sprite.body.touching.down)
    {
        this.sprite.body.velocity.y = -350;
    }
  },
  fireGun: function() {

    if (game.time.now > nextFire && this.bullets.countDead() > 0)
    {
        nextFire = game.time.now + fireRate;
        console.log('bullets', this.bullets);

        var bullet = this.bullets.getFirstDead();

        bullet.reset(this.sprite.x, this.sprite.y);
        if(inputs[this.controller].right === true || inputs[this.controller].jump === true) {
          bullet.body.velocity.x = 400;
          console.log('right', bullet);
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