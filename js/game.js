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
//Set up Web Socket
var ws = new WebSocket("ws://128.111.43.31:8888");


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
  speed: 256, // movement in pixels per second
  id : "0"
};

var paintball= {
  speed: 256 // movement in pixels per second
};
var paintballs= []
paintballcount = 0;



var monster = {
  speed: 400,
  id : "1"
};
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
player=hero;
//WebSocket event loop
ws.onmessage = function (evt) {
  if(evt.data=="hero"){
    alert("server chose hero");
    player = hero;
  }
  if (evt.data=="monster"){
    alert("server chose monster");
    player = monster;
  };

  //Update Character positions
  if (evt.data[0]==hero.id && player.id!=hero.id)
  {

    if(evt.data[1]=="X")
    {
      //This converts the string to a number
      hero.x=1*evt.data.substring(2);
    }
    if(evt.data[1]=="Y")
    {
      //This converts the string to a number
      hero.y=1*evt.data.substring(2);
    }
  }
  if (evt.data[0]==monster.id && player.id!=monster.id)
  {

    if(evt.data[1]=="X")
    {
      //This converts the string to a number
      monster.x=1*evt.data.substring(2);
    }
    if(evt.data[1]=="Y")
    {
      //This converts the string to a number
      monster.y=1*evt.data.substring(2);
    }
  }
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
    paintballs.push({x: player.x, y: player.y,direction: player.direction});
    paintballcount++;
  }


  ws.send(player.id+"X"+player.x);
  ws.send(player.id+"Y"+player.y);


  // Are they touching?
  //This code but with each bullet
  for(var i=0; i<paintballcount; i++)
  {
    switch(paintballs[i].direction)
    {
    case DUP:
      paintballs[i].y-=230*modifier;
      console.log("up");
      break;
    case DDOWN:
      paintballs[i].y+=230*modifier;
      console.log("down");
      break;
    case DLEFT:
      paintballs[i].x-=230*modifier;
      console.log("left");
      break;
    case DRIGHT:
      paintballs[i].x+=230*modifier;
      console.log("right");
      break;
      defualt:
      alert("FUCL");
      break;
    }

  if (
    paintballs[i].x <= (monster.x + 15)
    && monster.x <= (paintballs[i].x + 15)
    && paintballs[i].y <= (monster.y + 15)
    && monster.y <= (paintballs[i].y + 15)
  ) {
    ++monstersCaught;
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
