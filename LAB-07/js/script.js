let level = 1;
let timeToDuel = 500;
let readyToDuel = 'false';

let time;
let score;

const startButton = document.querySelector('.button-start-game');
const restartButton = document.querySelector('.button-restart');
const nextButton = document.querySelector('.button-next-level');

const gameMenu = document.querySelector('.game-menu');
const wrapper = document.querySelector('.wrapper');
const gamePanels = document.querySelector('.game-panels');

const gameScreen = document.querySelector('.game-screen');
const winScreen = document.querySelector('.win-screen');

const gunman = document.querySelector('.gunman');

const timeYou = document.querySelector('.time-panel__you');
const timeGunman = document.querySelector('.time-panel__gunman');

const showLevel = document.querySelector('.score-panel__level');
const message = document.querySelector('.message');

const introSound = new Audio('sfx/intro.m4a');
const waitSound = new Audio('sfx/wait.m4a');
const fireSound = new Audio('sfx/fire.m4a');
const shotSound = new Audio('sfx/shot.m4a');
const winSound = new Audio('sfx/win.m4a');
const deathSound = new Audio('sfx/death.m4a');

startButton.addEventListener('click', startGame);
restartButton.addEventListener('click', restartGame);
nextButton.addEventListener('click', nextLevel);

function startGame() {
    gameMenu.style.display = 'none';
    gamePanels.style.display = 'block';
    gameScreen.style.display = 'block';
    wrapper.style.display = 'block';

    timeGunman.innerHTML = (timeToDuel / 1000).toFixed(2);//перевід у мс
    timeYou.innerHTML = '0.00';

    score = +document.querySelector('.score-panel__score_num').innerHTML;
    showLevel.textContent = 'level: ' + level;

    gunman.classList.add(`gunman-level-${level}`);
    //обробник події завершення анімації руху
    gunman.addEventListener('transitionend', prepareForDuel);

    const random = Math.floor(Math.random() * 2) + 1;
    let side;
    if (random === 2) {
        side = 'left';
    }
    else {
        side = 'right';
        gunman.classList.add(`gunman-right`);
    }

    setTimeout(() => {
        moveGunman(side);
    }, 500);
}

function restartGame() {
    deathSound.pause();
    restartButton.style.display = 'none';
    resetMessage();

    gameScreen.classList.remove('game-screen--death');

    removeGunmanClasses();
    setTimeout(() => {
        startGame();
    }, 1000);
}

function nextLevel() {
    if (level < 5) {
        nextButton.style.display = 'none';
        resetMessage();
        removeGunmanClasses();

        level++;
        timeToDuel = 700 - (level * 130);

        startGame();
    } else {
        showVictoryScreen();
    }
}

function moveGunman(side) {
    setTimeout(() => {
        gunman.classList.add(`moving-${side}`);
        introSound.play();
        introSound.loop = true;//зациклення звуку
    }, 10);
}

function prepareForDuel() {
    introSound.pause();

    waitSound.currentTime = 0;
    waitSound.play();
    waitSound.loop = true;

    gunman.classList.remove('moving-right');
    gunman.classList.remove('gunman-right');
    gunman.classList.remove('moving-left');
    gunman.classList.add('standing');
    gunman.classList.add(`gunman-level-${level}__standing`);

    setTimeout(() => {
        waitSound.pause();

        gunman.classList.add(`gunman-level-${level}__ready`);
        message.classList.add('message--fire');
        fireSound.play();

        gunman.addEventListener('mousedown', playerShootsGunman);

        readyToDuel = true;
        timeCounter(Date.now());
        setTimeout(gunmanShootsPlayer, timeToDuel);
    }, 1000);
}

function timeCounter(start) {
    const updateTime = () => {
        const now = Date.now();
        if (readyToDuel) { //якщо дуель ще триває
            time = ((now - start + 10) / 1000).toFixed(2);
            timeYou.innerHTML = time;
            setTimeout(updateTime, 10);
        }
    };
    updateTime();
}

function gunmanShootsPlayer() {
    if (!readyToDuel) return;//якщо дуель завершена

    readyToDuel = false;//позначка що дуель завершена
    gunman.classList.remove('standing');
    gunman.classList.add(`gunman-level-${level}__shooting`);

    setTimeout(() => {
        shotSound.play();
        message.classList.remove('message--fire');
        message.classList.add('message--dead', 'animated', 'zoomIn');
        message.innerHTML = 'You are dead!';
        gameScreen.classList.add('game-screen--death');
    }, timeToDuel / 3);

    gunman.removeEventListener('mousedown', playerShootsGunman);

    setTimeout(() => {
        deathSound.play();
        restartButton.style.display = 'block';
    }, 1000);
}

function playerShootsGunman() {
    if (!readyToDuel) return;

    readyToDuel = false;
    shotSound.play();

    message.classList.remove('message--fire');
    gunman.classList.remove('standing', `gunman-level-${level}__shooting`);
    gunman.classList.add(`gunman-level-${level}__death`);

    gunman.removeEventListener('mousedown', playerShootsGunman);
    winSound.play();

    setTimeout(() => {
        message.classList.add('message--win', 'animated', 'zoomIn');
        message.innerHTML = 'You Win!';
        scoreCount();
        nextButton.style.display = 'block';
    }, 1000);
}

function scoreCount() {
    const scoreDisplay = document.querySelector('.score-panel__score_num');
    const points = +((timeToDuel - parseFloat(timeYou.innerHTML)) * level * 10).toFixed(0);

    const updateScore = () => {
        if (+scoreDisplay.innerHTML - score < points) {
            scoreDisplay.innerHTML = +scoreDisplay.innerHTML + 100;
            setTimeout(updateScore, 10);
        }
    };
    updateScore();
}

function resetMessage() {
    message.innerHTML = '';
    message.classList.remove('message--dead', 'message--win', 'animated', 'zoomIn');
}

function removeGunmanClasses() {
    const states = ['__standing', '__ready', '__shooting', '__death'];
    gunman.classList.remove(`gunman-level-${level}`);
    states.forEach(state => {
        gunman.classList.remove(`gunman-level-${level}${state}`);
    });
}

function showVictoryScreen() {
    message.style.display = 'none';
    gameScreen.style.display = 'none';
    gamePanels.style.display = 'none';

    score = +document.querySelector('.score-panel__score_num').innerHTML;
    document.querySelector('.score-panel__win-score_num').innerHTML = score;

    winScreen.style.display = 'block';
}