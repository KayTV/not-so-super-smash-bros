var waitingText;

function Menu (){
  var self = this;
  this.gameRoom;
  this.viewId;
  this.playerCount;
  this.selectchar;
}

Menu.prototype = {
  init: function() {
    // Call createGame on init, which will emit 'create-game to the backend'
    this.createGame();
    this.titleText = game.make.text(game.world.centerX, 100, 'Not-So-Super Smash Bros.', {
      font: '43px Mario',
      align: 'center',
      fill: 'red'
    });
    this.titleText.anchor.setTo(0.5);
  },

  create: function() {
    this.mainBackground = game.add.sprite(0, 0, 'menu');
    game.add.existing(this.titleText);
    socket.on('player-joined', function(data) {
      this.playerCount ?
      this.playerCount ++ :
      this.playerCount = 1;
      this.addPlayerPic();

      if (this.playerCount >= 2) {
        this.startGameMenu();
      }
    }.bind(this));
    socket.on('success-create', function(data) {
      this.gameRoom = data.gameRoom;
      this.viewId = data.viewId;
      this.createMenu = this.addMenu();
    }.bind(this));
  },
  // Function to add the menu to the game world
  addMenu: function() {
    var style = {
      font: '30px PressStart2P',
      fill: 'blue',
      align: 'center',
      stroke: 'rgba(0,0,0,0)',
      strokeThickness: 4
    }

    var directionStyle = {
      font: '29px Mario',
      align: 'center',
      fill: 'red'
    }

    var directions = game.add.text(game.world.centerX, 150, 'Directions: Go to this website on your phone,', directionStyle);
    var directions2 = game.add.text(game.world.centerX, 190, 'click HOST GAME and enter in the Game ID.', directionStyle);
    directions.anchor.setTo(0.5, 0.5);
    directions2.anchor.setTo(0.5, 0.5);

    var text = game.make.text(game.world.centerX, game.world.centerY, 'HOST GAME', style);
    text.anchor.setTo(0.5, 0.5);

    var hoverTrue = function (button) {
      button.fill = 'red';
      button.stroke = 'rgba(200,200,200,0.5)';
    }

    var hoverFalse = function (button) {
      button.fill = 'blue';
      button.stroke = 'rgba(0,0,0,0)';
    }

    var onClick = function (button) {
      var text = game.add.text(game.world.centerX, game.world.centerY, 'Game ID: ' + this.gameRoom, {
        font: '30px PressStart2P',
        fill: 'red',
        align: 'center',
        stroke: 'rgba(0,0,0,0)',
        strokeThickness: 4
      });
      text.anchor.setTo(0.5, 0.5);

      button.destroy();
    }.bind(this);

    text.stroke = "rgba(0,0,0,0)";
    text.strokeThickness = 4;
    text.inputEnabled = true;
    text.events.onInputUp.add(onClick);
    text.events.onInputOver.add(hoverTrue);
    text.events.onInputOut.add(hoverFalse);
    game.add.existing(text);
    return text;

  },
  createGame: function () {
    // Make gameRoom
    var tempGameRoom = Math.floor((Math.random() * 100) + 100);

    // Set view ID
    var tempViewId = Math.floor((Math.random() * 100) + 100);

    // Emit 'create-game' to backend
    socket.emit('create-game', {gameRoom: tempGameRoom, viewId: tempViewId})
  },
  startGameMenu: function () {
    var style = {
      font: '24px PressStart2P',
      fill: 'red',
      align: 'center',
      stroke: 'rgba(0,0,0,0)',
      strokeThickness: 4,
    }

    var text = game.add.text(game.world.centerX, game.world.centerY - 50, 'Start Match', style);
    text.anchor.setTo(0.5,0.5);

    var hoverTrue = function (button) {
      button.fill = 'red';
      button.stroke = 'rgba(200,200,200,0.5)';
    }

    var hoverFalse = function (button) {
      button.fill = 'blue';
      button.stroke = 'rgba(0,0,0,0)';
    }

    var onClick = function () {
      socket.emit('game-start', {gameRoom: this.gameRoom});
      game.state.start('Game', true, false, this.playerCount)
    }.bind(this);

    text.stroke = "rgba(0,0,0,0)";
    text.strokeThickness = 4;
    text.inputEnabled = true;
    text.events.onInputUp.add(onClick);
    text.events.onInputOver.add(hoverTrue);
    text.events.onInputOut.add(hoverFalse);


  },

  addPlayerPic: function() {

    if (this.playerCount === 1) {
      this.mainBackground.kill();
      waitingText = game.add.text(game.world.centerX, game.world.centerY - 50, 'Waiting for more players...', {
        font: '40px Mario',
        align: 'center',
        fill: 'red'
      });
      waitingText.anchor.setTo(0.5);
      game.add.image(10, 320, 'player-selection');
      var mega = game.add.sprite(0, 345, 'select0');
      mega.scale.set(0.8, 0.8);
      console.log(game);
    }
    if(this.playerCount === 2) {
      var kirb = game.add.sprite(190, 350, 'select1');
      kirb.scale.set(0.8, 0.8);
      removeText();
    }
    if(this.playerCount === 3) {
      var pika = game.add.sprite(385, 350, 'select2');
      pika.scale.set(0.8, 0.8);
    }
    if (this.playerCount === 4) {
      var mar = game.add.sprite(570, 345, 'select3');
      mar.scale.set(0.8, 0.8);
    }

  },


  preload: function() {
    this.playerCount;
  },

  update: function() {


  }
};

function removeText () {
  waitingText.destroy()
}
