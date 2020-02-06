let gameWidth = window.innerWidth;
let gameHeight = window.innerHeight;

this.maxSpeed = 10;
this.godMod = false;

const pipi = Math.PI * 2;

let bestScore = 0;



let STATE = {
  xPlayer: gameWidth / 2,
  yPlayer: gameHeight - 100,
  anglePlayer: - pipi / 4,
  velocityPlayer: 0,
  bulletTab: [],
  asteroidTab: [],
  score: 0,
  playerLevel: 1
}


function setup() {
  createCanvas(gameWidth, gameHeight);
  background(50,50,50);
  generateAsteroid(10);
}

var playing = function() {
  requestAnimationFrame(playing);

  computePlayer(STATE);
  computeBullets(STATE);
  computeAsteroids(STATE);
  checkCollision(STATE);
  if (!this.godMod) collidePlayer(STATE);

}

function generateAsteroid(number) {
  for (let i = 0; i < number; i++) {
    let asteroid = {
      xAsteroid: randomFixed(2) * gameWidth,
      yAsteroid: randomFixed(2) * gameHeight,
      angle: randomFixed(2) * pipi,
      velocityAsteroid: randomFixed(2) * 1,
      size: randomFixed(2) * 30 + 50,
      red: randomFixed(2) * 255,
      green: randomFixed(2) * 255,
      blue: randomFixed(2) * 255
    }
    asteroid.xVelocityAsteroid = asteroid.velocityAsteroid * cos(asteroid.angle);
    asteroid.yVelocityAsteroid = asteroid.velocityAsteroid * sin(asteroid.angle);
    STATE.asteroidTab.push(asteroid);
  }
}

function draw() {
  background(50,50,50);
  drawBullets(STATE);
  drawAsteroids(STATE);
  drawScore(STATE);
  checkKeyboard();
  drawPlayer(STATE);
}

function drawPlayer(STATE) {
  fill(240, 10, 10);
  ellipse(STATE.xPlayer - 2 * (STATE.velocityPlayer * Math.cos(STATE.anglePlayer)), STATE.yPlayer - 2 * (STATE.velocityPlayer * Math.sin(STATE.anglePlayer)), 15, 15);
  fill(220, 30, 30);
  ellipse(STATE.xPlayer - 4 * (STATE.velocityPlayer * Math.cos(STATE.anglePlayer)), STATE.yPlayer - 4 * (STATE.velocityPlayer * Math.sin(STATE.anglePlayer)), 10, 10);
  fill(200, 50, 50);
  ellipse(STATE.xPlayer - 6 * (STATE.velocityPlayer * Math.cos(STATE.anglePlayer)), STATE.yPlayer - 6 * (STATE.velocityPlayer * Math.sin(STATE.anglePlayer)), 5, 5);
  fill(200,200,200);
  triangle(
      STATE.xPlayer + cos(STATE.anglePlayer) * 30, STATE.yPlayer + sin(STATE.anglePlayer) * 30,
      STATE.xPlayer + cos(STATE.anglePlayer + pipi/3) * 20, STATE.yPlayer + sin(STATE.anglePlayer + pipi/3) * 20,
      STATE.xPlayer + cos(STATE.anglePlayer - pipi/3) * 20, STATE.yPlayer + sin(STATE.anglePlayer - pipi/3) * 20,
    );
}

function drawScore(STATE) {
  textSize(32);
  fill(180, 180, 180);
  text("Score: " + STATE.score, gameWidth - 180, 50);
  textSize(32);
  fill(180, 180, 180);
  text("Best score: " + bestScore, 30, 50);
}

function drawBullets(STATE) {
  STATE.bulletTab.forEach(function(bullet) {
    fill(230 - bullet.delay,115 - (bullet.delay / 2),115 - (bullet.delay / 2));
    ellipse(bullet.xBullet, bullet.yBullet, 10, 10);
  }, this);
}

function drawAsteroids(STATE) {
  STATE.asteroidTab.forEach(function(asteroid) {
    fill(asteroid.red, asteroid.green, asteroid.blue);
    ellipse(asteroid.xAsteroid, asteroid.yAsteroid, asteroid.size, asteroid.size);
  })
}

