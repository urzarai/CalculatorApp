// Get elements
const input = document.getElementById('input');
const history = document.getElementById('history');
const buttons = document.querySelectorAll('button');

let shouldResetDisplay = false;

buttons.forEach(button => {
    button.addEventListener('click', (e) => {
        const buttonText = e.target.textContent;
        
        // If we need to reset display (after calculation)
        if (shouldResetDisplay && !isOperator(buttonText) && buttonText !== '=') {
            input.textContent = '';
            history.textContent = '';
            shouldResetDisplay = false;
        }

        switch(buttonText) {
            case 'C':
                clear();
                break;
            case '⌫':
                backspace();
                break;
            case '=':
                calculate();
                break;
            case '%':
                handlePercent();
                break;
            default:
                appendNumber(buttonText);
        }
    });
});

// Clear all
function clear() {
    input.textContent = '0';
    history.textContent = '';
    shouldResetDisplay = false;
}

// Remove last character
function backspace() {
    if (input.textContent.length === 1 || 
        (input.textContent.length === 2 && input.textContent.includes('-'))) {
        input.textContent = '0';
    } else {
        input.textContent = input.textContent.slice(0, -1);
    }
}

// Check if character is an operator
function isOperator(char) {
    return ['+', '-', '×', '÷', '%'].includes(char);
}

// Append number or operator
function appendNumber(value) {
    // Prevent multiple dots
    if (value === '.' && input.textContent.includes('.')) return;
    
    // Prevent multiple operators
    if (isOperator(value) && isOperator(input.textContent.slice(-1))) {
        input.textContent = input.textContent.slice(0, -1) + value;
        return;
    }

    // Replace initial 0 unless it's a decimal number
    if (input.textContent === '0' && value !== '.') {
        input.textContent = value;
    } else {
        input.textContent += value;
    }
}

// Handle percentage
function handlePercent() {
    let currentValue = parseFloat(input.textContent);
    if (!isNaN(currentValue)) {
        input.textContent = (currentValue / 100).toString();
    }
}

// Main calculation function
function calculate() {
    let expression = input.textContent;
    
    // Save expression to history
    history.textContent = expression + '=';
    
    // Replace operators with JavaScript operators
    expression = expression.replace(/×/g, '*').replace(/÷/g, '/');
    
    try {
        // Evaluate the expression
        let result = eval(expression);
        
        // Handle division by zero
        if (!isFinite(result)) {
            input.textContent = 'Error';
        } else {
            // Round long decimal numbers
            result = Math.round(result * 1000000) / 1000000;
            input.textContent = result.toString();
        }
    } catch (error) {
        input.textContent = 'Error';
    }
    
    shouldResetDisplay = true;
}

// Add keyboard support
document.addEventListener('keydown', (e) => {
    e.preventDefault();
    
    const key = e.key;
    
    // Number keys (0-9) and decimal point
    if (/[\d.]/.test(key)) {
        appendNumber(key);
    }
    
    // Operators
    switch (key) {
        case '+':
        case '-':
            appendNumber(key);
            break;
        case '*':
            appendNumber('×');
            break;
        case '/':
            appendNumber('÷');
            break;
        case 'Enter':
            calculate();
            break;
        case 'Backspace':
            backspace();
            break;
        case 'Escape':
            clear();
            break;
    }
});