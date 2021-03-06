let gameWidth = window.innerWidth;
let gameHeight = window.innerHeight;

this.bulletTab = [];
this.asteroidTab = [];

let score = 0;
let bestScore = 0;
let playerLevel = 1;

this.maxSpeed = 10;
this.godMod = false;

const pipi = Math.PI * 2;

xPlayer = gameWidth / 2;
yPlayer = gameHeight - 100;
anglePlayer = - pipi / 4;
velocityPlayer = 0;

xVelocityPlayer = 0;
yVelocityPlayer = 0;

function setup() {
  createCanvas(gameWidth, gameHeight);
  background(50,50,50);
  generateAsteroid(10);
}

var playing = function() {
  requestAnimationFrame(playing);

  computePlayer();
  computeBullets();
  computeAsteroids();
  checkCollision(asteroidTab, bulletTab);
  if (!this.godMod) collidePlayer(xPlayer, yPlayer, asteroidTab);

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
    asteroidTab.push(asteroid);
  }
}

function draw() {
  background(50,50,50);
  drawBullets(bulletTab);
  drawAsteroids(asteroidTab);
  drawScore(score);
  checkKeyboard();
  drawPlayer(xPlayer, yPlayer);
}

function drawPlayer(xPlayer, yPlayer) {
  fill(240, 10, 10);
  ellipse(xPlayer - 2 * xVelocityPlayer, yPlayer - 2 * yVelocityPlayer, 15, 15);
  fill(220, 30, 30);
  ellipse(xPlayer - 4 * xVelocityPlayer, yPlayer - 4 * yVelocityPlayer, 10, 10);
  fill(200, 50, 50);
  ellipse(xPlayer - 6 * xVelocityPlayer, yPlayer - 6 * yVelocityPlayer, 5, 5);
  fill(200,200,200);
  triangle(
      xPlayer + cos(anglePlayer) * 30, yPlayer + sin(anglePlayer) * 30,
      xPlayer + cos(anglePlayer + pipi/3) * 20, yPlayer + sin(anglePlayer + pipi/3) * 20,
      xPlayer + cos(anglePlayer - pipi/3) * 20, yPlayer + sin(anglePlayer - pipi/3) * 20,
    );
}

function drawScore(score) {
  textSize(32);
  fill(180, 180, 180);
  text("Score: " + score, gameWidth - 180, 50);
  textSize(32);
  fill(180, 180, 180);
  text("Best score: " + bestScore, 30, 50);
}

function drawBullets(bulletTab) {
  bulletTab.forEach(function(bullet) {
    fill(230 - bullet.delay,115 - (bullet.delay / 2),115 - (bullet.delay / 2));
    ellipse(bullet.xBullet, bullet.yBullet, 10, 10);
  }, this);
}

function drawAsteroids(asteroidTab) {
  asteroidTab.forEach(function(asteroid) {
    fill(asteroid.red, asteroid.green, asteroid.blue);
    ellipse(asteroid.xAsteroid, asteroid.yAsteroid, asteroid.size, asteroid.size);
  })
}

function fire(xPlayer, yPlayer, anglePlayer) {
  bulletTab.push({
    xBullet: xPlayer,
    yBullet: yPlayer,
    angleBullet: anglePlayer,
    delay: 200
  });
  if (playerLevel >= 2) {
    bulletTab.push({
      xBullet: xPlayer,
      yBullet: yPlayer,
      angleBullet: anglePlayer - pipi/20,
      delay: 200
    });
    bulletTab.push({
      xBullet: xPlayer,
      yBullet: yPlayer,
      angleBullet: anglePlayer + pipi/20,
      delay: 200
    });
  }
  if (playerLevel >= 3) {
    bulletTab.push({
      xBullet: xPlayer,
      yBullet: yPlayer,
      angleBullet: anglePlayer + pipi / 40,
      delay: 200
    });
    bulletTab.push({
      xBullet: xPlayer,
      yBullet: yPlayer,
      angleBullet: anglePlayer - pipi / 40,
      delay: 200
    });
  }
  if (playerLevel >= 4) {
    bulletTab.push({
      xBullet: xPlayer,
      yBullet: yPlayer,
      angleBullet: anglePlayer + pipi / 10,
      delay: 200
    });
    bulletTab.push({
      xBullet: xPlayer,
      yBullet: yPlayer,
      angleBullet: anglePlayer - pipi / 10,
      delay: 200
    });
    bulletTab.push({
      xBullet: xPlayer,
      yBullet: yPlayer,
      angleBullet: anglePlayer + pipi / 30,
      delay: 200
    });
    bulletTab.push({
      xBullet: xPlayer,
      yBullet: yPlayer,
      angleBullet: anglePlayer - pipi / 30,
      delay: 200
    });
  }
}

