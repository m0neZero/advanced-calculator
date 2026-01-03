const resultEl = document.getElementById("result");
const toggleBtn = document.getElementById("toggleMode");
const calculatorEl = document.querySelector(".calculator");
const buttonsContainer = document.querySelector(".buttons");

// 2. APPLICATION STATE
let isScientific = false; // Mode toggle

// 3. MODE TOGGLE HANDLER
toggleBtn.addEventListener("click", () => {
    isScientific = !isScientific;
    // Add/remove CSS class to show scientific buttons
    calculatorEl.classList.toggle("expanded");

    // Change the icon
    toggleBtn.innerHTML = isScientific
        ? '<span class="material-icons">calculate</span>'
        : '<span class="material-icons">science</span>';
});

// 4. MAIN CLICK HANDLER (Event delegation)
buttonsContainer.addEventListener("click", (event) => {
    const target = event.target;

    // Check if a button was clicked
    if (!target.matches("button")) return;

    const value = target.textContent;
    const dataValue = target.getAttribute("data-val"); // For complex functions

    // Action selection logic
    if (target.classList.contains("clear")) {
        clearResult();
    } else if (target.classList.contains("delete")) {
        deleteLast();
    } else if (target.classList.contains("equals")) {
        calculateResult();
    } else {
        // If the button has a data-val (e.g., sin()), use it; otherwise, use the text
        appendToResult(dataValue || value);
    }
});

// 5. LOGIC FUNCTIONS

function appendToResult(value) {
    const currentDisplay = resultEl.value;
    const lastChar = currentDisplay.slice(-1); // Get the last character
    const operators = ["+", "-", "*", "/", "%", "^"];

    // 1. PREVENT DUPLICATE OPERATORS
    // If an operator is entered and the last character is also an operator, replace the old one with the new one
    if (operators.includes(value) && operators.includes(lastChar)) {
        resultEl.value = currentDisplay.slice(0, -1) + value;
        return;
    }

    // 2. PREVENT MULTIPLE DECIMAL POINTS
    if (value === ".") {
        // Find the last number in the string (everything after the last operator)
        const parts = currentDisplay.split(/[\+\-\*\/\%\^]/);
        const lastNumber = parts[parts.length - 1];

        // If the last number already contains a decimal point, do nothing
        if (lastNumber.includes(".")) return;
    }

    // 3. FIRST CHARACTER RULE
    // Cannot start with an operator (except minus or functions)
    if (currentDisplay === "" && ["*", "/", "%", "^", ")", "."].includes(value)) {
        return;
    }

    resultEl.value += value;
}

function clearResult() {
    resultEl.value = "";
}

function deleteLast() {
    resultEl.value = resultEl.value.slice(0, -1);
}

function calculateResult() {
    let expression = resultEl.value;

    // Replace human-readable symbols with programming-friendly ones
    try {
        expression = expression.replace(/sin\(/g, "Math.sin(");
        expression = expression.replace(/cos\(/g, "Math.cos(");
        expression = expression.replace(/tan\(/g, "Math.tan(");
        expression = expression.replace(/log\(/g, "Math.log10(");
        expression = expression.replace(/ln\(/g, "Math.log(");
        expression = expression.replace(/sqrt\(/g, "Math.sqrt(");
        expression = expression.replace(/\^/g, "**"); // Exponentiation in JS is **

        // Evaluation
        const result = new Function('return ' + expression)();

        // Check for valid results (e.g., division by 0)
        if (result === Infinity || isNaN(result)) {
            resultEl.value = "Error";
        } else {
            // Round to 10 decimal places to avoid floating-point issues (e.g., 0.1 + 0.2)
            resultEl.value = +result.toFixed(10);
        }
    } catch (error) {
        resultEl.value = "Error";
    }
}