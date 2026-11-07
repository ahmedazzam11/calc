// عند تحميل الصفحة نُظهر شاشة إدخال العمر
window.onload = function () {
    document.getElementById("age-prompt").classList.add("visible");
};

// ===== التحقق من العمر =====
function checkAge() {
    let age = parseInt(document.getElementById("age-input").value);

    if (isNaN(age)) {
        alert("الرجاء إدخال عمرك كرقم");
        return;
    }

    document.getElementById("age-prompt").classList.remove("visible");

    if (age > 18) {
        document.getElementById("calculator").classList.add("visible");
    } else {
        document.getElementById("apology").classList.add("visible");
    }
}

// ===== الآلة الحاسبة =====
let display = document.getElementById("display");

function appendToDisplay(value) {
    if (display.value === "خطأ") display.value = "";
    display.value += value;
}

function clearDisplay() {
    display.value = "";
}

function deleteLast() {
    if (display.value === "خطأ") return clearDisplay();
    display.value = display.value.slice(0, -1);
}

function calculate() {
    if (!display.value) return;
    try {
        let result = evaluate(display.value);
        // تقريب لتفادي مشكلة 0.1 + 0.2
        display.value = String(parseFloat(result.toFixed(10)));
    } catch (error) {
        display.value = "خطأ";
    }
}

// بديل آمن لـ eval(): يحسب + - * / مع احترام أسبقية العمليات
function evaluate(expression) {
    let tokens = expression.match(/\d*\.?\d+|[+\-*/]/g);
    if (!tokens || tokens.join("") !== expression.replace(/\s/g, "")) {
        throw new Error("تعبير غير صالح");
    }
    let pos = 0;

    // رقم (مع دعم الإشارة السالبة مثل: -5 أو 3*-2)
    function number() {
        let sign = 1;
        while (tokens[pos] === "-" || tokens[pos] === "+") {
            if (tokens[pos] === "-") sign = -sign;
            pos++;
        }
        let n = parseFloat(tokens[pos++]);
        if (isNaN(n)) throw new Error("تعبير غير صالح");
        return sign * n;
    }

    // الضرب والقسمة
    function term() {
        let value = number();
        while (tokens[pos] === "*" || tokens[pos] === "/") {
            let op = tokens[pos++];
            let right = number();
            if (op === "/" && right === 0) throw new Error("القسمة على صفر");
            value = op === "*" ? value * right : value / right;
        }
        return value;
    }

    // الجمع والطرح
    let result = term();
    while (pos < tokens.length) {
        let op = tokens[pos++];
        if (op !== "+" && op !== "-") throw new Error("تعبير غير صالح");
        let right = term();
        result = op === "+" ? result + right : result - right;
    }
    return result;
}

// ===== دعم لوحة المفاتيح =====
document.addEventListener("keydown", function (e) {
    if (!document.getElementById("calculator").classList.contains("visible")) return;
    if ("0123456789.+-*/".includes(e.key)) appendToDisplay(e.key);
    else if (e.key === "Enter" || e.key === "=") { e.preventDefault(); calculate(); }
    else if (e.key === "Backspace") deleteLast();
    else if (e.key === "Escape") clearDisplay();
});

// Enter في خانة العمر
document.getElementById("age-input").addEventListener("keypress", function (e) {
    if (e.key === "Enter") checkAge();
});
