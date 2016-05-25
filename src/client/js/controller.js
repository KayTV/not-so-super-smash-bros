$(document).ready(function(){
  var socket = io();
  var right = 1;

  document.fullscreenEnabled = document.fullscreenEnabled || document.mozFullScreenEnabled || document.documentElement.webkitRequestFullScreen;
  if (document.fullscreenEnabled) {
      var el = document.getElementById('controls');
      el.webkitRequestFullscreen();
  }
  setInterval(updateGame, 30);
});

$('#move-right').on('touchmove', function(){
  event.preventDefault();
  right = 0;
});

$('#move-right').on('touchend', function(){
  event.preventDefault();
  right = 1;
});

function updateGame() {
    // sends game-update to server with the players input and player number
    socket.emit('game-update', {right: right});
}
