// 1. ПОИСК ЭЛЕМЕНТОВ
const resultEl = document.getElementById("result");
const toggleBtn = document.getElementById("toggleMode");
const calculatorEl = document.querySelector(".calculator");
const buttonsContainer = document.querySelector(".buttons");

// 2. СОСТОЯНИЕ ПРИЛОЖЕНИЯ
let isScientific = false; // Переключатель режима

// 3. ОБРАБОТЧИК ПЕРЕКЛЮЧЕНИЯ РЕЖИМА
toggleBtn.addEventListener("click", () => {
    isScientific = !isScientific;
    // Добавляем/удаляем CSS класс для показа научных кнопок
    calculatorEl.classList.toggle("expanded");

    // Меняем иконку (опционально)
    toggleBtn.innerHTML = isScientific
        ? '<span class="material-icons">calculate</span>'
        : '<span class="material-icons">science</span>';
});

// 4. ГЛАВНЫЙ ОБРАБОТЧИК КЛИКОВ (Делегирование событий)
buttonsContainer.addEventListener("click", (event) => {
    const target = event.target;

    // Проверяем, что нажата именно кнопка
    if (!target.matches("button")) return;

    const value = target.textContent;
    const dataValue = target.getAttribute("data-val"); // Для сложных функций

    // Логика выбора действия
    if (target.classList.contains("clear")) {
        clearResult();
    } else if (target.classList.contains("delete")) {
        deleteLast();
    } else if (target.classList.contains("equals")) {
        calculateResult();
    } else {
        // Если у кнопки есть data-val (например, sin(), используем его, иначе текст)
        appendToResult(dataValue || value);
    }
});

// 5. ФУНКЦИИ ЛОГИКИ

function appendToResult(value) {
    const currentDisplay = resultEl.value;
    const lastChar = currentDisplay.slice(-1); // Получаем последний символ
    const operators = ["+", "-", "*", "/", "%", "^"];

    // 1. ЗАЩИТА ОТ ДУБЛИРОВАНИЯ ОПЕРАТОРОВ
    // Если вводим оператор и последний символ тоже оператор — заменяем старый на новый
    if (operators.includes(value) && operators.includes(lastChar)) {
        resultEl.value = currentDisplay.slice(0, -1) + value;
        return;
    }

    // 2. ЗАЩИТА ОТ МНОЖЕСТВА ТОЧЕК
    if (value === ".") {
        // Находим последнее число в строке (всё, что после последнего оператора)
        const parts = currentDisplay.split(/[\+\-\*\/\%\^]/);
        const lastNumber = parts[parts.length - 1];

        // Если в последнем числе уже есть точка — ничего не делаем
        if (lastNumber.includes(".")) return;
    }

    // 3. ПРАВИЛО ПЕРВОГО СИМВОЛА
    // Нельзя начинать с оператора (кроме минуса или функций)
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

    // Заменяем человеческие символы на понятные программированию
    try {
        expression = expression.replace(/sin\(/g, "Math.sin(");
        expression = expression.replace(/cos\(/g, "Math.cos(");
        expression = expression.replace(/tan\(/g, "Math.tan(");
        expression = expression.replace(/log\(/g, "Math.log10(");
        expression = expression.replace(/ln\(/g, "Math.log(");
        expression = expression.replace(/sqrt\(/g, "Math.sqrt(");
        expression = expression.replace(/\^/g, "**"); // Степень в JS это **

        // Вычисление
        const result = new Function('return ' + expression)();

        // Проверка на корректность результата (например, деление на 0)
        if (result === Infinity || isNaN(result)) {
            resultEl.value = "Ошибка";
        } else {
            // Округляем до 10 знаков, чтобы избежать проблем с плавающей точкой (0.1+0.2)
            resultEl.value = +result.toFixed(10);
        }
    } catch (error) {
        resultEl.value = "Ошибка";
    }
}