var socket = io();

var game = new Phaser.Game(800, 600, Phaser.AUTO, 'Not-So-Super-Smash');

function Main() {}

Main.prototype = {
    preload: function() {
      game.load.script('splash', 'states/splash.js');
    },
    create: function() {
      game.state.add('Splash', Splash);
      game.state.start('Splash');
    }
};

game.state.add('Main', Main);
game.state.start('Main');
