const balanceElement = document.querySelector('.currency');
const notificationElement = document.getElementById('notification');
const timerElement = document.getElementById('timer');
const upgrade1Button = document.getElementById('upgrade1-button');
const upgrade2Button = document.getElementById('upgrade2-button');
const upgrade1CostElement = document.getElementById('upgrade1-cost');
const upgrade2CostElement = document.getElementById('upgrade2-cost');
const betInput = document.getElementById('bet-amount');
const testInput = document.getElementById('test-amount');
const testButton = document.getElementById('test-button');
let balance = 500;
let notificationTimeout;
let timer = 30;
let timerInterval;
let spinCost = 25;
let timerReward = 100;
let upgrade1Cost = 100;
let upgrade2Cost = 230;
let timerIntervalDuration = 1000;

const patterns1 = [
    { pattern: ['7', '7', '7'], reward: 555 }, 
    { pattern: ['🍒', '🍒', '🍒'], reward: 345 }, 
    { pattern: ['🍊', '🍊', '🍊'], reward: 140 },
    { pattern: ['🍉', '🍉', '🍉'], reward: 80 },
    { pattern: ['🍇', '🍇', '🍇'], reward: 35 },
];

const symbols = ['🍒', '🍋', '🍊', '🍉', '🍇', '7', '9'];

function startTimer() {
    clearInterval(timerInterval);
    timerInterval = setInterval(() => {
        timer--;
        timerElement.textContent = `${timer}s`;
        if (timer === 0) {
            balance += timerReward;
            updateBalance();
            timer = 0.1;
        }
    }, timerIntervalDuration);
}

function spinReels() {
    const betAmount = parseInt(betInput.value) || spinCost;
    if (balance < betAmount) {
        showNotification('Not enough balance to spin!');
        return;
    }

    balance -= betAmount;
    updateBalance();

    const reels = document.querySelectorAll('.reel');
    const results = [];

    reels.forEach(reel => {
        const randomSymbol = symbols[Math.floor(Math.random() * symbols.length)];
        reel.textContent = randomSymbol;
        results.push(randomSymbol);
    });

    checkPatterns(results, betAmount);
}

function checkPatterns(results, betAmount) {
    for (const { pattern, reward } of patterns1) {
        if (results.join('') === pattern.join('')) {
            balance += reward * (betAmount / spinCost);
            updateBalance();
            showNotification(`You won $${reward * (betAmount / spinCost)}!`);
            return;
        }
    }
    showNotification('No win, try again!');
}

function updateBalance() {
    balanceElement.textContent = `Balance: $${balance}`;
}

function showNotification(message) {
    notificationElement.textContent = message;
    notificationElement.classList.add('show');
    clearTimeout(notificationTimeout);
    
    notificationTimeout = setTimeout(() => {
        notificationElement.classList.remove('show');
    }, 2000);
}

function upgradeFasterTimer() {
    if (balance >= upgrade1Cost) {
        balance -= upgrade1Cost;
        timerIntervalDuration = Math.max(500, timerIntervalDuration - 100); 
        updateBalance();
        showNotification('Faster Timer upgrade purchased!');
        upgrade1Cost = Math.ceil(upgrade1Cost * 1.65);
        upgrade1CostElement.textContent = `$${upgrade1Cost}`;
        startTimer(); 
    } else {
        showNotification('Not enough balance for upgrade!');
    }
}

function upgradeMorePerUpdate() {
    if (balance >= upgrade2Cost) {
        balance -= upgrade2Cost;
        timerReward += 50;
        updateBalance();
        showNotification('More money per 30s upgrade purchased!');
        upgrade2Cost = Math.ceil(upgrade2Cost * 1.38); 
        upgrade2CostElement.textContent = `$${upgrade2Cost}`;
    } else {
        showNotification('Not enough balance for upgrade!');
    }
}

function addTestCash() {
    const testAmount = parseInt(testInput.value);
    if (!isNaN(testAmount) && testAmount > 0) {
        balance += testAmount;
        updateBalance();
        showNotification(`Added $${testAmount} to balance!`);
    } else {
        showNotification('Invalid amount!');
    }
}

document.querySelector('.spin-button').addEventListener('click', () => {
    const button = document.querySelector('.spin-button');
    button.classList.add('clicked');
    setTimeout(() => button.classList.remove('clicked'), 200);
    spinReels();
});

upgrade1Button.addEventListener('click', upgradeFasterTimer);
upgrade2Button.addEventListener('click', upgradeMorePerUpdate);
testButton.addEventListener('click', addTestCash);

updateBalance();
startTimer();