// Elements
const nameInputDiv = document.getElementById("nameInputDiv");
const playerNameInput = document.getElementById("playerNameInput");
const startBtn = document.getElementById("startBtn");
const nameError = document.getElementById("nameError");

const gameDiv = document.getElementById("gameDiv");
const vsText = document.getElementById("vsText");
const playerHandSpan = document.getElementById("playerHand");
const computerHandSpan = document.getElementById("computerHand");
const choicesDiv = document.getElementById("choices");
const resultText = document.getElementById("resultText");
const playAgainBtn = document.getElementById("playAgainBtn");

const dashboardDiv = document.getElementById("dashboardDiv");
const dashboardText = document.getElementById("dashboardText");
const dashboardList = document.getElementById("dashboardList");
const playAgainBtnDashboard = document.getElementById("playAgainBtnDashboard");

const choices = ["rock", "paper", "scissors"];
const emojiMap = { rock: "✊", paper: "✋", scissors: "✌️" };

let playerName = "";
let winCount = 0;

// Store wins by player name
const playerWins = {};

// Sounds
const startSound = new Audio("sounds/start.mp3");
const winSound = new Audio("sounds/win.mp3");
const failSound = new Audio("sounds/fail.mp3");
const drawSound = new Audio("sounds/draw.mp3");

function isValidName(name) {
  return /^[A-Za-z]+$/.test(name);
}

window.onload = () => {
  showNameInput();
};

playerNameInput.addEventListener("input", () => {
  const name = playerNameInput.value.trim();
  startBtn.disabled = !isValidName(name);
});

startBtn.addEventListener("click", () => {
  const name = playerNameInput.value.trim();

  if (!name) {
    nameError.textContent = "Please enter your name.";
    return;
  }

  if (!isValidName(name)) {
    nameError.textContent = "Name must contain only alphabets.";
    return;
  }

  nameError.textContent = "";
  playerName = name;

  if (!(playerName in playerWins)) {
    playerWins[playerName] = 0;
  }
  winCount = playerWins[playerName];

  playSound(startSound);
  showGameScreen();
});

function showNameInput() {
  nameInputDiv.classList.remove("hidden");
  gameDiv.classList.add("hidden");
  dashboardDiv.classList.add("hidden");
  startBtn.disabled = true;
  playerNameInput.value = "";
  nameError.textContent = "";
  playerNameInput.focus();
  document.body.className = "";
}

function showGameScreen() {
  nameInputDiv.classList.add("hidden");
  dashboardDiv.classList.add("hidden");

  gameDiv.classList.remove("hidden");
  vsText.textContent = `${playerName} vs Computer`;

  playerHandSpan.textContent = emojiMap.rock;
  computerHandSpan.textContent = emojiMap.rock;
  resultText.textContent = "";
  playAgainBtn.classList.add("hidden");
  document.body.className = "";

  toggleChoices(true);
}

choicesDiv.addEventListener("click", (e) => {
  if (!e.target.classList.contains("choiceBtn")) return;

  const playerChoice = e.target.getAttribute("data-choice");
  const computerChoice = choices[Math.floor(Math.random() * choices.length)];

  playerHandSpan.textContent = emojiMap.rock;
  computerHandSpan.textContent = emojiMap.rock;
  resultText.textContent = "JO-KEN-PO!";
  document.body.className = "";

  playerHandSpan.style.animation = "handShake 2s ease-in-out";
  computerHandSpan.style.animation = "handShake 2s ease-in-out";

  toggleChoices(false);

  setTimeout(() => {
    playerHandSpan.style.animation = "";
    computerHandSpan.style.animation = "";

    playerHandSpan.textContent = emojiMap[playerChoice];
    computerHandSpan.textContent = emojiMap[computerChoice];

    const result = getResult(playerChoice, computerChoice);

    if (result === "win") {
      resultText.textContent = `You Win! 🎉`;
      document.body.className = "win";
      winCount++;
      playerWins[playerName] = winCount;
      playSound(winSound);
    } else if (result === "fail") {
      resultText.textContent = `You Lose! 😢`;
      document.body.className = "fail";
      playSound(failSound);
    } else {
      resultText.textContent = `It's a Draw! 😐`;
      document.body.className = "draw";
      playSound(drawSound);
    }

    playAgainBtn.classList.remove("hidden");
  }, 2100);
});

playAgainBtn.addEventListener("click", () => {
  showDashboard();
});

playAgainBtnDashboard.addEventListener("click", () => {
  showNameInput();
});

function toggleChoices(enable) {
  const buttons = choicesDiv.querySelectorAll("button");
  buttons.forEach((btn) => {
    btn.disabled = !enable;
  });
}

function getResult(player, computer) {
  if (player === computer) return "draw";

  if (
    (player === "rock" && computer === "scissors") ||
    (player === "paper" && computer === "rock") ||
    (player === "scissors" && computer === "paper")
  ) {
    return "win";
  }
  return "fail";
}

function showDashboard() {
  gameDiv.classList.add("hidden");
  nameInputDiv.classList.add("hidden");
  dashboardDiv.classList.remove("hidden");

  dashboardText.textContent = `${playerName}, your wins: ${winCount}`;

  dashboardList.innerHTML = "";
  for (const [name, wins] of Object.entries(playerWins)) {
    const li = document.createElement("li");
    li.textContent = `${name}: ${wins} win${wins !== 1 ? "s" : ""}`;
    dashboardList.appendChild(li);
  }
}

function playSound(sound) {
  sound.pause();
  sound.currentTime = 0;
  sound.play();
}
