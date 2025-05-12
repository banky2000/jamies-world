const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const rugbyBall = new Image();
rugbyBall.src = "images/jamie-rugby-ball.png";

const startBtn = document.getElementById("startButton");
const playerNameInput = document.getElementById("playerName");
const scoresList = document.getElementById("scoresList");

let playerName = "";
let gameStarted = false;

// GAME VARIABLES
let birdX = 50;
let birdY = 150;
let birdWidth = 40;
let birdHeight = 30;
let gravity = 0.6;
let lift = -10;
let velocity = 0;

let score = 0;
let pipes = [];
let pipeGap = 120;
let frame = 0;

// EVENT LISTENERS
document.addEventListener("keydown", function (e) {
  if (e.code === "Space" && gameStarted) {
    velocity = lift;
  }
});
canvas.addEventListener("touchstart", function () {
  if (gameStarted) velocity = lift;
});

startBtn.addEventListener("click", () => {
  playerName = playerNameInput.value.toUpperCase().slice(0, 4);
  if (!playerName || playerName.length < 1) {
    alert("Enter a name (max 4 characters)");
    return;
  }

  // Reset game state
  birdY = 150;
  velocity = 0;
  pipes = [];
  score = 0;
  frame = 0;

  gameStarted = true;
  startBtn.style.display = "none";
  playerNameInput.style.display = "none";
  canvas.style.display = "block";

  draw();
});

// GAME LOOP
function draw() {
  if (!gameStarted) return;

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawPipes();

  ctx.drawImage(rugbyBall, birdX, birdY, birdWidth, birdHeight);

  velocity += gravity;
  birdY += velocity;

  if (birdY + birdHeight > canvas.height) {
    birdY = canvas.height - birdHeight;
    velocity = 0;
    endGame();
    return;
  }
  if (birdY < 0) {
    birdY = 0;
    velocity = 0;
  }

  ctx.fillStyle = "white";
  ctx.font = "16px Arial";
  ctx.fillText("Score: " + score, 10, 30);

  frame++;
  requestAnimationFrame(draw);
}

// PIPE LOGIC (goalposts + top bar)
let pipeWidth = 6;

function drawPipes() {
  if (frame % 100 === 0) {
    let postHeight = Math.floor(Math.random() * 150) + 200;
    pipes.push({
      x: canvas.width,
      height: postHeight,
      passed: false
    });
  }

  pipes.forEach((pipe, index) => {
    pipe.x -= 2;

    ctx.fillStyle = "white";

    // Bottom posts
    ctx.fillRect(pipe.x, canvas.height - pipe.height, pipeWidth, pipe.height);
    ctx.fillRect(pipe.x + 20, canvas.height - pipe.height, pipeWidth, pipe.height);

    // Top bar
    const topBarHeight = 15;
    ctx.fillRect(pipe.x, 0, 26, topBarHeight);

    // Collisions
    const hitsTop = birdY < topBarHeight && birdX + birdWidth > pipe.x && birdX < pipe.x + 26;
    const hitsLeft = birdX + birdWidth > pipe.x && birdX < pipe.x + pipeWidth && birdY + birdHeight > canvas.height - pipe.height;
    const hitsRight = birdX + birdWidth > pipe.x + 20 && birdX < pipe.x + 20 + pipeWidth && birdY + birdHeight > canvas.height - pipe.height;

    if (hitsTop || hitsLeft || hitsRight) {
      endGame();
      return;
    }

    // Scoring
    if (!pipe.passed && pipe.x + 26 < birdX) {
      score++;
      pipe.passed = true;
    }

    if (pipe.x + 30 < 0) {
      pipes.splice(index, 1);
    }
  });
}

// GAME OVER
function endGame() {
  gameStarted = false;
  canvas.style.display = "none";
  startBtn.style.display = "inline-block";
  playerNameInput.style.display = "inline-block";

  addToScoreboard(playerName, score);
}

// SCOREBOARD
function addToScoreboard(name, score) {
  let scores = JSON.parse(localStorage.getItem("penaltyKickScores")) || [];

  // Add new score
  scores.push({ name, score });

  // Sort from highest to lowest
  scores.sort((a, b) => b.score - a.score);

  // Save to localStorage
  localStorage.setItem("penaltyKickScores", JSON.stringify(scores));

  // Update the list on screen
  displayScores();
}

function displayScores() {
  scoresList.innerHTML = ""; // clear previous list

  const scores = JSON.parse(localStorage.getItem("penaltyKickScores")) || [];

  scores.forEach(entry => {
    const li = document.createElement("li");
    li.textContent = `${entry.name}: ${entry.score}`;
    scoresList.appendChild(li);
  });
}

displayScores();
