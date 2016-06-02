var characters = ['megaman0', 'kirby1', 'pikachu2', 'mario3'];
var winningPlayer;

function GameOver () {};

GameOver.prototype = {
  init: function(winner, playerCount) {

    this.winner = winner;
    this.playerCount = playerCount;

    for (var i=0; i < characters.length; i++) {
      if (i === winner) {
        winningPlayer = characters[i];
      }
    }

    // console.log("Winning:", winningPlayer);

    this.titleText = game.make.text(game.world.centerX - 200, game.world.centerY - 200, 'Not-So-Super Smash Bros.', {
      font: '40px Mario',
      align: 'center',
      fill: 'red'
    });

    this.winnerText = game.make.text(game.world.centerX - 200, 200, 'The winner is: ' , {
      font: '40px Mario',
      align: 'center',
      fill: 'red'
    });
  },
  create: function () {
    game.add.sprite(0, 0, 'menu');
    game.add.existing(this.titleText);
    game.add.existing(this.winnerText);
    // Make sprite dynamic
    this.sprite = game.add.sprite(game.world.centerX - 50, game.world.centerY, winningPlayer);
    this.sprite.scale.setTo(3.0);
    this.restartGame();
  },
  restartGame: function () {
    var text = game.add.text(game.world.centerX - 50, game.world.height * 0.8, 'Rematch?', {
      font: '40px Mario',
      align: 'center',
      fill: 'red'
    });
    var hoverTrue = function (button) {
      button.fill = "#30DEF8";
      button.stroke = "rgba(200, 200, 200, 0.5)";
    };
    var hoverFalse = function (button) {
      button.fill = 'red';
      button.stroke = "rgba(0,0,0,0)";
    };
    var onClick = function () {
      game.state.start('Game', true, false, this.playerCount);
    }.bind(this);

    text.stroke = "rgba(0,0,0,0)";
    text.strokeThickness = 4;
    text.inputEnabled = true;
    text.events.onInputUp.add(onClick);
    text.events.onInputOver.add(hoverTrue);
    text.events.onInputOut.add(hoverFalse);
  },
  preload: function () {

  },
  update: function() {

  }
};
