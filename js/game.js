// Create the canvas
var canvas = document.createElement("canvas");
var ctx = canvas.getContext("2d");
canvas.width = 512;
canvas.height = 480;
document.body.appendChild(canvas);


// set the keys that will be used for encryption
var e = 19;

var p = Math.round(Math.random() * 100);
while(!isPrime(p) || p % 19 == 0) { p++; }

var q = Math.round(Math.random() * 1000);
while(!isPrime(p) || p % 19 == 0) { p++; }

n = p * q;

z = (p-1) * (q-1);

var d = 10000;
while( ((e*d)-1)%z != 1 ) { d++; }

// public key is (n,e)
// private key is (n,d)


DUP=0;
DDOWN=1;
DLEFT=2;
DRIGHT=3;
//Ugly Alert Box that allows user to chose server
var serverIp = prompt("Please enter server ip.", "localhost");
//Set up Web Socket
var ws = new WebSocket("ws://"+serverIp+":8888");


//window.onload= function (){ var ws = new WebSocket("ws://localhost:8888");};

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
  id : "0",
  balls:[],
  paintballcount : 0,
  speed: 256 // movement in pixels per second
};

var paintball= {
  speed: 256 // movement in pixels per second
};
paintballs= {
  id : "3",
  balls : [],
  paintballcount : 0
};




var monster = {
  id : "1",
  balls:[],
  paintballcount : 0,
  speed: 400
};
var score = 0;

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
player=hero;
//WebSocket event loop
ws.onmessage = function (evt) {
  //evt = decrypt(evt);
	if(evt.data=="hero"){
		alert("server chose hero");
		player = hero;
	}
	else if (evt.data=="monster"){
		alert("server chose monster");
		player = monster;
	}
	else
	{
		//Update Character positions
		try
		{
			jsonData = JSON.parse(evt.data);
			if(jsonData.id==monster.id && player.id!=monster.id)
			{
				monster=jsonData;
			}
			if(jsonData.id==hero.id && player.id!=hero.id)
			{
				hero=jsonData;
			}
		}
		catch(e)
		{
			console.log("error parsing JSON, evt.data =" +evt.data);
		}
	};
};
// Update game objects
var update = function (modifier) {
  if (38 in keysDown) { // Player holding up
    player.y -= player.speed * modifier;
    player.direction = DUP;
  }
  if (40 in keysDown) { // Player holding down
    player.y += player.speed * modifier;
    player.direction = DDOWN;
  }
  if (37 in keysDown) { // Player holding left
    player.x -= player.speed * modifier;
    player.direction = DLEFT;
  }
  if (39 in keysDown) { // Player holding right
    player.x += player.speed * modifier;
    player.direction = DRIGHT;
  }
  if (32 in keysDown){//Player is pressing Space
    paintball.x = player.x;
    paintball.y = player.y;

    //append bullet to bullet list
    player.balls.push({x: player.x, y: player.y,direction: player.direction});
    player.paintballcount++;
  }

  
  ws.send(JSON.stringify(player));


  // Are they touching?
  //This code but with each bullet
  for(var i=0; i<player.paintballcount; i++)
  {
    switch(player.balls[i].direction)
    {
    case DUP:
      player.balls[i].y-=230*modifier;
      console.log("up");
      break;
    case DDOWN:
      player.balls[i].y+=230*modifier;
      console.log("down");
      break;
    case DLEFT:
      player.balls[i].x-=230*modifier;
      console.log("left");
      break;
    case DRIGHT:
      player.balls[i].x+=230*modifier;
      console.log("right");
      break;
    default:
      alert("SOMETHING IS WRONG");
      break;
    }

  if (
    player.balls[i].x <= (monster.x + 15)
    && monster.x <= (player.balls[i].x + 15)
    && player.balls[i].y <= (monster.y + 15)
    && monster.y <= (player.balls[i].y + 15)
  ) {
    ++score;
    // reset();
  }

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
    for(var i=0;i<hero.paintballcount;i++)
    {
      ctx.drawImage(paintballImage, hero.balls[i].x, hero.balls[i].y);
    }
    for(var i=0;i<monster.paintballcount;i++)
    {
      ctx.drawImage(paintballImage, monster.balls[i].x, monster.balls[i].y);
    }
  }

  if (monsterReady) {
    ctx.drawImage(monsterImage, monster.x, monster.y);
  }

  // Score
  ctx.fillStyle = "rgb(250, 250, 250)";
  ctx.font = "24px Helvetica";
  ctx.textAlign = "left";
  ctx.textBaseline = "top";
  ctx.fillText("Your Score: " + score, 32, 32);
};



// The main game loop
var main = function () {
  var now = Date.now();
  var delta = now - then;

  update(delta / 1000);
  render();

  then = now;
};

function isPrime(num) {
    for (var i = 2; i < ((num/2)+1); i++) {
        if(num%i==0)
            return false;
    }
    return true;
}

function tobit(message) {
  var output = "";
  for (i=0; i < message.length; i++) {
    output += message[i].charCodeAt(0).toString(2) + "";
  }
  return output;
}

function convertToString(bitmessage) {
  var result = "";
  for (var i = 0; i < bitmessage.length; i++) {
    result += String.fromCharCode(parseInt(bitmessage[i], 2));
  }
  return result;
}

function encrypt(message, ee, nn) {
  return ((message^ee) % nn);
}

function decrypt(message, dd, nn) {
  return convertToString((message^dd) % nn);
}


// Let's play this game!
reset();
var then = Date.now();
setInterval(main, 1); // Execute as fast as possible