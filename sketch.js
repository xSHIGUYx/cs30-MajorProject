// Project Title
// Your Name
// Date
//
// Extra for Experts:
// - describe what you did to take this project "above and beyond"
let playerRun1, playerRun2, playerRun3, playerRun4, playerRun5, playerRun6, playerRun7, playerRun8;
let playerMagic1, playerMagic2, playerMagic3, playerMagic4, playerMagic5, playerMagic6, playerMagic7, playerMagic8, playerMagic9;
let runCycle = [];
let magicCycle = [];
let player1;
let runSprite;
let magicSprite;
let runCycleTimer;
let magicCycleTimer;

function preload() {
  playerRun1 = loadImage("assets/playerRun1.png");
  playerRun2 = loadImage("assets/playerRun2.png");
  playerRun3 = loadImage("assets/playerRun3.png");
  playerRun4 = loadImage("assets/playerRun4.png");
  playerRun5 = loadImage("assets/playerRun5.png");
  playerRun6 = loadImage("assets/playerRun6.png");
  playerRun7 = loadImage("assets/playerRun7.png");
  playerRun8 = loadImage("assets/playerRun8.png");
  runCycle = {currentImage: [playerRun1, playerRun2, playerRun3, playerRun4, playerRun5, playerRun6, playerRun7, playerRun8], imageNumber: 0};
  playerMagic1 = loadImage("assets/playerMagic1.png");
  playerMagic2 = loadImage("assets/playerMagic2.png");
  playerMagic3 = loadImage("assets/playerMagic3.png");
  playerMagic4 = loadImage("assets/playerMagic4.png");
  playerMagic5 = loadImage("assets/playerMagic5.png");
  playerMagic6 = loadImage("assets/playerMagic6.png");
  playerMagic7 = loadImage("assets/playerMagic7.png");
  playerMagic8 = loadImage("assets/playerMagic8.png");
  playerMagic9 = loadImage("assets/playerMagic9.png");
  magicCycle = {currentImage: [playerMagic1, playerMagic2, playerMagic3, playerMagic4, playerMagic5, playerMagic6, playerMagic7, playerMagic8, playerMagic9], imageNumber: 0};
}

class Timer {
  ///Simple timer class with a millisecond time input
  ///Returns true when inputted time has elapsed
  constructor(timeToWait) {
    this.timeToWait = timeToWait;
    this.startTime = millis();
    this.endTime = this.startTime + this.timeToWait;
  }

  isDone() {
    return millis() >= this.endTime;
  }
}

class Player {
  constructor(x, speed) {
    this.width = 128;
    this.y = height * 0.75;
    this.x = x;
    this.speed = speed;
    this.move_right = false;
    this.move_left = false;
    this.isAttacking = false;
  }

  move() {
    if (this.move_right && this.x + this.width <= width) {
      this.x += this.speed;
    }
    if (this.move_left && this.x   >= 0) {
      this.x += -this.speed;
    }
  }

  draw() {
    if (this.isAttacking) {
      if (magicCycleTimer.isDone()) {
        magicSprite = magicCycle.currentImage[magicCycle.imageNumber];
        if (magicCycle.imageNumber + 1 < magicCycle.currentImage.length) {
          magicCycle.imageNumber++;
        } 
        else {
          magicCycle.imageNumber = 0;
        }
        magicCycleTimer = new Timer(80);
      }
      image(magicSprite, this.x, this.y, this.width, this.width);
    }
    else if (this.move_right || this.move_left) {
      if (runCycleTimer.isDone()) {
        runSprite = runCycle.currentImage[runCycle.imageNumber];
        if (runCycle.imageNumber + 1 < runCycle.currentImage.length) {
          runCycle.imageNumber++;
        } 
        else {
          runCycle.imageNumber = 0;
        }
        runCycleTimer = new Timer(80);
      }
      image(runSprite, this.x, this.y, this.width, this.width);
    }
    else {
      image(playerRun1, this.x, this.y, this.width , this.width);
    }
  }
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  player1 = new Player(25, 4);
  runSprite = runCycle.currentImage[0];
  magicSprite = magicCycle.currentImage[0];
  runCycleTimer = new Timer(80);
  magicCycleTimer = new Timer(120);
}

function draw() {
  background(220);
  playerFunctions();
  fill(0);
  rect(0, height - 70, width, 75);
}

function playerFunctions() {
  player1.draw();
  player1.move();
}

function keyPressed() {
  if (keyCode === RIGHT_ARROW) {
    player1.move_right = true;
  }
  if (keyCode === LEFT_ARROW) {
    player1.move_left = true;
  }
  if (keyCode === UP_ARROW) {
    player1.isAttacking = true;
  }
}

function keyReleased() {
  if (keyCode === RIGHT_ARROW) {
    player1.move_right = false;
  }
  if (keyCode === LEFT_ARROW) {
    player1.move_left = false;
  }
}