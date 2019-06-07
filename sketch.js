// Project Title
// Your Name
// Date
//
// Extra for Experts:
// - describe what you did to take this project "above and beyond"

let runCycle, magicCycle;
let rollerCycle;
let player;
let runCycleTimer;
let magicCycleTimer;
let stabCycle;
let stabCycleTimer;
let rollerCycleTimer;
let enemyList = [];
let floor = 70;

function preload() {
  runCycleTimer = new Timer(0);
  runCycle = {currentImage: [], imageNumber: 0};
  for (let i = 1; i < 9; i++) {
    runCycle.currentImage.push(loadImage("assets/playerRun/playerRun" + i + ".png"));
  }

  magicCycleTimer = new Timer(0);
  magicCycle = {currentImage: [], imageNumber: 0};
  for (let i = 1; i < 10; i++) {
    magicCycle.currentImage.push(loadImage("assets/playerMagic/playerMagic" + i + ".png"));
  }

  rollerCycleTimer = new Timer(0);
  rollerCycle = {currentImage: [], imageNumber: 0};
  for (let i = 1; i < 6; i++) {
    rollerCycle.currentImage.push(loadImage("assets/roller/roller" + i + ".png"));
  }

  stabCycleTimer = new Timer(0);
  stabCycle = {currentImage: [], imageNumber: 0};
  for (let i = 1; i < 13; i++) {
    stabCycle.currentImage.push(loadImage("assets/playerStab/playerStab" + i + ".png"));
  }
  print(stabCycle.currentImage);
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
    this.y = height - this.width - floor;
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
      if (enemyList[i].x < this.x + this.width - 35 && enemyList[i].x + enemyList[i].width > this.x + 35 
        && this.damageAlarm.isDone() && magicCycle.imageNumber < 4 && enemyList[i].damageAlarm.isDone()) {
        this.damageAlarm = new Timer(600);
        this.health -= enemyList[i].damageDealt;
      }
    }
    player.health = constrain(player.health, 0, player.health);
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
    //Alt Attack animation
    if (this.isAttacking) {
      // fill(255, 0 , 0);
      // rect(this.x + this.width / 2, this.y + this.width / 3, this.width * 1.5, this.width / 2);
      if (stabCycleTimer.isDone()) {
        if (stabCycle.imageNumber + 1 < stabCycle.currentImage.length) {
          stabCycle.imageNumber++;
        } 
        else {
          stabCycle.imageNumber = 0;
          this.isAttacking = false;
        }
        stabCycleTimer = new Timer(80);
      }
      image(stabCycle.currentImage[stabCycle.imageNumber], this.x + 20, this.y - 128, this.width * 2, this.width * 2);
    }
    ///Movement animation
    else if (this.move_right || this.move_left) {
      if (runCycleTimer.isDone()) {
        if (runCycle.imageNumber + 1 < runCycle.currentImage.length) {
          runCycle.imageNumber++;
        } 
        else {
          runCycle.imageNumber = 0;
        }
        runCycleTimer = new Timer(80);
      }
      image(runCycle.currentImage[runCycle.imageNumber], this.x, this.y, this.width, this.width);
    }
    else {
      image(runCycle.currentImage[0], this.x, this.y, this.width , this.width);
    }
  }
}

class Enemy {
  constructor(type) {
    this.type = type;
    if (type === "walker") {
      this.width = 120;
      this.x = width - this.width;
      this.y = height - floor - this.width;
      this.speed = -3;
      this.health = 10;
      this.maxHealth = this.health;
      this.damageDealt = 25;
      this.damageAlarm = new Timer(0);
    }
  }

  move() {
    if (this.damageAlarm.isDone()) {
      this.x += this.speed;
    }
    else {
      this.x += 5;
    }
  }

  draw() {
    if (this.type === "walker") {
      if (rollerCycleTimer.isDone()) {
        if (rollerCycle.imageNumber + 1 < rollerCycle.currentImage.length) {
          rollerCycle.imageNumber++;
        }
        else {
          rollerCycle.imageNumber = 0;
        }
        rollerCycleTimer = new Timer(80);
      }
      image(rollerCycle.currentImage[rollerCycle.imageNumber], this.x, this.y, this.width, this.width);
    }
  }

  drawHealth() {
    fill(0);
    rect(this.x, this.y - 20, this.width, 10);
    if (this.health >= this.maxHealth * 0.6) {
      fill(0, 215, 0);
    }
    else if (this.health >= this.maxHealth * 0.3) {
      fill(180, 180, 0);
    }
    else{
      fill(215, 0, 0);
    }
    rect(this.x, this.y - 20, this.health * this.width / 10, 10);
  }

  damageCheck() {
    if (this.x <= player.x + player.width * 1.5 && this.x + this.width >= player.x + player.width / 2 && this.damageAlarm.isDone() 
    && player.isAttacking && stabCycle.imageNumber >= 9) {
      this.damageAlarm = new Timer(400);
      this.health -= player.damageDealt;
    }
  }
}

function setup() {
  createCanvas(1600, 789);
  player = new Player(25, 4);
  window.setInterval(enemyCreate, 5000);
}

function enemyCreate() {
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
  rect(0, height - floor, width, 75);
}

function playerFunctions() {
  player.draw();
  player.move();
  player.damageCheck();
  player.drawHealth();
}

function enemyFunctions() {
  for (let i = 0; i < enemyList.length; i++) {
    enemyList[i].move();
    enemyList[i].draw();
    enemyList[i].drawHealth();
    enemyList[i].damageCheck();
  }
  for (let i = enemyList.length - 1; i >= 0; i--) {
    if (enemyList[i].health <= 0) {
      enemyList.splice(i, 1);
    }
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