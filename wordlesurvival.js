// 0. Read in text file with all possible words
// 1. Display all unused, green, yellow, black letters
// 1a. Display total correct words, how many incorrect guesses
// 2. Take in guess, determine if its correct, distribute letters
// 3. If correct, generate new word, regenerate colors
// 4. If incorrect, add to incorrect guesses, check if game is over

const { ALL } = require('dns');
const prompt = require("prompt-sync")();
const fs = require('fs');
let ALL_WORDS = [];
let WORDLE_ANSWERS = [];
let GUESSES = [];
let numCorrect = 0;
let numIncorrect = 0;

let CUR_STATUS = {
    "a": 'U', "b": 'U', "c": 'U',"d": 'U',"e": 'U',"f": 'U',"g": 'U',"h": 'U',"i": 'U',"j": 'U',"k": 'U',"l": 'U',"m": 'U',"n": 'U',"o": 'U',"p": 'U',"q": 'U',"r": 'U',"s": 'U',"t": 'U',"u": 'U',"v": 'U',"w": 'U',"x": 'U',"y": 'U',"z": 'U'
};

const resetStatusKeys = () => {
    for (const key in CUR_STATUS){
        CUR_STATUS[key] = "U";
    }
}

const printStatus = () => {
    getKeysWithSameValue('U');
    getKeysWithSameValue('N');
    getKeysWithSameValue("G");
    getKeysWithSameValue('Y');

}

const getKeysWithSameValue = (c) => {
    const keys = [];

    for (const key in CUR_STATUS) {
        if (CUR_STATUS[key] === c) {
            keys.push(key);
        } 
    }
    console.log("All " + c + "'s: " + keys)
    return keys;
}
//function to load in a full dictionary. in this case, i've already extracted
//all of the 5 letter words into a txt file called fives.txt, so I use that here
function get_full_dictionary(callback) {
    fs.readFile('fives.txt', 'utf8', function(err, data) {
        if (err) {
            console.error(err);
            return callback(err, null);
        }

        ALL_WORDS = data.split(",");
        callback(null, ALL_WORDS);
    });
}
// helper function to splice out every word that isnt 5 letters long
const filter_word_length = (size, ALL_WORDS) => {
    for (let i = 0; i< ALL_WORDS.length; i++) {
        if(ALL_WORDS[i].length !== size) {
            ALL_WORDS.splice(i, 1);
            i--;
        }
    }
    return ALL_WORDS;
};
//loads in all of the wordle answers
//different from all 5 letter words; less common 5 letter words are not in this file
function get_wordle_answers_dictionary(callback) {
    fs.readFile('wordle_answers.txt', 'utf8', function(err, data) {
        if (err) {
            console.error(err);
            return callback(err, null);
        }

        WORDLE_ANSWERS = data.split("\n");
        callback(null, WORDLE_ANSWERS);
    });
}
//another helper function that prints to the txt file
const printToFives = (words) => {
    for (let word in words) {
        fs.writeFile('fives.txt', words.toString(), err => {
            if (err) console.error(err);
            else console.log('Data written to file successfully.');
        });
    }
}
//picks the answer by choosing a random number and returns the word
const pickWordleAnswer = (answers) => {
    const answerIndex = Math.floor(Math.random() * answers.length);
    //console.log("The new correct answer is: " + answers[answerIndex]);

    return answers[answerIndex];
}

const guessFunction = (words) => {
    while(true) {
        const guess = prompt("Enter your guess: ");
        if (guess.length !== 5) {
            console.log("Your guess must be 5 letters long!");
        }
        else if (words.includes(guess)){
            return guess;
        }
        else {
            console.log("Your guess is not a legal wordle word!");
        }
    }
}

const assignColors = (answer, guess) => {
    //console.log("Answer: " + answer + " Guess: " + guess);
    let colors = ['N', 'N', 'N', 'N', 'N'];
    let used = [false, false, false, false, false];
    for (let i = 0; i < 5; i++) {
        if (answer[i] == guess[i]){
            colors[i] = 'G';
            CUR_STATUS[guess[i]] = 'G';
            used[i] = true;
        }
    }
    for(let i = 0; i<5; i++) {
        if(colors[i] == 'N'){
            for (let j = 0; j <5; j++) {
                if(guess[i] == answer[j] && used[j] == false) {
                    colors[i] = 'Y';
                    if(CUR_STATUS[guess[i]] !== 'G') {
                        CUR_STATUS[guess[i]] = 'Y';
                    }
                    used[j] = true;
                }
            }
        }
    }
    for(let i = 0; i< 5; i++) {
        if(colors[i] == 'N' && CUR_STATUS[guess[i]] !== 'G' && CUR_STATUS[guess[i]] !== 'Y') {
            CUR_STATUS[guess[i]] = 'N';
        }
    }
    return colors;
}

const processGuess = (answer, guess) => {
    if(answer === guess){
        console.log("Correct!");
        GUESSES.push(guess);
        GUESSES.shift();
        numCorrect++;
        resetStatusKeys();
    }
    else {
        console.log("Incorrect!");
        GUESSES.push(guess);
        numIncorrect++;
        if(numIncorrect == 6) {
            console.log("You lost! Your score this time is " + numCorrect + ". The correct answer was " + answer + ".");
        }
    }
    return assignColors(answer, guess);
}

const getUnguessedBlackYellowGreen = (GUESSES, answer) => {

}

// call to getting the whole dictionary
get_full_dictionary(function(err, words) {
    if (err) {
      return;
    }
    //console.log(words);
    ALL_WORDS = words;
    //LEGACY CODE TO PUT INTO THE FIVES.TXT FILE
    //const fiveLetterWords = filter_word_length(5, words);
    //printToFives(fiveLetterWords);
    get_wordle_answers_dictionary(function(err, answers) {
        if (err) {
            return;
        }
    
        //console.log("Answers: " + answers);
        let answer = pickWordleAnswer(answers);
        while(numIncorrect < 6) {
            console.log("----------------------------------------")
            //console.log("Current correct answer: " + answer);
            printStatus();
            //console.log("Current Status: " + JSON.stringify(CUR_STATUS, null, 2));
            console.log("Turn " + (numCorrect + numIncorrect + 1) + " Current score: " + numCorrect + ". Incorrect so far: " + numIncorrect);
            console.log("Current guesses: " + GUESSES);
            for (const guess of GUESSES) {
                console.log(guess + ": " + assignColors(answer, guess));
            }
            let curGuess = guessFunction(words);
            let colors = processGuess(answer, curGuess);
            if (curGuess === answer) {
                answer = pickWordleAnswer(answers);
                resetStatusKeys();
                for (const guess of GUESSES) {
                    assignColors(answer, guess);
                }
            }
            console.log(colors);
        }
        



        console.log("You lost! Your score this time is " + numCorrect);
    });
  });
