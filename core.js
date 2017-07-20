let gameWidth = window.innerWidth - 100;
let gameHeight = window.innerHeight - 100;

let bulletTab = [];
let asteroidTab = [];

let score = 0;
let bestScore = 0;

const pipi = Math.PI * 2;

xPlayer = 100;
yPlayer = 100;
anglePlayer = pipi/4;
velocityPlayer = 0;

xVelocityPlayer = 0;
yVelocityPlayer = 0;

function setup() {
  createCanvas(gameWidth, gameHeight);
  background(50,50,50);
  generateAsteroid(10);
}

function playing() {

  computePlayer();
  computeBullets();
  computeAsteroids();
  checkCollision(asteroidTab, bulletTab);
  collidePlayer(xPlayer, yPlayer, asteroidTab);
  
  setTimeout(function(){
      playing();
    }, 30);
}

function generateAsteroid(number) {
  for (let i = 0; i < number; i++) {
    let asteroid = {
      xAsteroid: Math.random() * gameWidth,
      yAsteroid: Math.random() * gameHeight,
      angle: Math.random() * pipi,
      velocityAsteroid: Math.random() * 1,
      size: Math.random() * 30 + 50,
      red: Math.random() * 255,
      green: Math.random() * 255,
      blue: Math.random() * 255
    }
    asteroid.xVelocityAsteroid = asteroid.velocityAsteroid * cos(asteroid.angle);
    asteroid.yVelocityAsteroid = asteroid.velocityAsteroid * sin(asteroid.angle);
    asteroidTab.push(asteroid);
  }
}

function draw() {
  drawPlayer(xPlayer, yPlayer);
  drawBullets(bulletTab);
  drawAsteroids(asteroidTab);
  drawScore(score);
}

function drawPlayer(xPlayer, yPlayer) {
  background(50,50,50);
  fill(200,200,200);
  triangle(
      xPlayer, yPlayer + 15,
      xPlayer + 15, yPlayer,
      xPlayer - 15, yPlayer,
    );
}

function drawScore(score) {
  textSize(32);
  fill(180, 180, 180);
  text("Score: " + score, gameWidth - 180, 30);
  textSize(32);
  fill(180, 180, 180);
  text("Best score: " + bestScore, 30, 30);
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
}


function keyPressed() {
  if (keyCode === UP_ARROW) {
    velocityPlayer += 1;
  } else if (keyCode === DOWN_ARROW) {
    velocityPlayer -= 1;
  } else if (keyCode === LEFT_ARROW) {
    anglePlayer -= 0.3;
  } else if (keyCode === RIGHT_ARROW) {
    anglePlayer += 0.3;
  } else if (keyCode === 32) {
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
  
  xPlayer = 100;
  yPlayer = 100;
  anglePlayer = pipi/4;
  velocityPlayer = 0;

  xVelocityPlayer = 0;
  yVelocityPlayer = 0;

  generateAsteroid(10);
}

playing();
