var canvas;
var bgcolor = 51;
var socket;
var player;
var c_listA = [];
var c_listB = [];
var kIndexA = 0;
var kIndexB = 0;
var r;
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
var winX = 2000;
//var winX = 800;
var winY = 2000;
//var winY = 800;
var relativeWinX = window.innerWidth;
var relativeWinY = window.innerHeight;
var username = null;
var send = 0;
var i_list = [];
var game_over = false;
var go_flag = true;
var boot = 0;

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
    canvas = createCanvas(relativeWinX, relativeWinY); 
    //canvas = createCanvas(winX, winY); 
    socket = io.connect('http://54.226.70.87:3000/');
    player = new Player();
    var data = {
        x: player.pos.x,
        y: player.pos.y,
	r: player.r,
	u: username
    };
    socket.emit('start', data);
  
    socket.on('heartbeat',
             function(data) {
            players = data;
            }
        );

    setCheatA();
    setCheatB();

    k_list = new Array(10);
    for(var i = 0; i < 10; i++) {
	k_list[i] = 0;
    }
    r = player.r;

    game_begin_sound.play();
}

function draw() {
    if(!game_over){
        background(bgcolor);
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
        text("GAME OVER", relativeWinX / 4, relativeWinY / 2);
	boot++;
	if (boot == 150)
		window.location = "http://54.226.70.87";
    }
}

function setCheatA() {
    c_listA.push(87);
    c_listA.push(87);
    c_listA.push(83);
    c_listA.push(83);
    c_listA.push(65);
    c_listA.push(68);
    c_listA.push(65);
    c_listA.push(68);
    c_listA.push(66);
    c_listA.push(65);
}

function setCheatB() {
    c_listB.push(87);
    c_listB.push(83);
    c_listB.push(87);
    c_listB.push(83);
    c_listB.push(65);
    c_listB.push(68);
    c_listB.push(65);
    c_listB.push(68);
    c_listB.push(65);
    c_listB.push(66);
}

function testCheatA(kc, i) {
    if(kc == c_listA[i]) {
	return true;
    } else {
	return false;
    }
}

function testCheatB(kc, i) {
    if(kc == c_listB[i]) {
        return true;
    } else {
        return false;
    }
}

function keyPressed() {
   if (testCheatA(keyCode, kIndexA)) {
	kIndexA++;
   }else {
	kIndexA = 0;
   }

   if (testCheatB(keyCode, kIndexB)) {
        kIndexB++;
   }else {
        kIndexB = 0;
   }

    if(kIndexA == 10) {
	player.speedy = 1;
	bgcolor = color('magenta');
    }

    if (kIndexB == 10) {
        player.r = player.r * 2;
	kIndexB = 0;
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
    if (((players[i].x < player.pos.x + (relativeWinX / 2))
            || (players[i].x > player.pos.x - (relativeWinX / 2)))
            && (players[i].y < player.pos.y + (relativeWinY / 2))
            || (players[i].y > player.pos.y - (relativeWinY / 2))) {
        if(players[i].t == 1)
            fill(0,255,0);
        else 
            fill(255,0,0);
        ellipse(((relativeWinX/2)+(players[i].x-player.pos.x)), 
                ((relativeWinY/2)+(players[i].y-player.pos.y)),
                players[i].r*2, players[i].r*2);
        text(players[i].u, 
                ((relativeWinX/2)+(players[i].x-player.pos.x)),
                ((relativeWinY/2)+(players[i].y-player.pos.y)-10));
    }
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
    drawBorder();
    player.update();
    testCheatA();
    testCheatB();
}

function emitData() {
    var data = {
        x: player.pos.x,
        y: player.pos.y,
        t: player.type,
	r: player.r,
        p: player.points,
        i: player.infected,
        m: send
    };
    socket.emit('update', data);
    send = 0;
}

/*
 * Check if player is near any edge of the playing field and
 * draw the appropriate border(s) if so.
 */
function drawBorder() {
    push();
    //Right side
    if (player.pos.x > (winX - (relativeWinX / 2))) {
        stroke('blue');
        var xBorder = winX - player.pos.x + (relativeWinX / 2);
        //Right bottom corner
        if (player.pos.y > (winY - (relativeWinY / 2))) {
            var yBorder = winY - player.pos.y + (relativeWinY / 2);
            line(xBorder,yBorder,xBorder,0);
        //Right top corner
        } else if (player.pos.y < (relativeWinY / 2)) {
            var yBorder = (relativeWinY / 2 ) - player.pos.y;
            line(xBorder,relativeWinY,xBorder,yBorder);
        //No corner
        } else {
            line(xBorder,0,xBorder,relativeWinY);
        }
    } 

    //Bottom side
    if (player.pos.y > (winY - (relativeWinY / 2))) {
        stroke('blue');
        var yBorder = winY - player.pos.y + (relativeWinY / 2);
        //Bottom left corner
        if (player.pos.x < (relativeWinX / 2)) {
            var xBorder = (relativeWinX / 2) - player.pos.x;
            line(xBorder,yBorder,relativeWinX,yBorder);
        //Bottom right corner
        } else if (player.pos.x > winX - (relativeWinX / 2)) {
            var xBorder = winX - player.pos.x + (relativeWinX / 2);
            line(0,yBorder,xBorder,yBorder);
        //No corner
        } else {
            line(0,yBorder,relativeWinX,yBorder);
        }
    }
    //Left side
    if (player.pos.x < (relativeWinX / 2)) {
        stroke('blue');
        var xBorder = (relativeWinX / 2) - player.pos.x;
        //Left top corner
        if (player.pos.y < (relativeWinY / 2)) {
            var yBorder = (relativeWinY / 2) - player.pos.y;
            line(xBorder,relativeWinY,xBorder,yBorder);
        //Left bottom corner
        } else if (player.pos.y > (winY - (relativeWinY / 2))) {
            var yBorder = winY - player.pos.y + (relativeWinY / 2);
            line(xBorder,0,xBorder,yBorder);
        } else {
        line(xBorder,0,xBorder,relativeWinY);
        }
    }
    //Top side
    if (player.pos.y < (relativeWinY / 2)) {
        stroke('blue');
        var yBorder = (relativeWinY / 2) - player.pos.y;
        //Top left corner 
        if (player.pos.x < (relativeWinX / 2)) {
            var xBorder = (relativeWinX / 2) - player.pos.x;
            line(xBorder,yBorder,relativeWinX,yBorder);
        //Top right corner
        } else if (player.pos.x > (winX - (relativeWinX / 2))) {
            var xBorder = winX - player.pos.x + (relativeWinX / 2);
            line(0,yBorder,xBorder,yBorder);
        } else {
        line(0,yBorder,relativeWinX,yBorder);
        }
    }
    pop();
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

