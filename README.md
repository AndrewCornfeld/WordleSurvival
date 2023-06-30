# WordleSurvival
Survival Wordle Game I made using NodeJS


# How the game works
The game is a spin on regular wordle, where every time you get a word right, you get a new word to guess, but the words you've previously guessed will regenerate their clues to line up with the new answer. Once you guess incorrectly 6 times, you lose the game. Every time you guess a word incorrectly, the word you guessed gets added to your clue backlog. The number of incorrect guesses you have is the same number of clues you have in your clue backlog. Every time you guess a word correctly, the least recent clue is popped off of the backlog. 

My highest score is 8 correct answers so far, but I average about 1-2 per play. Let me know if you beat my high score!

# How to play the game

1. You will need to download and install nodeJS. You can download that here https://nodejs.org/en/download
2. Download all 3 files: fives.txt, wordle_answers.txt, wordlesurvival.js, and put them in the same folder.
2a. fives.txt: A file which contains all 5 letter words
2b. wordle_answers.txt: A file which contains all wordle answers, note that this is different from all 5 letter words and weeds out less commonly used English words (ex: aalii is a valid guess but will never be an answer.)
2c. wordlesurvival.js: This file contains the code that runs the game.
3. To play the game, use the command line and enter the folder you placed all of the files in using cd. Then, run the command "node wordlesurvival.js"
