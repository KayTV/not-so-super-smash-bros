function Splash() {}

Splash.prototype = {
    loadScripts: function () {
      game.load.script('game', 'states/game.js');
    },
    preload: function() {
      this.loadScripts()
    },
    addGameStates: function() {
      game.state.add('Game', Game);
    },
};
