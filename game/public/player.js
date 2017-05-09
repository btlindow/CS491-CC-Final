function Player() {
    this.pos = createVector(random(winX), random(winY));
    this.r = 10;
    this.type = 1;
    this.dist = 8;
    this.color = color(0,255,0);
    this.infected = 0;
    this.points = 0;
    this.counter = 0;
    this.speedy = 0;
 
    this.show = function() {
        if (this.type == 0)
            this.color = color(255,0,0);
	else
	    this.color = color(0,255,0);
        fill(this.color);
        //ellipse(this.pos.x, this.pos.y, this.r*2, this.r*2);
        ellipse((window.innerWidth)/2, (window.innerHeight)/2, this.r*2, this.r*2);
        fill(0,0,0)
        //ellipse(this.pos.x, this.pos.y, this.r, this.r);
        ellipse((window.innerWidth)/2, (window.innerHeight)/2, this.r, this.r);
        
        textSize(32);
        if(this.type == 1) {
	    this.counter++;
	    this.counter = this.counter % 50;
	    if (this.counter == 0) {
		this.points += 10;
	    }
            fill(255, 204, 0);
            text(this.points + " pts", 10, 30);
        }
        else {
            fill('red');
            text(this.infected + " infects", 10, 30)
        }
        
        
    }
    
    this.update = function() {
        if (this.type == 0)
            this.dist = 8;
	else
	    this.dist = 5;
	if (this.speedy == 1)
	    this.dist = 25;
        if (keyIsDown(87))
            this.pos.y -= this.dist;
        if (keyIsDown(83)) 
            this.pos.y += this.dist;
        if (keyIsDown(65))
            this.pos.x -= this.dist;
        if (keyIsDown(68)) 
            this.pos.x += this.dist;
    }
}
