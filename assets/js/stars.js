const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
let mouseX = 0;
let mouseY = 0;
let zoomLevel = 1;
const minZoomLevel = 1;
const maxZoomLevel = 5;
let numStars = Math.floor((canvas.width * canvas.height) / 5000);
let stars = generateStars(numStars);
const numShootingStars = 5;
let shootingStarsEnabled = true;
let shootingStars = generateShootingStars(numShootingStars);

function updateMousePosition(event) {
  mouseX = event.clientX;
  mouseY = event.clientY;
}

function generateStars(count) {
  const starsArray = [];
  for (let i = 0; i < count; i++) {
    starsArray.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      radius: Math.random() * 0.85 + 0.55,
      alpha: Math.random() * 0.4 + 0.6,
      twinkleSpeed: Math.random() * 0.005 + 0.0025,
    });
  }
  return starsArray;
}

function generateShootingStars(count) {
  const shootingStarsArray = [];
  for (let i = 0; i < count; i++) {
    shootingStarsArray.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      length: Math.random() * 80 + 10,
      speed: Math.random() * 4 + 2,
      angle: Math.random() * Math.PI * 2,
    });
  }
  return shootingStarsArray;
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  const offsetX = (canvas.width / 2 - mouseX) * 0.02;
  const offsetY = (canvas.height / 2 - mouseY) * 0.02;

  for (let i = 0; i < stars.length; i++) {
    const star = stars[i];
    ctx.beginPath();
    ctx.arc(star.x + offsetX, star.y + offsetY, star.radius, 0, Math.PI * 2);
    ctx.closePath();
    ctx.fillStyle = 'rgba(255, 255, 255, ' + star.alpha + ')';
    ctx.fill();
    star.alpha += star.twinkleSpeed;
    if (star.alpha > 1 || star.alpha < 0.4) {
      star.twinkleSpeed *= -1;
    }
  }

  if (shootingStarsEnabled) {
    for (let i = 0; i < shootingStars.length; i++) {
      const shootingStar = shootingStars[i];
      shootingStar.x -= Math.cos(shootingStar.angle) * shootingStar.speed;
      shootingStar.y += Math.sin(shootingStar.angle) * shootingStar.speed;

      if (shootingStar.x < -shootingStar.length || shootingStar.y > canvas.height + shootingStar.length) {
        shootingStar.x = canvas.width + Math.random() * 500;
        shootingStar.y = Math.random() * canvas.height;
        shootingStar.length = Math.random() * 80 + 10;
        shootingStar.speed = Math.random() * 4 + 2;
        shootingStar.angle = Math.random() * Math.PI * 2;
      }

      ctx.beginPath();
      ctx.moveTo(shootingStar.x + offsetX, shootingStar.y + offsetY);
      ctx.lineTo(
        shootingStar.x - Math.cos(shootingStar.angle) * shootingStar.length + offsetX,
        shootingStar.y + Math.sin(shootingStar.angle) * shootingStar.length + offsetY
      );
      ctx.lineWidth = 2;
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.8)';
      ctx.stroke();
    }
  }

  requestAnimationFrame(draw);
}

draw();

window.addEventListener('resize', function () {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  numStars = Math.floor((canvas.width * canvas.height) / 5000);
  stars = generateStars(numStars);
});

window.addEventListener('mousemove', updateMousePosition);

window.addEventListener('wheel', function (event) {
  const scrollDirection = Math.sign(event.deltaY);
  zoomLevel -= scrollDirection;
  zoomLevel = Math.min(maxZoomLevel, Math.max(minZoomLevel, zoomLevel));
  const zoomMultiplier = Math.floor(zoomLevel);
  numStars = Math.floor((canvas.width * canvas.height) / 5000) * zoomMultiplier;
  stars = generateStars(numStars);
});
