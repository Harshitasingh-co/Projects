
const stopwatch = document.querySelector(".stopwatch");
const overlay = document.querySelector(".overlay");

const heroWrapper = document.getElementById("heroWrapper");
const newYearText = document.getElementById("newYearText");
const music = document.getElementById("bgMusic");

const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");





function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener("resize", resizeCanvas);


let countdownSeconds = 5; 
let stopwatchDone = false;

function startCountdown() {
  const interval = setInterval(() => {
    countdownSeconds--;

    if (countdownSeconds <= 0) {
      clearInterval(interval);
      stopwatchDone = true;
      revealCelebration();
    }
  }, 1000);
}


function drawStopwatchCircle(x, y, r) {
  ctx.save();

 
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI * 2);
  ctx.fillStyle = "#10141a"; 
  ctx.fill();

  
  const grad = ctx.createRadialGradient(x, y, r * 0.1, x, y, r * 0.9);
  grad.addColorStop(0, "#e8fbff");  
  grad.addColorStop(1, "#0f3b4b"); 
  ctx.beginPath();
  ctx.arc(x, y, r * 0.86, 0, Math.PI * 2);
  ctx.fillStyle = grad;
  ctx.fill();

  ctx.restore();
}

function drawStopwatchMarks(x, y, r) {
  ctx.save();
  ctx.translate(x, y);
  ctx.strokeStyle = "rgba(9, 16, 24, 0.9)"; 
  ctx.fillStyle = "rgba(9, 16, 24, 0.9)";
  ctx.lineWidth = 2;
  ctx.font = "16px system-ui";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";

  const bigRadius = r * 0.78;
  const smallRadius = r * 0.82;

  for (let i = 0; i < 60; i++) {
    const angle = (Math.PI * 2 * i) / 60 - Math.PI / 2;
    const isBig = i % 5 === 0;
    const inner = isBig ? bigRadius : r * 0.8;
    const outer = smallRadius;

    const x1 = Math.cos(angle) * inner;
    const y1 = Math.sin(angle) * inner;
    const x2 = Math.cos(angle) * outer;
    const y2 = Math.sin(angle) * outer;

    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.lineWidth = isBig ? 2 : 1;
    ctx.stroke();

    if (i % 10 === 0) {
      const numRadius = r * 0.64;
      const nx = Math.cos(angle) * numRadius;
      const ny = Math.sin(angle) * numRadius;
      const label = (i === 0 ? "60" : i).toString();
      ctx.fillText(label, nx, ny);
    }
  }

  ctx.restore();
}

function drawStopwatchHead(x, y, r) {
  ctx.save();
  const headWidth = r * 0.5;
  const headHeight = r * 0.22;
  const stemHeight = r * 0.22;

  ctx.fillStyle = "#10141a";

 
  ctx.fillRect(
    x - headWidth * 0.2,
    y - r - stemHeight,
    headWidth * 0.4,
    stemHeight
  );

  
  const topY = y - r - stemHeight - headHeight;
  if (ctx.roundRect) {
    ctx.beginPath();
    ctx.roundRect(
      x - headWidth / 2,
      topY,
      headWidth,
      headHeight,
      headHeight * 0.4
    );
    ctx.fill();
  } else {
    ctx.fillRect(
      x - headWidth / 2,
      topY,
      headWidth,
      headHeight
    );
  }

  ctx.restore();
}

function drawCountdown() {
  if (stopwatchDone) return;

  const cx = canvas.width / 2;
  const cy = canvas.height / 2;
  const radius = Math.min(canvas.width, canvas.height) * 0.18;

  drawStopwatchCircle(cx, cy, radius);
  drawStopwatchMarks(cx, cy, radius);
  drawStopwatchHead(cx, cy, radius);

  
  ctx.save();
  ctx.font = "bold 52px system-ui";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillStyle = "#40E0D0"; 
  const display = countdownSeconds > 0 ? countdownSeconds : 0;
  ctx.fillText(display, cx, cy + radius * 0.06);
  ctx.restore();
}


function revealCelebration() {
  if (stopwatch) stopwatch.style.display = "none";

  overlay.style.background =
    "radial-gradient(circle at center, rgba(255,215,0,0.22), #020409)";

  heroWrapper.style.display = "grid";
  heroWrapper.style.opacity = "1";
  heroWrapper.style.zIndex = "5";

  newYearText.style.opacity = "1";
  newYearText.style.transform = "scale(1)";
  burst(canvas.width / 2, canvas.height / 3);
burst(canvas.width / 3, canvas.height / 4);
burst(canvas.width * 0.7, canvas.height / 4);


  requestAnimationFrame(() => {
    startMusic();
    startFireworks();
  });
}



const colors = [
  "#FFD700",
  "#FF4D4D",
  "#4D79FF",
  "#4DFF88",
  "#FF9F1C",
  "#C77DFF"
];

let particles = [];

function burst(x, y) {
  for (let i = 0; i < 90; i++) {
    particles.push({
      x,
      y,
      angle: Math.random() * Math.PI * 2,
      speed: Math.random() * 4 + 2,
      radius: Math.random() * 2 + 1,
      life: 110,
      color: colors[Math.floor(Math.random() * colors.length)]
    });
  }
}

function startFireworks() {
  burst(canvas.width / 2, canvas.height / 3);

  setInterval(() => {
    burst(
      Math.random() * canvas.width,
      Math.random() * canvas.height * 0.5
    );
  }, 1200);

  
}







function animate() {
  ctx.fillStyle = "#230046";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  
  if (!stopwatchDone) {
    drawCountdown();
  }

  particles.forEach((p, i) => {
    p.x += Math.cos(p.angle) * p.speed;
    p.y += Math.sin(p.angle) * p.speed;
    p.life--;

    ctx.beginPath();
    ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
    ctx.fillStyle = p.color;
    ctx.fill();

    if (p.life <= 0) particles.splice(i, 1);
  });

  requestAnimationFrame(animate);
  
}


animate();
startCountdown();
