// add scripts

$(document).on('ready', function() {
  console.log('sanity check!');
  var socket = io();

  socket.on('ready', function(){
    console.log('ready');
  })
});
