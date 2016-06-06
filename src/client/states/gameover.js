var characters = ['select0', 'select1', 'select2', 'select3'];
var winningPlayer;
var count = 0;
this.winnerText;

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
    // console.log("GameOverJS: game:",game);

    this.titleText = game.make.text(game.world.centerX, 90, 'Not-So-Super\n Smash Bros.', {
      font: '60px PipeDream',
      align: 'center',
    });
    this.titleText.addColor('blue', 0);
    this.titleText.addColor('black', 3);
    this.titleText.addColor('#fbcf08', 4);
    this.titleText.addColor('black', 6);
    this.titleText.addColor('#E42926', 7);
    this.titleText.addColor('#00c600', 12);
    this.titleText.addColor('#fbcf08', 18);
    this.titleText.anchor.setTo(0.5);
    this.titleText.setShadow(5, 5, 'rgba(0, 0, 0, 0.5)', 0);
    this.titleText.anchor.setTo(0.5);

    this.winnerText = game.make.text(game.world.centerX, 200, 'The winner is: ' , {
      font: '50px PipeDream',
      align: 'center',
      // fill: 'red'
    });
    this.winnerText.anchor.setTo(0.5);


    // if (count === 1) {
    //   this.winnerText.addColor('#E42926', 0);
    // } else if (count === 2) {
    //   this.winnerText.addColor('blue', 0);
    // } else if (count === 3) {
    //   this.winnerText.addColor('#fbcf08', 0);
    // } else {
    //   this.winnerText.addColor('#00c600', 0);
    // }


  },
  create: function () {
    game.add.sprite(0, 0, 'menu');
    game.add.existing(this.titleText);
    game.add.existing(this.winnerText);
    // Make sprite dynamic
    this.sprite = game.add.sprite(game.world.centerX, game.world.centerY, winningPlayer);
    this.sprite.scale.setTo(0.5);
    this.sprite.anchor.setTo(0.5);
    this.restartGame();
    setInterval(timer, 800);
  },
  restartGame: function () {
    var text = game.add.text(game.world.centerX, game.world.height * 0.7, 'Rematch?', {
      font: '50px PipeDream',
      align: 'center',
      fill: 'red'
    });
    text.anchor.setTo(0.5);
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
    if (count === 0){
      this.winnerText.addColor('red', 0);
    }
    if (count === 1) {
      this.winnerText.addColor('#fbcf08', 0);
    }
    if (count === 2) {
      this.winnerText.addColor('blue', 0);
    }
    if (count === 3) {
      this.winnerText.addColor('#E42926', 0);
    }
    if (count === 4){
      this.winnerText.addColor('#00c600', 0);
    }
  }
};

function timer () {
  if (count === 4) {
    count = 0;
  }
  count += 1;
}
