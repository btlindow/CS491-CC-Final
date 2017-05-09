//Created by Ben Lindow

var players = [];

function Player(id, x, y, u, r) {
  this.id = id;
  this.x = x;
  this.y = y;
  this.t = 1;
  this.i = 0;
  this.p = 0;
  this.u = u;
  this.m = 0;
  this.s = 0;
  this.r = r;
}

// Using express: http://expressjs.com/
var express = require('express');
// Create the app
var app = express();

//MySQL - Start Here
var mysql = require('mysql');

var connection = mysql.createConnection({
	host: 'localhost',
	user: 'root',
	password: 'admin',
	database: 'Users'
});

connection.connect(function (error) {
	if(!!error) {
		console.log('---Error Connection to MySQL Server');
	} else {
		console.log('---Connected to MySQL Server');
	}
});


// Set up the server
// process.env.PORT is related to deploying on heroku
var server = app.listen(process.env.PORT || 3000, listen);

// This call back just tells us that the server has started
function listen() {
  var host = server.address().address;
  var port = server.address().port;
  console.log('Listening: ' + host + ':' + port);
}

app.use(express.static(__dirname + '/public'));

// WebSocket Portion
// WebSockets work with the HTTP server
var io = require('socket.io')(server);

setInterval(heartbeat, 15);

function heartbeat() {
    io.sockets.emit('heartbeat', players);
    for (var i = 0; i < players.length; i++) {
        players[i].s = 0;
    }
}



// Register a callback function to run when we have an individual connection
// This is run for each individual user that connects
io.sockets.on('connection',
  // We are given a websocket object in our function
  function(socket) {

    console.log("New Client: " + socket.id);


    socket.on('start',
      function(data) {
        var player = new Player(socket.id, data.x, data.y, data.u, data.r);
        players.push(player);
      }
    );

    socket.on('update',
      function(data) {
        var zombie_count = 0;
        var player;
        for (var i = 0; i < players.length; i++) {
            if (socket.id == players[i].id) 
                player = players[i];
            if (players[i].t == 0)
                zombie_count++;
        }
        
        player.x = data.x;
        player.y = data.y;
        player.t = data.t;
        player.p = data.p;
        player.i = data.i;
        player.m = data.m;
	player.r = data.r;
        
        if (players.length == 1) {
            players[0].s = 1;
        }
        if (zombie_count == players.length && players.length > 1) {
            for (var i = 0; i < players.length; i++) {
                players[i].s = 2;
            }
        }
        if (zombie_count == 0 && players.length > 0) {
                players[0].s = 1;
        }
        
      }
    );

    socket.on('disconnect', function() {
      console.log("Client Disconnected: " + socket.id);
      for (var i = 0; i < players.length; i++) {
          if (socket.id == players[i].id && players[i].id != null) {
		      if(players[i].i > 0 || players[i].p > 0) {
                  connection.query("INSERT INTO scoreboard (username, zscore, hscore) VALUES (\"" + players[i].u +
				 "\", " + players[i].i + ", " + players[i].p + ")", function(error, rows, fields) {
                if(!!error) {
                        console.log('---Error Submitting Query');
                } else {
                        console.log('---Successful Query');
                }
           		 });
              }
              players.splice(i, 1);   
          }
      }
    });
  }
);
