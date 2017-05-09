var canvas;
var socket;
var player;
//sound variables
var game_begin_sound;
var first_blood;
var double_kill;
var triple_kill;
var quadra;
var infected;
var fb_counter = 0;
var game_over_noise;
//end of sound variables
var players = [];
var winX = 800;
var winY = 800;
var username = null;
var send = 0;
var i_list = [];
var game_over = false;
var go_flag = true;

function preload(){
    game_begin_sound = loadSound("sounds/battle_begin.mp3");
    first_blood = loadSound("sounds/First_Blood.mp3");
    double_kill = loadSound("sounds/Double_Kill.mp3");
    triple_kill = loadSound("sounds/Triple_Kill.mp3");
    quadra = loadSound("sounds/Ultra_Kill.mp3");
    infected = loadSound("sounds/infected.mp3");
    game_over_noise = loadSound("sounds/game_over.mp3");
}
function setup() {
	
    strip(window.location.href);	
    canvas = createCanvas(winX, winY); 
    socket = io.connect('http://54.226.70.87:3000/');
    player = new Player();
    var data = {
        x: player.pos.x,
        y: player.pos.y,
	    u: username
    };
    socket.emit('start', data);
  
    socket.on('heartbeat',
             function(data) {
            players = data;
            }
        );
    game_begin_sound.play();
}

function draw() {
    if(!game_over){
        background(51);
        fill(255);
        displayMe();
        cyclePlayers();
        emitData();
    }
    else {
	if(go_flag) {
		game_over_noise.play();
		go_flag = false;
	}
        background(51);
        fill(255);
        textSize(150);
        fill('red');
        text("GAME OVER", 10, winY/2);
    }
}

function testMessage(index) {
    switch (players[index].s) {
	case 1:
	    player.type = 0;
        break;
    case 2:
        game_over = true;
	default:
	    break;
    }
} 

function strip(url) {
    var n = url.search("=");
    username = url.substring(n+1, url.length);
    if(n<0)
	   window.location = "http://54.226.70.87";
}

function colorPlayers(i) {
    if(players[i].t == 1)
        fill(0,255,0);
    else 
        fill(255,0,0);
    ellipse(players[i].x, players[i].y, player.r*2, player.r*2);
}

function testInfection(i) {
    var d = int(dist(player.pos.x, player.pos.y, players[i].x, players[i].y));
    if (d < 2 * player.r) {
        if (player.type == players[i].t)
            return;
        else if (player.type == 1 && players[i].t == 0){
            player.type = 0;
	    infected.play();
        }
	else {
            if(!inList(players[i].id)){
	        if(fb_counter == 0){
			first_blood.play();
	        	fb_counter = 1;
		}
		else if(fb_counter == 1){
			double_kill.play();
			fb_counter = 2;
		}
		else if(fb_counter == 2) {
			triple_kill.play();
			fb_counter = 3;
		}
		else if(fb_counter == 3) {
			quadra.play();
			fb_counter = 4;
		}
                i_list.push(players[i].id);
	    }
        }
        player.infected = i_list.length;
    }
}

function inList(sid) {
    for (var i = 0; i < i_list.length; i++) {
        if(sid == i_list[i])
            return true;
    }
    return false;
}

function cyclePlayers() {
    for (var i = 0; i < players.length; i++) {
        var id = players[i].id;
        if (id !== socket.id) {
            colorPlayers(i);
            testInfection(i);
        }
        else
            testMessage(i);
    }
}

function displayMe() {
    playerConstrain();
    player.show();
    player.update();
}

function emitData() {
    var data = {
        x: player.pos.x,
        y: player.pos.y,
        t: player.type,
        p: player.points,
        i: player.infected,
        m: send
    };
    socket.emit('update', data);
    send = 0;
}

function playerConstrain() {
    if (player.pos.x > winX)
        player.pos.x = winX;
    if (player.pos.x < 0)
        player.pos.x = 0;
    if (player.pos.y > winY)
        player.pos.y = winY;
    if (player.pos.y < 0)
        player.pos.y = 0;
}

