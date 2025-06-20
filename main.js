//Setting Game Name
let gameName = "Gess The Word";
document.title = gameName;
document.querySelector("h1").innerHTML = gameName;
document.querySelector("footer").innerHTML = `${gameName} Game Created By M9stafa`;

// Setting Game Options
let numbersOfTries = 6;
let numbersOfLetters = 6;
let currentTry = 1;
let numbersOfHints = 2;

// Mange Wordes
let wordToGuess = "";
const words = ["Create", "Update", "Delete", "Master", "Branch", "Mainly", "Elzero", "School"];
wordToGuess = words[Math.floor(Math.random() * words.length)].toLowerCase();
let messageArea = document.querySelector(".message");

// Mange Hints
document.querySelector(".hint span").innerHTML = numbersOfHints;
const getHintButton = document.querySelector(".hint");
getHintButton.addEventListener("click", getHint);

function genrateInput() {
  const inputscontainer = document.querySelector(".inputs");
  for (let i = 1; i < numbersOfTries; i++) {
    const tryDiv = document.createElement("div");
    tryDiv.classList.add(`try-${i}`);
    tryDiv.innerHTML = `<span>Try ${i}<span>`;

    if (i !== 1) {
      tryDiv.classList.add("disabled-inputs");
    }
    // create inputs
    for (let j = 1; j <= numbersOfLetters; j++) {
      const input = document.createElement("input");
      input.type = "text";
      input.id = `guess-${i}-letter-${j}`;
      input.setAttribute("maxlength", "1");
      tryDiv.appendChild(input);
    }
    // Create a check button for this try
    const checkBtn = document.createElement("button");
    checkBtn.className = "check";
    checkBtn.textContent = "Check Word";
    if (i !== 1) checkBtn.disabled = true;
    checkBtn.addEventListener("click", function () {
      handleGuesses(i, checkBtn);
    });
    tryDiv.appendChild(checkBtn);
    inputscontainer.appendChild(tryDiv);
  }
  inputscontainer.children[0].children[1].focus();

  // Disable All Inputs Except First One
  const inputsInDisabledDiv = document.querySelectorAll(".disabled-inputs input");
  inputsInDisabledDiv.forEach((input) => {
    input.disabled = true;
  });

  const inputs = document.querySelectorAll("input");
  inputs.forEach((input, index) => {
    input.addEventListener("input", function () {
      this.value = this.value.toUpperCase();
      const nextInput = inputs[index + 1];
      if (nextInput) nextInput.focus();
    });
    input.addEventListener("keydown", function (event) {
      const currentIndex = Array.from(inputs).indexOf(event.target);
      if (event.key === "ArrowRight") {
        const nextInput = currentIndex + 1;
        if (nextInput < inputs.length) {
          inputs[nextInput].focus();
        }
      }
      if (event.key === "ArrowLeft") {
        const previseInput = currentIndex - 1;
        if (previseInput >= 0) {
          inputs[previseInput].focus();
        }
      }
    });
  });
}

function handleGuesses(tryNumber, checkBtn) {
  let successGuess = true;
  for (let i = 1; i <= numbersOfLetters; i++) {
    const inputField = document.querySelector(`#guess-${tryNumber}-letter-${i}`);
    const letter = inputField.value.toLowerCase();
    const actualLetter = wordToGuess[i - 1];
    if (letter === actualLetter) {
      inputField.classList.add("yes-in-place");
    } else if (wordToGuess.includes(letter) && letter !== "") {
      inputField.classList.add("not-in-place");
      successGuess = false;
    } else {
      inputField.classList.add("no");
      successGuess = false;
    }
  }
  if (successGuess) {
    messageArea.innerHTML = `You Win <span>${wordToGuess}</span>`;
    if (numbersOfHints === 2) {
      messageArea.innerHTML = `<p>Congrtz You Didn't Use Hints</p>`;
    }
    let allTries = document.querySelectorAll(".inputs > div");
    allTries.forEach((tryDiv) => tryDiv.classList.add("disabled-inputs"));
    // Disable all check buttons
    document.querySelectorAll('.check').forEach(btn => btn.disabled = true);
    getHintButton.disabled = true;
  } else {
    // Disable current try
    document.querySelector(`.try-${tryNumber}`).classList.add("disabled-inputs");
    const currntTryInputs = document.querySelectorAll(`.try-${tryNumber} input`);
    currntTryInputs.forEach((input) => (input.disabled = true));
    checkBtn.disabled = true;
    // Enable next try
    const nextTry = tryNumber + 1;
    const nextTryDiv = document.querySelector(`.try-${nextTry}`);
    if (nextTryDiv) {
      nextTryDiv.classList.remove("disabled-inputs");
      const nextInputs = nextTryDiv.querySelectorAll("input");
      nextInputs.forEach((input) => (input.disabled = false));
      // Enable the next check button
      const nextCheckBtn = nextTryDiv.querySelector('.check');
      if (nextCheckBtn) nextCheckBtn.disabled = false;
      nextInputs[0].focus();
    } else {
      // No more tries
      document.querySelectorAll('.check').forEach(btn => btn.disabled = true);
      getHintButton.disabled = true;
      messageArea.innerHTML = `You Lose <span>${wordToGuess}</span>`;
    }
  }
}

function getHint() {
  if (numbersOfHints > 0) {
    numbersOfHints--;
    document.querySelector(".hint span").innerHTML = numbersOfHints;
  }
  if (numbersOfHints === 0) {
    getHintButton.disabled = true;
  }
  const enabledInput = document.querySelectorAll("input:not([disabled])");
  const emptyEnabledInputs = Array.from(enabledInput).filter((input) => input.value === "");

  if (emptyEnabledInputs.length > 0) {
    const randomIndex = Math.floor(Math.random() * emptyEnabledInputs.length);
    const randomInput = emptyEnabledInputs[randomIndex];
    const idexToFill = Array.from(enabledInput).indexOf(randomInput);
    if (idexToFill !== -1) {
      randomInput.value = wordToGuess[idexToFill].toUpperCase();
    }
  }
}

function handleBackspace(event) {
  if (event.key === "Backspace") {
    const inputs = document.querySelectorAll("input:not([disabled])");
    const currentIndex = Array.from(inputs).indexOf(document.activeElement);
    if (currentIndex > 0) {
      const currntInput = inputs[currentIndex];
      const prevInput = inputs[currentIndex - 1];
      currntInput.value = "";
      prevInput.value = "";
      prevInput.focus();
    }
  }
}

document.addEventListener("keydown", handleBackspace);

function enableAutoScrollInputs() {
  const allInputs = document.querySelectorAll('.inputs input');
  allInputs.forEach(input => {
    input.addEventListener('focus', function () {
      if (window.innerWidth <= 600) {
        setTimeout(() => {
          input.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }, 100);
      }
    });
  });
}

window.onload = function () {
  genrateInput();
  enableAutoScrollInputs();
};
