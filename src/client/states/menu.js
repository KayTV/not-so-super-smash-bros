function Menu (){
  var self = this;
  this.gameRoom;
  this.viewId;
  this.playerCount;
}

Menu.prototype = {
  init: function() {
    this.titleText = game.make.text(game.world.centerX, 100, '(Not So) Super Smash Bros.', {
      font: 'bold 42pt Sans',
      aligin: 'center',
      color: '#999999'
    });
  },

  create: function() {
    game.add.existing(this.titleText);
  },

  preload: function() {
    this.playerCount;
  },

  update: function() {

  }
};
