
//console.log("ready. set. go.");

const keyA = 97;
const keyL = 108;

let winner = null;
const crown = '5px dotted #c94c4c';

let racerOnePosition;
let racerTwoPosition;
const raceEnd = 600;


// grab hold of the 2 racers 
let racerOne = document.getElementById('racer1');
let racerTwo = document.getElementById('racer2');

// grab the scorebaord cells we care about (the wins and losses)
let wWins = document.getElementById('whiteWins');
let wLosses = document.getElementById('whiteLosses');
let wAWM = document.getElementById('whiteAWM');
let bWins = document.getElementById('blackWins');
let bLosses = document.getElementById('blackLosses');
let bAWM = document.getElementById('blackAWM');

// grab the replay button, while we're at it
let replayButton = document.getElementById('replay');

/**
 * Set up the race and scoreboard
 */
function startRace() {
  // position the 2 racres at the starting line
  racerOnePosition = 0;
  racerTwoPosition = 0;

  racerOne.style.left = racerOnePosition + 'px';
  racerTwo.style.left = racerTwoPosition + 'px';

  // init localStorage, if this is the first race ever
  if (localStorage.whiteWins === undefined) {
    // we've got stats in localStorage, so use them
    localStorage.whiteWins = 0;
    localStorage.whiteLosses = 0;
    localStorage.whiteAWM = 0;
    localStorage.blackWins = 0;
    localStorage.blackLosses = 0;
    localStorage.blackAWM = 0;
  }

  // init the scoreboard
  wWins.textContent = localStorage.whiteWins;
  wLosses.textContent = localStorage.whiteLosses;
  wAWM.textContent = localStorage.whiteAWM;
  bWins.textContent = localStorage.blackWins;
  bLosses.textContent = localStorage.blackLosses;
  bAWM.textContent = localStorage.blackAWM;

  // hide the replay button
  replayButton.style.visibility = 'hidden';
}

/**
 * Rather than move each racer 1 step at a time, move
 * each racer a random number of steps at a time!
 */
const min = Math.ceil(5);
const max = Math.floor(19);
function addRandom() {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * Keep track of wins and losses for both racers
 */
function updateStats(winner) {
  /**
   * winner will be the keycode associated with the white horse (keyA) or the black horse (keyL)
   * -- update localStorage
   * -- update the scoreboard
   * -- update the winner's AWM (Average Win Margin)
   */ 

  let newMargin;
  let wins;
  let awm;

  if (winner === keyA) {
    newMargin = raceEnd - racerTwoPosition;

    if (Number(localStorage.whiteWins) > 0) {
      wins = Number(localStorage.whiteWins);
      awm = Number(localStorage.whiteAWM);
      console.log("n: " + newMargin + " w: " + wins + " a: " + awm);
      console.log((awm * wins) + " " + (wins + 1));
      localStorage.whiteAWM = Math.round(((awm * wins) + newMargin) / (wins + 1));
    } else {
      localStorage.whiteAWM = newMargin;
    }

    localStorage.whiteWins = Number(localStorage.whiteWins) + 1;
    localStorage.blackLosses = Number(localStorage.blackLosses) + 1;
    wWins.textContent = Number(localStorage.whiteWins);
    bLosses.textContent = Number(localStorage.blackLosses);
    wAWM.textContent = Number(localStorage.whiteAWM);
  } else {
    newMargin = raceEnd - racerOnePosition;

    if (Number(localStorage.blackWins) > 0) {
      wins = Number(localStorage.blackWins);
      awm = Number(localStorage.blackAWM);
      console.log("n: " + newMargin + " w: " + wins + " a: " + awm);
      console.log((awm * wins) + " " + (wins + 1));
      localStorage.blackAWM = Math.round(((awm * wins) + newMargin) / (wins + 1));
    } else {
      localStorage.blackAWM = newMargin;
    }

    localStorage.blackWins = Number(localStorage.blackWins) + 1;
    localStorage.whiteLosses = Number(localStorage.whiteLosses)  + 1;
    bWins.textContent = Number(localStorage.blackWins);
    wLosses.textContent = Number(localStorage.whiteLosses);
    bAWM.textContent = Number(localStorage.blackAWM);
  }

  //console.log(newMargin);
}

/**
 * add a listener to the entire window that looks
 * for all key presses, even though we only care about
 * 2 keys:
 *   'a': moves the left-side racer forward
 *   'l': moves the right-side racer forward
 * And to add a little uncertainty to the race,
 * each move will move a random distance (see addRandom())
 */
function moveRacer(theKey) {
  //console.log(theKey);
  if (!winner) {
    switch(theKey.keyCode) {
      case keyA: {
       // 'a' = the racer on the left side
        racerOnePosition += addRandom();
        racerOne.style.left = racerOnePosition + 'px';
        if (racerOnePosition >= raceEnd) {
          // end of race!
          racerOne.style.border = crown;
          winner = keyA;
        }
        break;
      }

      case keyL: {
        // 'l' = the racer on the right side
        racerTwoPosition += addRandom();
        racerTwo.style.left = racerTwoPosition + 'px';
        if (racerTwoPosition >= raceEnd) {
          // end of race!
          racerTwo.style.border = crown;
          winner = keyL;
        }
        break;
      }

      default: {
        //console.log("hysterical fat finger!");
      }
    }
  }
}

let checkInterval = null;
function lookForWinner() {
  if (winner) {
    window.clearInterval(checkInterval);
    window.removeEventListener('keypress', moveRacer);
    updateStats(winner);

    // show the replay button
    replayButton.style.visibility = 'visible';

    //console.log("we have a winner: " + winner);
  } 
}

startRace();
window.addEventListener('keypress', moveRacer);
checkInterval = setInterval(lookForWinner, 500);
