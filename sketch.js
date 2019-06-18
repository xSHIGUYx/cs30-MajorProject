// Skeleton Go Right
// Shiloh Berscheid
// 6/17/2019
//
// Extra for Experts:                                  
// - describe what you did to take this project "above and beyond"

let FLOOR = 70;
let runCycle, stabCycle, hitCycle;
let rollerCycle, swordBoiWalkCycle, swordBoiAttackCycle;
let rollerCycleTimer;
let swordBoiWalkTimer;
let swordBoiAttackTimer;
let player;
let blood;
let bloodList = [];
let enemyList = [];
let hitBoxList = [];
let points = 0;
let state = "game";

function preload() {
  runCycle = {currentImage: [], imageNumber: 0};
  for (let i = 1; i < 9; i++) {
    runCycle.currentImage.push(loadImage("assets/playerRun/playerRun" + i + ".png"));
  }

  hitCycle = {currentImage: [], imageNumber: 0};
  for (let i = 1; i < 9; i++) {
    hitCycle.currentImage.push(loadImage("assets/playerHit/hit" + i + ".png"));
  }

  rollerCycle = {currentImage: [], imageNumber: 0};
  for (let i = 1; i < 6; i++) {
    rollerCycle.currentImage.push(loadImage("assets/roller/roller" + i + ".png"));
  }

  stabCycle = {currentImage: [], imageNumber: 0};
  for (let i = 1; i < 13; i++) {
    stabCycle.currentImage.push(loadImage("assets/playerStab/playerStab" + i + ".png"));
  }

  swordBoiWalkCycle = {currentImage: [], imageNumber: 0};
  for (let i = 1; i < 5; i++) {
    swordBoiWalkCycle.currentImage.push(loadImage("assets/swordBoi/walking/swordBoi" + i + ".png"));
  }

  swordBoiAttackCycle = {currentImage: [], imageNumber: 0};
  for (let i = 1; i < 11; i++) {
    swordBoiAttackCycle.currentImage.push(loadImage("assets/swordBoi/attacking/attack" + i + ".png"));
  }

  blood = loadImage("assets/blood.png");
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

class Blood {
  constructor(creator) {
    this.x = creator.x + creator.width/2;
    this.y = creator.y + creator.width/2;
    this.dir = random(360);
    this.speed = random(7, 10);
    this.alpha = 0;
    this.width = 30;
    this.height = 10;
  }

  move() {
    this.alpha++;
    this.x += Math.cos(this.dir) * this.speed;
    this.y += Math.sin(this.dir) * this.speed;
  }

  draw() {
    push();
    translate(this.x, this.y);
    rotate(this.dir);
    image(blood, 0, 0, this.width, this.height, 0, this.alpha);
    pop();
  }
}

class Player {
  constructor(x, speed) {
    this.health = 100;
    this.maxHealth = this.health;
    this.width = 128;
    this.y = height - this.width - FLOOR;
    this.x = x;
    this.speed = speed;
    this.move_right = false;
    this.move_left = false;
    this.isAttacking = false;
    this.attackTimer = new Timer(0);
    this.runTimer = new Timer(0);
    this.hitTimer = new Timer(0);
    this.damageDealt = 5;
    this.tempHealth = this.health;
    this.attackCycle = stabCycle;
    this.isHit = false;
  }

  move() {
    if (!this.isAttacking && !this.isHit) {
      if (this.move_right && this.x + this.width <= width) {
        this.x += this.speed;
      }
      if (this.move_left && this.x   >= 0) {
        this.x += -this.speed;
      }
    }
  }

  drawHealth() {
    player.health = constrain(player.health, 0, player.health);
    if (this.tempHealth !== this.health) {
      this.tempHealth -= 0.5;
    }
    fill(0);
    rect(20, 20, 500, 50);
    if (this.tempHealth >= this.maxHealth * 0.6) {
      fill(0, 215, 0);
    }
    else if (this.tempHealth >= this.maxHealth * 0.3) {
      fill(180, 180, 0);
    }
    else{
      fill(215, 0, 0);
    }
    rect(20, 20, this.tempHealth * 5, 50);
  }

  hitBoxCreate() {
    if (this.isAttacking && this.attackCycle === stabCycle && this.attackCycle.imageNumber >= 9) {
      hitBoxList.push(new Hitbox(this.x + this.width, this.y, this.width, "player"));
    }
    else if (this.isAttacking && this.attackCycle === stabCycle 
      && this.attackCycle.imageNumber < 5 && this.attackCycle.imageNumber > 2){
      hitBoxList.push(new Hitbox(this.x + this.width / 2, this.y, this.width, "player"));
    }
  }

  draw() {
    if (!this.isHit) {
      //Attack animation
      if (this.isAttacking) {
        if (this.attackTimer.isDone()) {
          if (this.attackCycle.imageNumber + 1 < this.attackCycle.currentImage.length) {
            this.attackCycle.imageNumber++;
          } 
          else {
            this.attackCycle.imageNumber = 0;
            this.isAttacking = false;
          }
          this.attackTimer = new Timer(80);
        }
        image(this.attackCycle.currentImage[this.attackCycle.imageNumber], this.x + 20, this.y - 128, this.width * 2, this.width * 2);
      }
      ///Movement animation
      else if (this.move_right || this.move_left) {
        if (this.runTimer.isDone()) {
          if (runCycle.imageNumber + 1 < runCycle.currentImage.length) {
            runCycle.imageNumber++;
          } 
          else {
            runCycle.imageNumber = 0;
          }
          this.runTimer = new Timer(80);
        }
        image(runCycle.currentImage[runCycle.imageNumber], this.x, this.y, this.width, this.width);
      }
      else {
        image(runCycle.currentImage[0], this.x, this.y, this.width , this.width);
      }
    }
    else {
      //Attack animation
      if (this.hitTimer.isDone()) {
        if (hitCycle.imageNumber + 1 < hitCycle.currentImage.length) {
          hitCycle.imageNumber++;
        }
        else {
          hitCycle.imageNumber = 0;
            this.isHit = false;
          }
          this.hitTimer = new Timer(80);
        }
      image(hitCycle.currentImage[hitCycle.imageNumber], this.x, this.y, this.width, this.width);
      this.x -= 3;
    }
  }
}

class Enemy {
  constructor(type) {
    this.type = type;
    if (type === "roller") {
      this.width = 120;
      this.x = width;
      this.startHurtX = this.x;
      this.endHurtX = this.width;
      this.y = height - FLOOR - this.width;
      this.speed = random(-4, -3);
      this.health = 10;
      this.maxHealth = this.health;
      this.damageDealt = 10;
      this.damageAlarm = new Timer(0);
      this.cycle = rollerCycle;
      this.isAttacking = false;
    }

    if (type === "swordBoi") {
      this.width = 128;
      this.x = width;
      this.startHurtX = this.x + 50;
      this.endHurtX = this.width - 50;
      this.y = height - FLOOR - this.width;
      this.speed = random(-2, -1);
      this.health = 20;
      this.maxHealth = this.health;
      this.damageDealt = 25;
      this.damageAlarm = new Timer(0);
      this.cycle = swordBoiWalkCycle;
      this.isAttacking = false;
    }
  }

  move() {
    if (this.type === "swordBoi") {
      this.startHurtX = this.x + 50;
      this.endHurtX = this.width - 50;
      if (collideRectRect(this.x + 10, this.y, this.width, this.width, 
        player.x + 40, player.y, player.width - 80, player.width) && this.damageAlarm.isDone()) {
          this.cycle = swordBoiAttackCycle;
          this.isAttacking = true;
        }
    }
    else if (this.type === "roller") {
      this.startHurtX = this.x;
      this.endHurtX = this.width;
      hitBoxList.push(new Hitbox(this.x, this.y, this.width, this));
    }
    if (this.damageAlarm.isDone() && !this.isAttacking) {
      this.x += this.speed;
    }
    else if (!this.damageAlarm.isDone()){
      this.x += 5;
    }
  }

  createHitBox() {
    if (this.type === "swordBoi") {
      if (this.isAttacking && this.cycle.imageNumber > 5) {
        hitBoxList.push(new Hitbox(this.x - this.width/2, this.y, this.width, this));
      }
    }
  }

  draw() {
    if (this.health <= 0) {
      for (let i = 0; i < random(5, 10); i++) {
        bloodList.push(new Blood(this));
      }
    }
    if (this.type === "roller") {
      if (rollerCycleTimer.isDone()) {
        if (this.cycle.imageNumber + 1 < this.cycle.currentImage.length) {
          this.cycle.imageNumber++;
        }
        else {
          this.cycle.imageNumber = 0;
        }
        rollerCycleTimer = new Timer(90);
      }
      image(this.cycle.currentImage[this.cycle.imageNumber], this.x, this.y, this.width, this.width);
    }
    else if (this.type === "swordBoi"){
      if (this.isAttacking) {
        if (swordBoiAttackTimer.isDone()) {
          if (this.cycle.imageNumber + 1 < this.cycle.currentImage.length) {
            this.cycle.imageNumber++;
          } 
          else {
            this.cycle.imageNumber = 0;
            this.cycle = swordBoiWalkCycle;
            this.isAttacking = false;
          }
          swordBoiAttackTimer = new Timer(80);
        }
        image(this.cycle.currentImage[this.cycle.imageNumber], this.x, this.y, this.width, this.width);
      }
      else {
        if (swordBoiWalkTimer.isDone()) {
          if (this.cycle.imageNumber + 1 < this.cycle.currentImage.length) {
            this.cycle.imageNumber++;
          }
          else {
            this.cycle.imageNumber = 0;
          }
          swordBoiWalkTimer = new Timer(100);
        }
        image(this.cycle.currentImage[this.cycle.imageNumber], this.x, this.y, this.width, this.width);
      } 
    }
  }

  drawHealth() {
    fill(0);
    rect(this.x, this.y - 20, this.width * this.maxHealth / 10, 10);
    if (this.health >= this.maxHealth * 0.6) {
      fill(0, 215, 0);
    }
    else if (this.health >= this.maxHealth * 0.3) {
      fill(180, 180, 0);
    }
    else{
      fill(215, 0, 0);
    }
    rect(this.x, this.y - 20, this.width * this.health / 10, 10);
  }
}

class Hitbox {
  constructor(x, y, width, creator) {
    this.creator = creator;
    this.x = x;
    this.y = y;
    this.width = width;
    this.timeToDie = false;
  }

  checkForHit() {
    // fill("black");
    // rect(this.x, this.y, this.width, this.width);
    if (this.creator === "player") {
      for(let i = 0; i < enemyList.length; i++) {
        if (collideRectRect(this.x, this.y, this.width, this.width, 
          enemyList[i].startHurtX, enemyList[i].y, enemyList[i].endHurtX, enemyList[i].width) && enemyList[i].damageAlarm.isDone()) {
          enemyList[i].damageAlarm = new Timer(400);
          enemyList[i].health -= player.damageDealt;
          if (enemyList[i].type === "swordBoi") {
            enemyList[i].cycle.imageNumber = 0;
            enemyList[i].cycle = swordBoiWalkCycle;
            enemyList[i].isAttacking = false;
          }
        }
      }
      this.timeToDie = true;
    }
    else {
      if (collideRectRect(this.x, this.y, this.width, this.width,
        player.x + 40, player.y, player.width - 80, player.width) && !player.isHit) {
          if (this.creator.type === "roller") {
            this.creator.speed = -12;
          }
          player.isHit = true;
          player.health -= this.creator.damageDealt;
      }
      this.timeToDie = true;
    }
  }
}

function setup() {
  createCanvas(1600, 789);
  textAlign(CENTER);
  rollerCycleTimer = new Timer(0);
  swordBoiWalkTimer = new Timer(0);
  swordBoiAttackTimer = new Timer(0);
  player = new Player(25, 4);
  window.setInterval(enemyCreate, 2500);
}

function enemyCreate() {
  enemyList.push(random([new Enemy("roller"), new Enemy("swordBoi")]));
}

function draw() {
  if (state === "game") {
    drawBackground();
    playerFunctions();
    enemyFunctions();
    bloodFunctions();
    hitBoxFunctions();
    displayPoints();
  }
  else {
    drawBackground()
    textSize(280);
    fill(0);
    text("Game Over", width/2, height/2);
    textSize(100);
    fill(0);
    text("Press 'R' to Restart!", width/2, height/2 + 200);
  }
}

function displayPoints() {
  textSize(100);
  fill(0);
  text("Points: " + points, width/2, 0 + 100);
}

function hitBoxFunctions() {
  for (let i = 0; i < hitBoxList.length; i++) {
    hitBoxList[i].checkForHit();
    if (hitBoxList[i].timeToDie) {
      hitBoxList.splice(i, 1);
    }
  }
}

function drawBackground() {
  background("blue");
  ///FLOOR
  fill("orange");
  rect(0, height - FLOOR, width, 75);
}

function bloodFunctions() {
  for (let i = 0; i < bloodList.length; i++) {
    bloodList[i].move();
    bloodList[i].draw();
  }
  for (let i = bloodList.length - 1; i >= 0; i--) {
    if (bloodList[i].alpha > 255) {
      bloodList.splice(i, 1);
    }
  }
}

function playerFunctions() {
  if (player.tempHealth <= 0) {
    state = "gameOver"
  }
  player.draw();
  player.move();
  player.hitBoxCreate();
  player.drawHealth();
}

function enemyFunctions() {
  for (let i = 0; i < enemyList.length; i++) {
    enemyList[i].move();
    enemyList[i].draw();
    enemyList[i].drawHealth();
    enemyList[i].createHitBox();
  }
  for (let i = enemyList.length - 1; i >= 0; i--) {
    if (enemyList[i].health <= 0 || enemyList[i].x + enemyList[i].width <= 0) {
      enemyList.splice(i, 1);
      points += 50;
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
  if (key === "r" && state !== "game") {
    player.health = player.maxHealth;
    player.tempHealth = player.maxHealth;
    points = 0;
    enemyList = [];
    player.x = 25;
    state = "game";
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