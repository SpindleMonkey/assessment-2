
//console.log("ready. set. go.");

const keyA = 97;
const keyL = 108;

let winner = null;
const crown = '5px dotted #c94c4c';

let racerOneStart = 0;
const racerOneEnd = 600;

let racerTwoStart = 0;
const racerTwoEnd = 600;

/**
 * grab hold of the 2 racers and position them at the 
 * starting line
 */
let racerOne = document.getElementById('racer1');
racerOne.style.left = racerOneStart + 'px';

let racerTwo = document.getElementById('racer2');
racerTwo.style.left = racerTwoStart + 'px';

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
        racerOneStart += addRandom();
        racerOne.style.left = racerOneStart + 'px';
        if (racerOneStart >= racerOneEnd) {
          // end of race!
          racerOne.style.border = crown;
          winner = keyA;
        }
        break;
      }

      case keyL: {
        // 'l' = the racer on the right side
        racerTwoStart += addRandom();
        racerTwo.style.left = racerTwoStart + 'px';
        if (racerTwoStart >= racerTwoEnd) {
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

window.addEventListener('keypress', moveRacer);

let checkInterval = null;
function lookForWinner() {
  if (winner) {
    window.clearInterval(checkInterval);
    window.removeEventListener('keypress', moveRacer);
    console.log("we have a winer: " + winner);
  } 
}
checkInterval = setInterval(lookForWinner, 500);
