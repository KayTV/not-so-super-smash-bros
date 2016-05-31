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
  var pic = ['http://rs958.pbsrc.com/albums/ae69/SparkMan1324/8-bitmegaman.png~c200', 'http://vignette2.wikia.nocookie.net/kirbyfan73s/images/5/5b/8_bit_kirby_sprite_by_toshirofrog-d5h7rpp.png/revision/latest?cb=20150626024511', 'http://i.imgur.com/rSH6cVx.png', 'http://orig06.deviantart.net/d1bd/f/2013/207/7/2/mario_8_bit_emoticon_by_nickmarino-d6f9dhi.png'];

  $('#join').on('click', function() {
    var gameRoom = $('#user-input').val();
    socket.emit('new-player', {gameRoom: gameRoom});

    socket.on('success-join', function(playerNum) {
      console.log("PlayerNum:", playerNum)
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

  // if (document.fullscreenEnabled) {
  //     var el = document.getElementById('controls');
  //     el.webkitRequestFullscreen();
  // }

  // setInterval(updateGame, 30);
  // socket.on('game-start', function(playerNum) {
  //   console.log("Number of players:", playerNum);
  //   setInterval(updateGame, 30);
  // })

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
