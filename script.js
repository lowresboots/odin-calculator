let currentInput = '0';
let previousInput = '';
let operation = null;
let shouldResetScreen = false;

function handleLongNumber(number) {
    const maxLength = 12;
    if (number.length > maxLength) {
        if (number.includes('.')) {
            return Number(number).toFixed(maxLength - number.split('.')[0].length - 1);
        } else {
            return number.slice(0, maxLength);
        }
    }
    return number;
}

function updateDisplay() {
    const display = document.getElementById('display');
    display.textContent = handleLongNumber(currentInput.toString());
}

function appendNumber(number) {
    if (currentInput === '0' || shouldResetScreen) {
        currentInput = number;
        shouldResetScreen = false;
    } else {
        currentInput += number;
    }
    updateDisplay();
}

function appendDecimal() {
    if (shouldResetScreen) {
        currentInput = '0.';
        shouldResetScreen = false;
    } else if (!currentInput.includes('.')) {
        currentInput += '.';
    }
    updateDisplay();
}

function setOperation(op) {
    if (operation !== null) {
        compute();
    }
    previousInput = currentInput;
    operation = op;
    shouldResetScreen = true;
}

function compute() {
    let computation;
    const prev = parseFloat(previousInput);
    const current = parseFloat(currentInput);
    if (isNaN(prev) || isNaN(current)) return;
    switch (operation) {
        case 'add':
            computation = prev + current;
            break;
        case 'subtract':
            computation = prev - current;
            break;
        case 'multiply':
            computation = prev * current;
            break;
        case 'divide':
            if (current === 0) {
                alert("Cannot divide by zero");
                clear();
                return;
            }
            computation = prev / current;
            break;
        default:
            return;
    }
    currentInput = computation.toString();
    operation = null;
    shouldResetScreen = true;
    updateDisplay();
}

function clear() {
    currentInput = '0';
    previousInput = '';
    operation = null;
    shouldResetScreen = false;
    updateDisplay();
}

document.addEventListener('DOMContentLoaded', () => {
    const buttons = document.getElementById('buttons');
    buttons.addEventListener('click', (event) => {
        if (!event.target.matches('button')) return;

        const button = event.target;
        if (button.dataset.number) {
            appendNumber(button.dataset.number);
        } else if (button.dataset.operator) {
            setOperation(button.dataset.operator);
        } else if (button.id === 'equals') {
            compute();
        } else if (button.id === 'clear') {
            clear();
        } else if (button.dataset.decimal) {
            appendDecimal();
        }
    });
    document.addEventListener('keydown', handleKeyboardInput);
});

function handleKeyboardInput(e) {
    if (e.key >= '0' && e.key <= '9') {
        appendNumber(e.key);
    } else if (e.key === '.') {
        appendDecimal();
    } else if (e.key === '+' || e.key === '-' || e.key === '*' || e.key === '/') {
        const operatorMap = {
            '+': 'add',
            '-': 'substract',
            '*': 'multiply',
            '/': 'divide',
        };
        setOperation(operatorMap[e.key]);
    } else if (e.key === 'Enter' || e.key === '=') {
        compute();
    } else if (e.key === 'Escape') {
        clear();
    }
}