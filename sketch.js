// Project Title
// Your Name
// Date
//
// Extra for Experts:
// - describe what you did to take this project "above and beyond"

let runCycle = [];
let magicCycle = [];
let player;
let runSprite;
let magicSprite;
let runCycleTimer;
let magicCycleTimer;
let enemyList = [];

function preload() {
  runCycle = {currentImage: [], imageNumber: 0};
  for (let i = 1; i < 9; i++) {
    runCycle.currentImage.push(loadImage("assets/playerRun" + i + ".png"));
  }

  magicCycle = {currentImage: [], imageNumber: 0};
  for (let i = 1; i < 10; i++) {
    magicCycle.currentImage.push(loadImage("assets/playerMagic" + i + ".png"));
  }
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
    this.health = 100;
    this.maxHealth = this.health;
    this.width = 128;
    this.y = height * 0.75;
    this.x = x;
    this.speed = speed;
    this.move_right = false;
    this.move_left = false;
    this.isAttacking = false;
    this.damageAlarm = new Timer(0);
    this.damageDealt = 5;
  }

  damageCheck() {
    for (let i = 0; i < enemyList.length; i++) {
      if (enemyList[i].x < this.x + this.width - 30 && enemyList[i].x + enemyList[i].width > this.x + 30 && this.damageAlarm.isDone()) {
        this.damageAlarm = new Timer(600);
        this.health -= enemyList[i].damageDealt;
      }
    }
  }

  move() {
    if (!this.isAttacking) {
      if (this.move_right && this.x + this.width <= width) {
        this.x += this.speed;
      }
      if (this.move_left && this.x   >= 0) {
        this.x += -this.speed;
      }
    }
  }

  drawHealth() {
    fill(0);
    rect(20, 20, 500, 50);
    if (this.health >= this.maxHealth * 0.6) {
      fill(0, 215, 0);
    }
    else if (this.health >= this.maxHealth * 0.3) {
      fill(180, 180, 0);
    }
    else{
      fill(215, 0, 0);
    }
    rect(20, 20, this.health * 5, 50);
  }

  draw() {
    //Attack animation
    if (this.isAttacking) {
      if (magicCycleTimer.isDone()) {
        magicSprite = magicCycle.currentImage[magicCycle.imageNumber];
        if (magicCycle.imageNumber + 1 < magicCycle.currentImage.length) {
          magicCycle.imageNumber++;
        } 
        else {
          magicCycle.imageNumber = 0;
          this.isAttacking = false;
        }
        magicCycleTimer = new Timer(80);
      }
      image(magicSprite, this.x, this.y, this.width, this.width);
    }
    ///Movement animation
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
      image(runCycle.currentImage[0], this.x, this.y, this.width , this.width);
    }
  }
}

class Enemy {
  constructor(type) {
    if (type === "walker") {
      this.width = 50;
      this.x = windowWidth - this.width;
      this.y = height - 70 - this.width;
      this.speed = 3;
      this.health = 10;
      this.maxHealth = this.health;
      this.damageDealt = 25;
      this.damageAlarm = new Timer(0);
    }
  }

  move() {
    this.x -= this.speed;
  }

  draw() {
    fill(0, 255, 200);
    rect(this.x, height - 70 - this.width, this.width, this.width);
  }

  drawHealth() {
    fill(0);
    rect(this.x, this.y - 20, this.maxHealth * 5, 10);
    if (this.health >= this.maxHealth * 0.6) {
      fill(0, 215, 0);
    }
    else if (this.health >= this.maxHealth * 0.3) {
      fill(180, 180, 0);
    }
    else{
      fill(215, 0, 0);
    }
    rect(this.x, this.y - 20, this.health * 5, 10);
  }

  damageCheck() {
    if (player.x < this.x + this.width && player.x + player.width > this.x && this.damageAlarm.isDone() && player.isAttacking) {
      this.damageAlarm = new Timer(400);
      this.health -= player.damageDealt;
      if (this.health <= 0) {
        enemyList.pop(enemyList[this]);
      }
    }
  }
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  player = new Player(25, 4);
  runSprite = runCycle.currentImage[0];
  magicSprite = magicCycle.currentImage[0];
  runCycleTimer = new Timer(80);
  magicCycleTimer = new Timer(80);
  enemyList.push(new Enemy("walker"));
}

function draw() {
  drawBackground();
  playerFunctions();
  enemyFunctions();
}

function drawBackground() {
  background(220);
  ///Floor
  fill(0);
  rect(0, height - 70, width, 75);
}

function playerFunctions() {
  player.draw();
  player.move();
  player.damageCheck();
  player.drawHealth();
  player.health = constrain(player.health, 0, player.health);
}

function enemyFunctions() {
  for (let i = 0; i < enemyList.length; i++) {
    enemyList[i].move();
    enemyList[i].draw();
    enemyList[i].drawHealth();
    enemyList[i].damageCheck();
  }
}

function keyPressed() {
  if (keyCode === RIGHT_ARROW) {
    player.move_right = true;
  }
  if (keyCode === LEFT_ARROW) {
    player.move_left = true;
  }
  if (key === "a") {
    player.isAttacking = true;
  }
}

function keyReleased() {
  if (keyCode === RIGHT_ARROW) {
    player.move_right = false;
  }
  if (keyCode === LEFT_ARROW) {
    player.move_left = false;
  }
}

function windowResized() {
  createCanvas(windowWidth, windowHeight);
}