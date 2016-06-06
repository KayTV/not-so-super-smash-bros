var waitingText;
// console.log("MeunJS");

function Menu (){
  var self = this;
  this.gameRoom;
  this.viewId;
  this.playerCount;
  this.selectchar;
}

// function colors () {
//   var colors = ['red', 'orange', 'yellow', 'green', 'blue', 'violet'];
// }

Menu.prototype = {
  init: function() {
    // Call createGame on init, which will emit 'create-game to the backend'
    this.createGame();
    this.titleText = game.make.text(game.world.centerX, 90, 'Not-So-Super\n Smash Bros.', {
      font: '60px PipeDream',
      align: 'center',
      // fill: 'red'
    });
    // this.titleText.addColor('#0b9bd7', 0);
    this.titleText.addColor('blue', 0);
    this.titleText.addColor('black', 3);
    this.titleText.addColor('#fbcf08', 4);
    this.titleText.addColor('black', 6);
    this.titleText.addColor('#E42926', 7);
    this.titleText.addColor('#00c600', 12);
    this.titleText.addColor('#fbcf08', 18);
    this.titleText.anchor.setTo(0.5);
    this.titleText.setShadow(5, 5, 'rgba(0, 0, 0, 0.5)', 0);
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
      font: '40px PipeDream',
      fill: 'blue',
      align: 'center',
      stroke: 'rgba(0,0,0,0)',
      strokeThickness: 4
    }

    var directionStyle = {
      font: '32px PipeDream',
      align: 'center',
      // fill: 'purple',
    }

    var directions = game.add.text(game.world.centerX, 200, 'Directions: Go to this website on your phone, \n click HOST GAME and enter in the Game ID.', directionStyle);
    // directions.addColor('red', 2);
    directions.addColor('blue', 0);
    directions.anchor.setTo(0.5, 0.5);

    // var directions2 = game.add.text(game.world.centerX, 230, 'click HOST GAME and enter in the Game ID.', directionStyle);
    // directions.anchor.setTo(0.5, 0.5);
    // directions2.anchor.setTo(0.5, 0.5);

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
      var text = game.add.text(game.world.centerX, game.world.centerY + 15, 'Game ID: ' + this.gameRoom, {
        font: '40px PipeDream',
        fill: 'blue',
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
      font: '50px PipeDream',
      fill: '#fbcf08',
      align: 'center',
      // stroke: 'rgba(0,0,0,0)',
      // strokeThickness: 4,
    }

    var text = game.add.text(game.world.centerX, game.world.centerY - 35, 'Start Match', style);
    text.anchor.setTo(0.5,0.5);
    text.setShadow(5, 5, 'rgba(0, 0, 0, 0.5)', 0);

    var hoverTrue = function (button) {
      button.fill = '#00c600';
      button.stroke = 'rgba(200,200,200,0.5)';
    }

    var hoverFalse = function (button) {
      button.fill = '#fbcf08';
      button.stroke = 'rgba(0,0,0,0)';
    }

    var onClick = function () {
      socket.emit('game-start', {gameRoom: this.gameRoom});
      game.state.start('Game', true, false, this.playerCount)
    }.bind(this);

    // text.stroke = "rgba(0,0,0,0)";
    // text.strokeThickness = 4;
    text.inputEnabled = true;
    text.events.onInputUp.add(onClick);
    text.events.onInputOver.add(hoverTrue);
    text.events.onInputOut.add(hoverFalse);


  },

  addPlayerPic: function() {

    if (this.playerCount === 1) {
      console.log(this);
      this.mainBackground.kill();
      game.stage.backgroundColor = '#6899F8';

      waitingText = game.add.text(game.world.centerX, game.world.centerY - 25, 'Waiting for more players...', {
        font: '35px PipeDream',
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
  waitingText.destroy();
}
