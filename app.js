const startMenu = document.getElementById('start-menu');
const gameArena = document.getElementById('game-arena');
const btnBack = document.getElementById('btn-back');
const modeLabel = document.getElementById('current-mode-label');
const difficultyButtons = document.querySelectorAll('.btn-diff');

const handCards = document.querySelectorAll('.hand-card');
const botCardWrapper = document.getElementById('bot-card-wrapper');
const botCard = botCardWrapper.querySelector('.card');
const botCardFace = document.getElementById('bot-card-face');

const playerCardWrapper = document.getElementById('player-card-wrapper');
const playerCard = playerCardWrapper.querySelector('.card');
const playerCardFace = document.getElementById('player-card-face');

const playerScoreEl = document.getElementById('player-score');
const botScoreEl = document.getElementById('bot-score');
const resultMessage = document.getElementById('result-message');


let currentMode = 'normal';
let playerScore = 0;
let botScore = 0;
let isAnimating = false;
let playerHistory = [];


const choices = ['rock', 'paper', 'scissors'];
const emojis = {
    'rock': '👊',
    'paper': '🖐',
    'scissors': '✌'
};

const winMap = {
    'rock': 'scissors',
    'paper': 'rock',
    'scissors': 'paper'
};
const loseMap = {
    'rock': 'paper',
    'paper': 'scissors',
    'scissors': 'rock'
};


difficultyButtons.forEach(btn => {
    btn.addEventListener('click', () => {
        currentMode = btn.dataset.level;
        startGame(currentMode);
    });
});

btnBack.addEventListener('click', () => {
    resetScores();
    exitGame();
});

handCards.forEach(btn => {
    btn.addEventListener('click', () => {
        if (isAnimating) return;
        playRound(btn.dataset.choice);
    });
});


function startGame(mode) {
    modeLabel.textContent = mode.charAt(0).toUpperCase() + mode.slice(1);
    startMenu.classList.remove('active');
    setTimeout(() => {
        gameArena.classList.add('active');
        lockCards(false);
        resetTable();
    }, 500);
}

function exitGame() {
    gameArena.classList.remove('active');
    setTimeout(() => {
        startMenu.classList.add('active');
    }, 500);
}

function resetScores() {
    playerScore = 0;
    botScore = 0;
    playerHistory = [];
    playerScoreEl.textContent = '0';
    botScoreEl.textContent = '0';
}

function lockCards(lock) {
    handCards.forEach(btn => btn.disabled = lock);
}

function resetTable() {
    botCard.classList.remove('flipped');
    playerCard.classList.remove('flipped');
    resultMessage.textContent = "ESCOLHA SUA CARTA";
    resultMessage.className = "";
}


function getBotChoice(playerChoice) {
    if (currentMode === 'easy') {
        if (Math.random() < 0.3) {
            return winMap[playerChoice]; 
        }
        return choices[Math.floor(Math.random() * 3)];
    } 
    
    if (currentMode === 'normal') {
        return choices[Math.floor(Math.random() * 3)];
    }
    
    if (currentMode === 'hard') {
        if (playerHistory.length >= 3) {
            const counts = { 'rock': 0, 'paper': 0, 'scissors': 0 };
            playerHistory.forEach(c => counts[c]++);
            
            let mostPlayed = 'rock';
            let maxCount = counts['rock'];
            if (counts['paper'] > maxCount) { mostPlayed = 'paper'; maxCount = counts['paper']; }
            if (counts['scissors'] > maxCount) { mostPlayed = 'scissors'; maxCount = counts['scissors']; }
            
            if (Math.random() < 0.6) {
                return loseMap[mostPlayed]; 
            }
        }
        return choices[Math.floor(Math.random() * 3)];
    }
    
    if (currentMode === 'extreme') {
        if (Math.random() < 0.5) {
            return loseMap[playerChoice]; 
        }
        return choices[Math.floor(Math.random() * 3)];
    }
}


function playRound(playerChoice) {
    isAnimating = true;
    lockCards(true);
    resetTable();

    playerHistory.push(playerChoice);
    if (playerHistory.length > 5) playerHistory.shift();

    const botChoice = getBotChoice(playerChoice);

    playerCardFace.textContent = emojis[playerChoice];
    botCardFace.textContent = emojis[botChoice];

    resultMessage.textContent = "BATALHA...";
    resultMessage.className = "";

    setTimeout(() => {
        playerCard.classList.add('flipped');
        
        setTimeout(() => {
            botCard.classList.add('flipped');
            
            setTimeout(() => {
                resolveRound(playerChoice, botChoice);
            }, 800);

        }, 500);

    }, 200);
}

function resolveRound(playerChoice, botChoice) {
    if (playerChoice === botChoice) {
        resultMessage.textContent = "EMPATE!";
        resultMessage.classList.add('draw');
    } else if (winMap[playerChoice] === botChoice) {
        resultMessage.textContent = "VOCÊ VENCEU!";
        resultMessage.classList.add('win');
        playerScore++;
        playerScoreEl.textContent = playerScore;
        playerScoreEl.parentElement.classList.add('shake');
        setTimeout(() => playerScoreEl.parentElement.classList.remove('shake'), 500);
    } else {
        resultMessage.textContent = "BOT VENCEU!";
        resultMessage.classList.add('lose');
        botScore++;
        botScoreEl.textContent = botScore;
        botScoreEl.parentElement.classList.add('shake');
        gameArena.classList.add('shake');
        setTimeout(() => {
            botScoreEl.parentElement.classList.remove('shake');
            gameArena.classList.remove('shake');
        }, 500);
    }

    setTimeout(() => {
        isAnimating = false;
        lockCards(false);
    }, 1500);
}
