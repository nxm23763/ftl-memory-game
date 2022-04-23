// global constants
const nextClueWaitTime = 1000; //how long to wait before starting playback of the clue sequence

//Global Variables
var clueHoldTime = 1000; //how long to hold each clue's light/sound
var cluePauseTime = 333; //how long to pause in between clues
var numStrikes = 0; //how many mistakes player has made, 3 means game over!
var pattern = shuffle([1, 2, 3, 4, 5, 6, 7, 8, 9]);
var progress = 0;
var gamePlaying = false;
var tonePlaying = false;
var volume = 0.5; //must be between 0.0 and 1.0
var guessCounter = 0;

function startGame() {
  //initialize game variables
  progress = 0;
  gamePlaying = true;
  document.getElementById("startBtn").classList.add("hidden");
  document.getElementById("stopBtn").classList.remove("hidden");
  playClueSequence();
}

function stopGame() {
  gamePlaying = false;
  clueHoldTime = 1000;
  cluePauseTime = 333;
  document.getElementById("startBtn").classList.remove("hidden");
  document.getElementById("stopBtn").classList.add("hidden");
}

function loseGame() {
  stopGame();
  alert("Almost had it :( Better luck next time~!");
}

function winGame() {
  stopGame();
  alert("You did it! Thanks for playing <3 Refresh the page to start a new game!");
}

function lightButton(btn) {
  document.getElementById("button" + btn).classList.add("lit");
  showImage(btn);
}
function clearButton(btn) {
  document.getElementById("button" + btn).classList.remove("lit");
  hideImage(btn);
}

function showImage(btn) {
  document.getElementById("button" + btn + "img").classList.remove("hidden");
}

function hideImage(btn) {
  document.getElementById("button" + btn + "img").classList.add("hidden");
}

function glowButton(btn) {
  document.getElementById("button" + btn + "img").classList.add("glow");
}

function playSingleClue(btn) {
  if (gamePlaying) {
    lightButton(btn);
    playTone(btn, clueHoldTime);
    setTimeout(clearButton, clueHoldTime, btn);
  }
}

function playClueSequence() {
  guessCounter = 0;
  context.resume();
  let delay = nextClueWaitTime; //set delay to initial wait time
  for (let i = 0; i <= progress; i++) {
    // for each clue that is revealed so far
    console.log("play single clue: " + pattern[i] + " in " + delay + "ms");
    setTimeout(playSingleClue, delay, pattern[i]); // set a timeout to play that clue
    delay += clueHoldTime;
    delay += cluePauseTime;
  }
  clueHoldTime -= 100;
  cluePauseTime -= 33;
}

function guess(btn) {
  console.log("user guessed: " + btn);
  if (!gamePlaying) {
    return;
  }

  if ((pattern[guessCounter] == btn)) {
    // Guess was correct!
    if (guessCounter == progress) {
      if (progress == pattern.length - 1) {
        winGame();
      }
      else {
        progress++;
        playClueSequence();
      }
    } else {
      guessCounter++;
    }
  }
  else {
    numStrikes++;
    var remainingGuesses = 3 - numStrikes
    if (numStrikes < 3) {
      alert("Oopsy! You have " + remainingGuesses + " more guesses! You're still on the same turn!")
    }
    if (numStrikes > 2) {
      loseGame();
    }
  }
}

function shuffle(array) {
   for (var i = array.length - 1; i > 0; i--) {
   
       // Generate random number
       var j = Math.floor(Math.random() * (i + 1));
                   
       var temp = array[i];
       array[i] = array[j];
       array[j] = temp;
   }
       
   return array;
}

// Sound Synthesis Functions
const freqMap = {
  1: 246.9,
  2: 261.6,
  3: 293.6,
  4: 329.6,
  5: 349.2,
  6: 392,
  7: 440,
  8: 493.8,
  9: 523.3
};
function playTone(btn, len) {
  o.frequency.value = freqMap[btn];
  g.gain.setTargetAtTime(volume, context.currentTime + 0.05, 0.025);
  context.resume();
  tonePlaying = true;
  setTimeout(function () {
    stopTone();
  }, len);
}
function startTone(btn) {
  if (!tonePlaying) {
    context.resume();
    o.frequency.value = freqMap[btn];
    g.gain.setTargetAtTime(volume, context.currentTime + 0.05, 0.025);
    context.resume();
    tonePlaying = true;
  }
}
function stopTone() {
  g.gain.setTargetAtTime(0, context.currentTime + 0.05, 0.025);
  tonePlaying = false;
}

// Page Initialization
// Init Sound Synthesizer
var AudioContext = window.AudioContext || window.webkitAudioContext;
var context = new AudioContext();
var o = context.createOscillator();
var g = context.createGain();
g.connect(context.destination);
g.gain.setValueAtTime(0, context.currentTime);
o.connect(g);
o.start(0);
