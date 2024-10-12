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
  //craete main
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
    inputscontainer.appendChild(tryDiv);
  }
  inputscontainer.children[0].children[1].focus();

  // Disable All Inputs Expect Frist One
  const inputsInDisabledDiv = document.querySelectorAll(".disabled-inputs input");
  inputsInDisabledDiv.forEach((input) => {
    input.disabled = true;
  });

  const inputs = document.querySelectorAll("input");

  inputs.forEach((input, index) => {
    // convert Input To UpperCase
    input.addEventListener("input", function () {
      this.value = this.value.toUpperCase();
      // console.log(index);
      const nextInput = inputs[index + 1];
      if (nextInput) nextInput.focus();
    });

    input.addEventListener("keydown", function (event) {
      // console.log(event)
      const currentIndex = Array.from(inputs).indexOf(event.target);
      // console.log(currentIndex)
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

const guessButton = document.querySelector(".check");
guessButton.addEventListener("click", handleGuesses);

console.log(wordToGuess);

function handleGuesses() {
  let successGuess = true;
  // console.log(wordToGuess);
  for (let i = 1; i <= numbersOfLetters; i++) {
    const inputField = document.querySelector(`#guess-${currentTry}-letter-${i}`);
    const letter = inputField.value.toLowerCase();
    // console.log(letter);
    const actualLetter = wordToGuess[i - 1];

    // Game Logic
    if (letter === actualLetter) {
      //Letter IS Correct And In Place
      inputField.classList.add("yes-in-place");
    } else if (wordToGuess.includes(letter) && letter !== "") {
      //lETTER iS cORRECT aND nOT iN pLACE
      inputField.classList.add("not-in-place");
      successGuess = false;
    } else {
      inputField.classList.add("no");
      successGuess = false;
    }
  }
  // CheckIf Win Or Lose
  if (successGuess) {
    messageArea.innerHTML = `You Win <span>${wordToGuess}</span>`;
    //Win
    if (numbersOfHints === 2) {
      messageArea.innerHTML = `<p>Congrtz You Didn't Use Hints</p>`;
    }
    // Add Desabled Class To All Input
    let allTries = document.querySelectorAll(".inputs > div");
    allTries.forEach((tryDiv) => tryDiv.classList.add("disabled-inputs"));
    // Disable Guess Button
    guessButton.disabled = true;
    getHintButton.disabled = true;
  }
  // Lose
  else {
    // Disable The Currunt Try
    document.querySelector(`.try-${currentTry}`).classList.add("disabled-inputs");
    const currntTryInputs = document.querySelectorAll(`.try-${currentTry} input`);
    currntTryInputs.forEach((input) => (input.disabled = true));

    currentTry++;

    // Able The next Try
    const nextTryInputs = document.querySelectorAll(`.try-${currentTry} input`);
    nextTryInputs.forEach((input) => (input.disabled = false));

    let el = document.querySelector(`.try-${currentTry}`);
    if (el) {
      document.querySelector(`.try-${currentTry}`).classList.remove("disabled-inputs");
      el.children[1].focus();
    } else {
      guessButton.disabled = true;
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
  // console.log(enabledInput)
  const emptyEnabledInputs = Array.from(enabledInput).filter((input) => input.value === "");
  // console.log(emptyEnabledInputs);

  if (emptyEnabledInputs.length > 0) {
    const randomIndex = Math.floor(Math.random() * emptyEnabledInputs.length);
    const randomInput = emptyEnabledInputs[randomIndex];
    const idexToFill = Array.from(enabledInput).indexOf(randomInput);
    // console.log(randomIndex);
    // console.log(randomInput);
    // console.log(idexToFill);
    if (idexToFill !== -1) {
      randomInput.value = wordToGuess[idexToFill].toUpperCase();
    }
    // wordToGuess[randomInput];
  }
}

function handleBackspace(event) {
  if (event.key === "Backspace") {
    const inputs = document.querySelectorAll("input:not([disabled])");
    const currentIndex = Array.from(inputs).indexOf(document.activeElement);
    // console.log(currentIndex);
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

window.onload = function () {
  genrateInput();
};
