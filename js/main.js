const word = document.getElementById("word");
const text = document.getElementById("text");
const scoreEl = document.getElementById("score");
const timeEl = document.getElementById("time");
const endgameEl = document.getElementById("end-game-container");
const settingsBtn = document.getElementById("settings-btn");
const settings = document.getElementById("settings");
const settingsForm = document.getElementById("settings-form");
const difficultySelect = document.getElementById("difficulty");

// List of words for game
const words = [
  "sigh",
  "tense",
  "airplane",
  "ball",
  "pies",
  "juice",
  "warlike",
  "bad",
  "north",
  "dependent",
  "steer",
  "silver",
  "highfalutin",
  "superficial",
  "quince",
  "eight",
  "feeble",
  "admit",
  "drag",
  "loving",
];

// Init word
let randomWord;

// Hard word
let hardWords = [];
console.log(hardWords);

// Init score
let score = 0;

// Init time
let time = 10;

// Difficulty
let difficulty =
  localStorage.getItem("difficulty") !== null
    ? localStorage.getItem("difficulty")
    : "medium";

// Set difficulty select value
difficultySelect.value =
  localStorage.getItem("difficulty") !== null
    ? localStorage.getItem("difficulty")
    : "medium";

text.focus();

async function getHardWord() {
  const res = await fetch(`https://random-words-api.vercel.app/word`);
  // console.log(res);
  const data = await res.json();
  console.log(data[0]);
  const hardWord = data[0].word.toLowerCase();
  if (!isValid(hardWord)) {
    // console.log("Invalid Word");
    getHardWord();
  }
  // def.push(data[0].definition);
  hardWords.push(hardWord);
  word.innerHTML = hardWord;

  console.log(hardWord);
  // displayWord();
}

function isValid(str) {
  return !/[~`!#$%\^&*+=\-\[\]\\';,/{}|\\":<>\?]/g.test(str);
}

// Start counting down
const timeInterval = setInterval(updateTime, 1000);

// Update time left
function updateTime() {
  time--;
  timeEl.innerHTML = time + "s";

  if (time === 0) {
    clearInterval(timeInterval);
    // End game
    gameOver();
  }
}

// Game over
function gameOver() {
  endgameEl.innerHTML = `
    <h1>Time ran out</h1>
    <p>Your final score is ${score}</p>
    <button onclick="location.reload()">Reload</button>
  `;

  endgameEl.style.display = "flex";
}

// Get random word
function getRandomWord() {
  return words[Math.floor(Math.random() * words.length)];
}

// Add word to DOM
function addWordToDOM() {
  randomWord = getRandomWord();
  word.innerHTML = randomWord;
}

// Update score
function updateScore() {
  score++;
  scoreEl.innerHTML = score;
}

checkDificulty();

function checkDificulty() {
  if (difficulty === "hard") {
    getHardWord();
  } else {
    addWordToDOM();
  }
}

// Event listeners
text.addEventListener("input", (e) => {
  const insertedText = e.target.value;
  if (insertedText === randomWord || insertedText === hardWords[0]) {
    if (difficulty === "hard") {
      hardWords = [];
      getHardWord();
    } else {
      addWordToDOM();
    }
    updateScore();

    // Clear value
    e.target.value = "";

    if (difficulty === "hard") {
      time += 2;
    } else if (difficulty === "medium") {
      time += 3;
    } else {
      time += 5;
    }
    updateTime();
  }
});

// Settings button click
settingsBtn.addEventListener("click", () => {
  settings.classList.toggle("hide");
});

// Settings selected value
settingsForm.addEventListener("change", (e) => {
  difficulty = e.target.value;
  localStorage.setItem("difficulty", difficulty);
  checkDificulty();
});
