// *** main dependencies *** //
var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

// *** routes *** //
var routes = require('./routes/index.js');


// *** express instance *** //
var app = express();

app.set('port', process.env.PORT || 3000);

var server = app.listen(app.get('port'), function() {
  console.log('Express server listening on port ' + server.address().port);
});
// *** config middleware *** //
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, '../client')));


// *** main routes *** //
app.get('/', function(req, res, next) {
  res.sendFile(path.join(__dirname, '../client/', 'layout.html'));
});

app.get('/controller', function(req, res) {
  //Serve up phone page here.
  res.sendFile(path.join(__dirname, '../client', 'controller.html'));
});

// app.use('/', routes);


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// *** SOCKET.IO *** //
var io = require('socket.io').listen(server);
var rooms = {};

io.on('connect', function(socket){
  console.log('a user connected');

  socket.on('new-player', function(data){
    // console.log('new player', data);

    if (!rooms[data.gameRoom] || rooms[data.gameRoom].started) {
      console.log('invalid room');
      socket.emit('invalid-room');
    } else {
      console.log("Joined",data.gameRoom)
      socket.room = data.gameRoom;

      if (rooms[data.gameRoom].players) {
        rooms[data.gameRoom].players++;
        console.log("Players:",rooms[data.gameRoom].players)
      } else {
        rooms[data.gameRoom].players = 1;
        console.log("Players:",rooms[data.gameRoom].players)
      }
      console.log("Phone:", data.gameRoom);
      io.sockets.in(rooms[socket.room].id).emit('player-joined', rooms[data.gameRoom].players);

      var playerId = rooms[data.gameRoom].players - 1;
      socket.emit('success-join', playerId);

      if (rooms[data.gameRoom].players >= 1 ) {
        io.sockets.in(rooms[socket.room].id).emit('start-game');
      }
    }
  });

  socket.on('game-update', function(data) {
    if (rooms[socket.room]) {
      io.sockets.in(rooms[socket.room].id).emit('game-update', data);
    }
    // io.sockets.emit('game-update', data);
  })

  // Check for 'create-game' emit
  socket.on('create-game', function(data) {
    if(!rooms[data.gameRoom]) {
      console.log('Creating game... GameRoom:', data.gameRoom)
      rooms[data.gameRoom] = {id: data.viewId};
      rooms[data.gameRoom].started = false;
      socket.join(data.viewId);
      socket.emit('success-create', data);
    } else {
      console.log("Shit's broke server-side");
    }
  })

  // Check for 'start-game' emit
  socket.on('game-start', function(data) {
    console.log('GameRoom:', data.gameRoom);
    room[data.gameRoom].started = true;
  })

  // Check for 'disconnect emit'
  socket.on('disconnect', function(){
    console.log('user disconnected');
  });
});

// io.on('game-update', function(data) {
//   console.log('data:', data);
// })



// *** error handlers *** //

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = server;
