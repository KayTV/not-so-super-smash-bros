$(document).ready(function(){
  var socket = io();
  var right = false;

  document.fullscreenEnabled = document.fullscreenEnabled || document.mozFullScreenEnabled || document.documentElement.webkitRequestFullScreen;
  if (document.fullscreenEnabled) {
      var el = document.getElementById('controls');
      el.webkitRequestFullscreen();
  }
  setInterval(updateGame, 30);

$('#move-right').on('touchstart', function(event){
  event.preventDefault();
  right = true;
});

$('#move-right').on('touchend', function(event){
  event.preventDefault();
  right = false;
});

function updateGame() {
    // sends game-update to server with the players input and player number
    socket.emit('game-update', {right: right});
}
});
