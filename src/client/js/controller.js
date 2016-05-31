$(document).ready(function(){
  $('#controls').hide();
  var socket = io();
  var right = false;
  var left = false;
  var jump = false;
  var fire = false;
  var player = null;
  var playerColor;
  var colors = ['#7f2120', '#1c3a66', '#eac84d', '#31563c' ];
  var playerPic;
  var pic = ['../assets/controller/megamanController.png', '../assets/controller/kirbyController.png', '../assets/controller/pikachuController.png', '../assets/controller/marioController.png'];

  $('#join').on('click', function() {
    var gameRoom = $('#user-input').val();
    socket.emit('new-player', {gameRoom: gameRoom});

    socket.on('success-join', function(playerNum) {
      console.log("PlayerNum:", playerNum);
      player = playerNum;

      playerColor = colors[playerNum];
      playerPic = pic[playerNum];
      $('body').css('background-color', playerColor);
      $('#picture').append('<img src='+playerPic+'>');

      $('#game-room-input').hide();
      $('#controls').show();
      setInterval(updateGame, 30);
    })
  })

  document.fullscreenEnabled = document.fullscreenEnabled || document.mozFullScreenEnabled || document.documentElement.webkitRequestFullScreen;


  $('#move-right').on('touchstart', function(event){
    event.preventDefault();
    right = true;
  });

  $('#move-right').on('touchend', function(event){
    event.preventDefault();
    right = false;
  });

  $('#move-left').on('touchstart', function(event){
    event.preventDefault();
    left = true;
  });

  $('#move-left').on('touchend', function(event){
    event.preventDefault();
    left = false;
  });

  $('#jump').on('touchstart', function(event){
    event.preventDefault();
    jump = true;
  });

  $('#jump').on('touchend', function(event){
    event.preventDefault();
    jump = false;
  });

  $('#fire').on('touchstart', function(event){
    event.preventDefault();
    fire = true;
  });

  $('#fire').on('touchend', function(event){
    event.preventDefault();
    fire = false;
  });

  function updateGame() {
      // sends game-update to server with the players input and player number
      socket.emit('game-update', {right: right, left: left, jump: jump, fire: fire, player: player});
  }
});
