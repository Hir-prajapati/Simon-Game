let gameSeq = [];
let userSeq = [];
let colors = ["red", "yellow", "green", "purple"];
let level = 0;
let started = false;
let highScore = localStorage.getItem("highScore") || 0;
let acceptingInput = false;

const currentScoreEl = document.getElementById("current-score");
const highScoreEl = document.getElementById("high-score");
highScoreEl.innerText = `High Score: ${highScore}`;
const h2 = document.querySelector("h2");
const logo = document.querySelector(".center-logo"); // target the logo div

// Sound effects
const soundMap = {
  red: new Audio("https://s3.amazonaws.com/freecodecamp/simonSound1.mp3"),
  yellow: new Audio("https://s3.amazonaws.com/freecodecamp/simonSound2.mp3"),
  green: new Audio("https://s3.amazonaws.com/freecodecamp/simonSound3.mp3"),
  purple: new Audio("https://s3.amazonaws.com/freecodecamp/simonSound4.mp3")
};

// Start game on keypress or center logo click
document.addEventListener("keypress", startGame);
logo.addEventListener("click", startGame);

function startGame() {
  if (!started) {
    started = true;
    nextSequence();
  }
}

function nextSequence() {
  userSeq = [];
  level++;
  h2.innerText = `Level ${level}`;
  currentScoreEl.innerText = `Score: ${level}`;

  const randomColor = colors[Math.floor(Math.random() * 4)];
  gameSeq.push(randomColor);

  acceptingInput = false;
  playSequence();
}
function playSequence() {
  acceptingInput = false;
  let i = 0;

  function showStep() {
    const color = gameSeq[i];
    const btn = document.getElementById(color);
    playSound(color);
    flashButton(btn);
    
    i++;
    if (i < gameSeq.length) {
      setTimeout(showStep, 800); // wait before flashing next button
    } else {
      // Re-enable user input after short delay
      setTimeout(() => {
        acceptingInput = true;
      }, 500);
    }
  }

  showStep(); // start showing the sequence
}

function flashButton(btn) {
  btn.classList.remove("flash"); // Reset if already active
  void btn.offsetWidth; // Force reflow (important on mobile)
  btn.classList.add("flash");
  setTimeout(() => btn.classList.remove("flash"), 300);
}


function playSound(color) {
  soundMap[color].currentTime = 0;
  soundMap[color].play();
}

function handleUserClick() {
  if (!acceptingInput) return;

  const color = this.id;
  userSeq.push(color);
  playSound(color);
  flashButton(this);

  checkAnswer(userSeq.length - 1);
}

function checkAnswer(currentIndex) {
  if (userSeq[currentIndex] === gameSeq[currentIndex]) {
    if (userSeq.length === gameSeq.length) {
      acceptingInput = false;
      setTimeout(nextSequence, 1000);
    }
  } else {
    document.body.classList.add("game-over");
    h2.innerHTML = `Game Over! Score: <b>${level}</b><br>Click the simon button or press any key to restart.`;

    setTimeout(() => document.body.classList.remove("game-over"), 300);

    if (level > highScore) {
      localStorage.setItem("highScore", level);
      highScoreEl.innerText = `High Score: ${level}`;
    }

    resetGame();
  }
}

function resetGame() {
  level = 0;
  gameSeq = [];
  userSeq = [];
  started = false;
  acceptingInput = false;
  currentScoreEl.innerText = "Score: 0";
}

document.querySelectorAll(".btn").forEach(btn => {
  btn.addEventListener("click", handleUserClick);
});