function fire(STATE) {
  STATE.bulletTab.push({
    xBullet: STATE.xPlayer,
    yBullet: STATE.yPlayer,
    angleBullet: STATE.anglePlayer,
    delay: 200
  });
  if (STATE.playerLevel >= 2) {
    STATE.bulletTab.push({
      xBullet: STATE.xPlayer,
      yBullet: STATE.yPlayer,
      angleBullet: STATE.anglePlayer - pipi/20,
      delay: 200
    });
    STATE.bulletTab.push({
      xBullet: STATE.xPlayer,
      yBullet: STATE.yPlayer,
      angleBullet: STATE.anglePlayer + pipi/20,
      delay: 200
    });
  }
  if (STATE.playerLevel >= 3) {
    STATE.bulletTab.push({
      xBullet: STATE.xPlayer,
      yBullet: STATE.yPlayer,
      angleBullet: STATE.anglePlayer + pipi / 40,
      delay: 200
    });
    STATE.bulletTab.push({
      xBullet: STATE.xPlayer,
      yBullet: STATE.yPlayer,
      angleBullet: STATE.anglePlayer - pipi / 40,
      delay: 200
    });
  }
  if (STATE.playerLevel >= 4) {
    STATE.bulletTab.push({
      xBullet: STATE.xPlayer,
      yBullet: STATE.yPlayer,
      angleBullet: STATE.anglePlayer + pipi / 10,
      delay: 200
    });
    STATE.bulletTab.push({
      xBullet: STATE.xPlayer,
      yBullet: STATE.yPlayer,
      angleBullet: STATE.anglePlayer - pipi / 10,
      delay: 200
    });
    STATE.bulletTab.push({
      xBullet: STATE.xPlayer,
      yBullet: STATE.yPlayer,
      angleBullet: STATE.anglePlayer + pipi / 30,
      delay: 200
    });
    STATE.bulletTab.push({
      xBullet: STATE.xPlayer,
      yBullet: STATE.yPlayer,
      angleBullet: STATE.anglePlayer - pipi / 30,
      delay: 200
    });
  }
}

function checkKeyboard() {
  if (keyIsDown(UP_ARROW)) {
    if (STATE.velocityPlayer < this.maxSpeed) STATE.velocityPlayer += 0.2;
  } else if (keyIsDown(DOWN_ARROW)) {
    if (STATE.velocityPlayer > 0) STATE.velocityPlayer -= 0.4;
    else STATE.velocityPlayer = 0;
  }
  if (keyIsDown(LEFT_ARROW)) {
    STATE.anglePlayer -= 0.1;
  }
  if (keyIsDown(RIGHT_ARROW)) {
    STATE.anglePlayer += 0.1;
  }
}

function keyPressed() {
  if (keyCode === 32) {
    fire(STATE);
  }
}

function computePlayer() {
  xVelocityPlayer = STATE.velocityPlayer * Math.cos(STATE.anglePlayer);
  yVelocityPlayer = STATE.velocityPlayer * Math.sin(STATE.anglePlayer);

  ( STATE.xPlayer > gameWidth )
      ? STATE.xPlayer = 0
      : STATE.xPlayer += xVelocityPlayer;
  ( STATE.yPlayer > gameHeight )
      ? STATE.yPlayer = 0
      : STATE.yPlayer += yVelocityPlayer;
  ( STATE.xPlayer < 0 )
      ? STATE.xPlayer = gameWidth
      : STATE.xPlayer += xVelocityPlayer;
  ( STATE.yPlayer < 0 )
      ? STATE.yPlayer = gameHeight
      : STATE.yPlayer += yVelocityPlayer;
}

function computeBullets(STATE) {
  STATE.bulletTab.forEach(function(bullet) {
    if (bullet.delay == 0) {
      STATE.bulletTab.shift();
    }
    bullet.xBullet += 20 * Math.cos(bullet.angleBullet);
    bullet.yBullet += 20 * Math.sin(bullet.angleBullet);
    bullet.delay -= 1;
  }, this);
}

function computeAsteroids(STATE) {
  STATE.asteroidTab.forEach(function(asteroid) {
    ( asteroid.xAsteroid > gameWidth )
        ? (asteroid.xAsteroid = 0)
        : (asteroid.xAsteroid += asteroid.xVelocityAsteroid);
    ( asteroid.yAsteroid > gameHeight )
        ? (asteroid.yAsteroid = 0)
        : (asteroid.yAsteroid += asteroid.yVelocityAsteroid);
    ( asteroid.xAsteroid < 0 )
        ? (asteroid.xAsteroid = gameWidth)
        : (asteroid.xAsteroid += asteroid.xVelocityAsteroid);
    ( asteroid.yAsteroid < 0 )
        ? (asteroid.yAsteroid = gameHeight)
        : (asteroid.yAsteroid += asteroid.yVelocityAsteroid);
  }, this);
}