function checkKeyboard() {
  if (keyIsDown(UP_ARROW)) {
    if (velocityPlayer < this.maxSpeed) velocityPlayer += 0.2;
  } else if (keyIsDown(DOWN_ARROW)) {
    if (velocityPlayer > 0) velocityPlayer -= 0.4;
    else velocityPlayer = 0;
  }
  if (keyIsDown(LEFT_ARROW)) {
    anglePlayer -= 0.1;
  }
  if (keyIsDown(RIGHT_ARROW)) {
    anglePlayer += 0.1;
  }
}

function keyPressed() {
  if (keyCode === 32) {
    fire(xPlayer, yPlayer, anglePlayer);
  }
}

function computePlayer() {
  xVelocityPlayer = velocityPlayer * Math.cos(anglePlayer);
  yVelocityPlayer = velocityPlayer * Math.sin(anglePlayer);

  ( xPlayer > gameWidth )
      ? xPlayer = 0
      : xPlayer += xVelocityPlayer;
  ( yPlayer > gameHeight )
      ? yPlayer = 0
      : yPlayer += yVelocityPlayer;
  ( xPlayer < 0 )
      ? xPlayer = gameWidth
      : xPlayer += xVelocityPlayer;
  ( yPlayer < 0 )
      ? yPlayer = gameHeight
      : yPlayer += yVelocityPlayer;
}

function computeBullets() {
  bulletTab.forEach(function(bullet) {
    if (bullet.delay == 0) {
      bulletTab.shift();
    }
    bullet.xBullet += 20 * Math.cos(bullet.angleBullet);
    bullet.yBullet += 20 * Math.sin(bullet.angleBullet);
    bullet.delay -= 1;
  }, this);
}

function computeAsteroids() {
  asteroidTab.forEach(function(asteroid) {
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

function checkCollision(asteroidTab, bulletTab) {
  asteroidTab.forEach(function(asteroid) {
    bulletTab.forEach(function(bullet) {
      if (Math.abs(bullet.xBullet - asteroid.xAsteroid) < asteroid.size
       && Math.abs(bullet.yBullet - asteroid.yAsteroid) < asteroid.size) {
        asteroidCollide(asteroid);
        let bulletIndex = bulletTab.indexOf(bullet);
        destroyBullet(bulletIndex);
      }

    })
  })
}

function collidePlayer(xPlayer, yPlayer, asteroidTab) {
    asteroidTab.forEach(function(asteroid) {
      if (Math.abs(xPlayer - asteroid.xAsteroid) < (asteroid.size / 2)
       && Math.abs(yPlayer - asteroid.yAsteroid) < (asteroid.size / 2)) {
        resetGame();
       }
    })
}

function asteroidCollide(asteroid) {
  if (asteroid.size > 25) {
    score += Math.round((1/asteroid.size) * 1000);
    if (score > bestScore) bestScore = score;
    if (score >= 1000) playerLevel = 2;
    if (score >= 3000) playerLevel = 3;
    if (score >= 6000) playerLevel = 4;
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
    asteroidTab.push(asteroidBis);

    asteroid.size = (asteroid.size / 1.2);
    asteroid.velocityAsteroid += 1;
    asteroid.angle += pipi / 4;
    asteroid.xVelocityAsteroid = asteroid.velocityAsteroid * cos(asteroid.angle);
    asteroid.yVelocityAsteroid = asteroid.velocityAsteroid * sin(asteroid.angle);
  } else {
    let asteroidIndex = asteroidTab.indexOf(asteroid);
    destroyAsteroid(asteroidIndex);
  }
}

function destroyBullet(bulletIndex) {
  delete bulletTab[bulletIndex];
}

function destroyAsteroid(asteroidIndex) {
  delete asteroidTab[asteroidIndex];
}

function resetGame() {
  bulletTab = [];
  asteroidTab = [];
  score = 0;
  playerLevel = 1;

  xPlayer = gameWidth / 2;
  yPlayer = gameHeight - 100;
  anglePlayer = - pipi / 4;
  velocityPlayer = 0;

  xVelocityPlayer = 0;
  yVelocityPlayer = 0;

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
    let deltaAsteroid = (asteroidTab.length - Math.floor(newValue));
    if (deltaAsteroid > 0) {
      this.asteroidTab.splice(1, deltaAsteroid);
    } else {
      generateAsteroid(-deltaAsteroid);
    }
    console.log(this.asteroidTab)
  });

};