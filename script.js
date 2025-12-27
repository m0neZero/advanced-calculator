const buttonEl = document.querySelectorAll("button");
const resultEl = document.getElementById("result");

for (let i = 0; i < buttonEl.length; i++) {
    buttonEl[i].addEventListener("click", () => {
        const buttonValue = buttonEl[i].textContent;
        if (buttonValue === "C") {
            clearResult();
        } else if (buttonValue === "=") {
            calculateResult();
        } else {
            appendToResult(buttonValue);
        }
    });
}

function clearResult() {
    resultEl.value = "";
}

function calculateResult() {
    try {
        resultEl.value = Function('"use strict"; return (' + resultEl.value + ')')();
    } catch (error) {
        resultEl.value = "Error";
    }
}

function appendToResult(value) {
    resultEl.value += value;
}