function checkCollision(STATE) {
  STATE.asteroidTab.forEach(function(asteroid) {
    STATE.bulletTab.forEach(function(bullet) {
      if (Math.abs(bullet.xBullet - asteroid.xAsteroid) < asteroid.size
       && Math.abs(bullet.yBullet - asteroid.yAsteroid) < asteroid.size) {
        asteroidCollide(asteroid);
        let bulletIndex = STATE.bulletTab.indexOf(bullet);
        destroyBullet(bulletIndex);
      }

    })
  })
}

function collidePlayer(STATE) {
  STATE.asteroidTab.forEach(function(asteroid) {
      if (Math.abs(STATE.xPlayer - asteroid.xAsteroid) < (asteroid.size / 2)
       && Math.abs(STATE.yPlayer - asteroid.yAsteroid) < (asteroid.size / 2)) {
        resetGame();
       }
    })
}

function asteroidCollide(asteroid) {
  if (asteroid.size > 25) {
    STATE.score += Math.round((1/asteroid.size) * 1000);
    if (STATE.score > bestScore) bestScore = STATE.score;
    if (STATE.score >= 1000) playerLevel = 2;
    if (STATE.score >= 3000) playerLevel = 3;
    if (STATE.score >= 6000) playerLevel = 4;
    let asteroidBis = {
      xAsteroid: asteroid.xAsteroid,
      yAsteroid: asteroid.yAsteroid,
      angle: asteroid.angle - pipi/4,
      velocityAsteroid: asteroid.velocityAsteroid + 1,
      size: asteroid.size/1.2,
      red: asteroid.red,
      green: asteroid.green,
      blue: asteroid.blue
    }
    asteroidBis.xVelocityAsteroid = asteroidBis.velocityAsteroid * cos(asteroidBis.angle);
    asteroidBis.yVelocityAsteroid = asteroidBis.velocityAsteroid * sin(asteroidBis.angle);
    STATE.asteroidTab.push(asteroidBis);

    asteroid.size = (asteroid.size / 1.2);
    asteroid.velocityAsteroid += 1;
    asteroid.angle += pipi / 4;
    asteroid.xVelocityAsteroid = asteroid.velocityAsteroid * cos(asteroid.angle);
    asteroid.yVelocityAsteroid = asteroid.velocityAsteroid * sin(asteroid.angle);
  } else {
    let asteroidIndex = STATE.asteroidTab.indexOf(asteroid);
    destroyAsteroid(asteroidIndex);
  }
}

function destroyBullet(bulletIndex) {
  delete STATE.bulletTab[bulletIndex];
}

function destroyAsteroid(asteroidIndex) {
  delete STATE.asteroidTab[asteroidIndex];
}

function resetGame() {
  console.log(STATE);

  STATE.bulletTab = [];
  STATE.asteroidTab = [];
  STATE.score = 0;
  STATE.playerLevel = 1;

  STATE.xPlayer = gameWidth / 2;
  STATE.yPlayer = gameHeight - 100;
  STATE.anglePlayer = - pipi / 4;
  STATE.velocityPlayer = 0;

  generateAsteroid(10);
}

function randomFixed(fixedValue) {
  return Math.random().toFixed(fixedValue);
}

playing();

var Options = function () {
  this.title = 'Asteroid Game';
  this.maxSpeed = 10;
  this.godMod = false;
  this.asteroidNumber = 10;
};

window.onload = function () {
  var options = new Options();
  var gui = new dat.GUI();
  gui.add(options, 'title');
  gui.add(options, 'maxSpeed', 1, 10, 1).onChange((newValue) => {
    this.maxSpeed = newValue;
  });
  gui.add(options, 'godMod').onChange((newValue) => {
    this.godMod = newValue;
  });;
  gui.add(options, 'asteroidNumber', 0, 100).onChange((newValue) => {
    let deltaAsteroid = (STATE.asteroidTab.length - Math.floor(newValue));
    if (deltaAsteroid > 0) {
      STATE.asteroidTab.splice(1, deltaAsteroid);
    } else {
      generateAsteroid(-deltaAsteroid);
    }
  });

};