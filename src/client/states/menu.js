function Menu (){
  var self = this;
  this.gameRoom;
  this.viewId;
  this.playerCount;
}

Menu.prototype = {
  init: function() {
    // Call createGame on init, which will emit 'create-game to the backend'
    this.createGame();
    this.titleText = game.make.text(game.world.centerX, 100, '(Not So) Super Smash Bros.', {
      font: '42pt Sans',
      align: 'center',
      fill: 'red'
    });
    this.titleText.anchor.setTo(0.5);
  },

  create: function() {
    game.add.existing(this.titleText);
    socket.on('player-joined', function(data) {
      this.playerCount ?
      this.playerCount ++ :
      this.playerCount = 1;
      if (this.playerCount > 1) {
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
      font: '30pt Sans',
      fill: 'blue',
      align: 'center',
      stroke: 'rgba(0,0,0,0)',
      strokeThickness: 4
    }

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
        font: '30pt Sans',
        fill: 'red',
        align: 'center',
        stroke: 'rgba(0,0,0,0)',
        strokeThickness: 4
      });
      text.anchor.setTo(0.5, 0.5);

      if (self.playerCount >= 0) {
        console.log("A new player connected!");
        self.startGameMenu();
      }
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
      font: '30pt Sans',
      fill: 'red',
      align: 'center',
      stroke: 'rgba(0,0,0,0)',
      strokeThickness: 4
    }

    var text = game.add.text(game.world.centerX, game.world.centerY + 100, 'Start Match', style);
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
      game.state.start('Game', true, this.playerCount)
    }.bind(this);

    text.stroke = "rgba(0,0,0,0)";
    text.strokeThickness = 4;
    text.inputEnabled = true;
    text.events.onInputUp.add(onClick);
    text.events.onInputOver.add(hoverTrue);
    text.events.onInputOut.add(hoverFalse);

  },


  preload: function() {
    this.playerCount;
  },

  update: function() {

  }
};
