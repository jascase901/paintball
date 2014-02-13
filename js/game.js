// Create the canvas
var canvas = document.createElement("canvas");
var ctx = canvas.getContext("2d");
canvas.width = 512;
canvas.height = 480;
document.body.appendChild(canvas);

DUP=0;
DDOWN=1;
DLEFT=2;
DRIGHT=3;

// Background image
var bgReady = false;
var bgImage = new Image();
bgImage.onload = function () {
	bgReady = true;
};
bgImage.src = "images/background.png";

// Hero image
var heroReady = false;
var heroImage = new Image();
heroImage.onload = function () {
	heroReady = true;
};
heroImage.src = "images/hero.png";

var paintballReady = false;

var paintballImage = new Image();
paintballImage.onload = function () {
	paintballReady = true;
};
paintballImage.src = "images/paintball.png";




// Monster image
var monsterReady = false;
var monsterImage = new Image();
monsterImage.onload = function () {
	monsterReady = true;
};
monsterImage.src = "images/monster.png";

// Game objects
var hero = {
	speed: 256 // movement in pixels per second
};
var paintball= {
	speed: 256 // movement in pixels per second
};
var paintballs= []
paintballcount = 0;



var monster = {};
var monstersCaught = 0;

// Handle keyboard controls
var keysDown = {};

addEventListener("keydown", function (e) {
	keysDown[e.keyCode] = true;
}, false);

addEventListener("keyup", function (e) {
	delete keysDown[e.keyCode];
}, false);

// Reset the game when the player catches a monster
var reset = function () {
	hero.x = canvas.width / 2;
	hero.y = canvas.height / 2;

	// Throw the monster somewhere on the screen randomly
	monster.x = 32 + (Math.random() * (canvas.width - 64));
	monster.y = 32 + (Math.random() * (canvas.height - 64));
};

// Update game objects
var update = function (modifier) {
	if (38 in keysDown) { // Player holding up
		hero.y -= hero.speed * modifier;
		hero.direction = DUP;
	}
	if (40 in keysDown) { // Player holding down
		hero.y += hero.speed * modifier;
		hero.direction = DDOWN;
	}
	if (37 in keysDown) { // Player holding left
		hero.x -= hero.speed * modifier;
		hero.direction = DLEFT;
	}
	if (39 in keysDown) { // Player holding right
		hero.x += hero.speed * modifier;
		hero.direction = DRIGHT;
	}
	if (32 in keysDown){//Player is pressing Space
		paintball.x = hero.x;
		paintball.y = hero.y;
		
		//append bullet to bullet list
		paintballs.push({x: hero.x, y: hero.y,direction: hero.direction});
		paintballcount++;
	}

	// Are they touching?
	//This code but with each bullet
	for(var i=0; i<paintballcount; i++)
	{
//		switch(paintballs[i].direction)
//		{
//			case DUP:
//				console.log("up");
//				paintballs[i].y=*10*modifier;
//				break;
//			case DDOWN:
//				console.log("down");
//				paintballs[i].y=*-10*modifier;
//				break;
//			case DLEFT:
//				console.log("left");
//				paintballs[i].x=*-10*modifier;
//				break;
//			case DRIGHT:
//				console.log("right");
//				paintballs[i].x=10*modifier;
//				break;
//			defualt:
//				alert("FUCL");
//				break;
//		}

	}
	if (
		hero.x <= (monster.x + 32)
		&& monster.x <= (hero.x + 32)
		&& hero.y <= (monster.y + 32)
		&& monster.y <= (hero.y + 32)
	) {
		++monstersCaught;
		reset();
	}
};

// Draw everything
var render = function () {
	if (bgReady) {
		ctx.drawImage(bgImage, 0, 0);
	}

	if (heroReady) {
		ctx.drawImage(heroImage, hero.x, hero.y);
	}

	if (paintballReady) {
		for(var i=0;i<paintballcount;i++)
		{
			ctx.drawImage(paintballImage, paintballs[i].x, paintballs[i].y);
		}
	}
	//for each in bullet ids 
	//ctx.drawImage(bulletImage, each.x, each.y);

	if (monsterReady) {
		ctx.drawImage(monsterImage, monster.x, monster.y);
	}

	// Score
	ctx.fillStyle = "rgb(250, 250, 250)";
	ctx.font = "24px Helvetica";
	ctx.textAlign = "left";
	ctx.textBaseline = "top";
	ctx.fillText("Goblins caught: " + monstersCaught, 32, 32);
};

// The main game loop
var main = function () {
	var now = Date.now();
	var delta = now - then;

	update(delta / 1000);
	render();

	then = now;
};

// Let's play this game!
reset();
var then = Date.now();
setInterval(main, 1); // Execute as fast as possible
