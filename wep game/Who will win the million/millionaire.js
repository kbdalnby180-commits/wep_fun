
"use strict";


// =====================================================
// الأسئلة
// =====================================================

const questions = [

    {
        question: "ما هو أكبر حيوان بري على وجه الأرض؟",
        answers: ["الفيل الأفريقي", "الزرافة", "وحيد القرن", "فرس النهر"],
        correct: 0,
        level: 1
    },

    {
        question: "ما هو الكوكب الأقرب إلى الشمس؟",
        answers: ["الزهرة", "الأرض", "عطارد", "المريخ"],
        correct: 2,
        level: 1
    },

    {
        question: "كم عدد قارات العالم؟",
        answers: ["5", "6", "7", "8"],
        correct: 2,
        level: 1
    },

    {
        question: "ما هو أكبر محيط في العالم؟",
        answers: ["الأطلسي", "الهادئ", "الهندي", "المتجمد الشمالي"],
        correct: 1,
        level: 2
    },

    {
        question: "ما هي عاصمة اليابان؟",
        answers: ["بكين", "سيول", "طوكيو", "بانكوك"],
        correct: 2,
        level: 2
    },

    {
        question: "ما هو الرمز الكيميائي للذهب؟",
        answers: ["Ag", "Fe", "Au", "Cu"],
        correct: 2,
        level: 2
    },

    {
        question: "كم عدد ألوان قوس قزح التقليدية؟",
        answers: ["5", "6", "7", "8"],
        correct: 2,
        level: 3
    },

    {
        question: "من هو مخترع المصباح الكهربائي الشهير؟",
        answers: ["ألكسندر غراهام بيل", "توماس إديسون", "نيوتن", "ماركوني"],
        correct: 1,
        level: 3
    },

    {
        question: "ما هي اللغة الأكثر انتشارًا من حيث عدد المتحدثين الأصليين؟",
        answers: ["الإنجليزية", "العربية", "الصينية", "الإسبانية"],
        correct: 2,
        level: 3
    },

    {
        question: "ما هو أسرع حيوان بري؟",
        answers: ["الأسد", "الفهد", "النمر", "الذئب"],
        correct: 1,
        level: 4
    },

    {
        question: "كم عدد أضلاع الشكل السداسي؟",
        answers: ["5", "6", "7", "8"],
        correct: 1,
        level: 4
    },

    {
        question: "أي دولة تشتهر ببرج إيفل؟",
        answers: ["إيطاليا", "إسبانيا", "فرنسا", "ألمانيا"],
        correct: 2,
        level: 4
    },

    {
        question: "ما هو أكبر كوكب في المجموعة الشمسية؟",
        answers: ["زحل", "المشتري", "نبتون", "الأرض"],
        correct: 1,
        level: 5
    },

    {
        question: "في أي قارة تقع مصر؟",
        answers: ["آسيا فقط", "أوروبا", "أفريقيا", "أمريكا الجنوبية"],
        correct: 2,
        level: 5
    },

    {
        question: "ما هو الغاز الذي تحتاجه الكائنات البشرية للتنفس؟",
        answers: ["الهيدروجين", "الأكسجين", "النيتروجين", "ثاني أكسيد الكربون"],
        correct: 1,
        level: 5
    }

];


// =====================================================
// سلم الجوائز
// =====================================================

const prizes = [
    100,
    500,
    1000,
    2500,
    5000,
    10000,
    20000,
    50000,
    100000,
    250000,
    500000,
    750000,
    1000000,
    1500000,
    2000000
];


// =====================================================
// الحالة
// =====================================================

let currentQuestionIndex = 0;

let score = 0;

let bestScore =
    Number(localStorage.getItem("millionaireBest")) || 0;

let timeLeft = 15;

let timerInterval = null;

let answeringLocked = false;

let gameRunning = false;


// =====================================================
// العناصر
// =====================================================

const questionEl =
    document.getElementById("question");

const questionNumberEl =
    document.getElementById("questionNumber");

const scoreEl =
    document.getElementById("score");

const bestScoreEl =
    document.getElementById("bestScore");

const timerEl =
    document.getElementById("timer");

const progressBar =
    document.getElementById("progressBar");

const progressText =
    document.getElementById("progressText");

const prizeList =
    document.getElementById("prizeList");

const answerButtons =
    document.querySelectorAll(".answer-btn");

const notifyEl =
    document.getElementById("notify");

const startUI =
    document.getElementById("startUI");

const gameOverUI =
    document.getElementById("gameOverUI");

const startBtn =
    document.getElementById("startBtn");

const restartBtn =
    document.getElementById("restartBtn");

const restartTopBtn =
    document.getElementById("restartTopBtn");

const skipBtn =
    document.getElementById("skipBtn");

const toggleTheme =
    document.getElementById("toggleTheme");

const finalScoreEl =
    document.getElementById("finalScore");

const endBestScoreEl =
    document.getElementById("endBestScore");

const finalMessageEl =
    document.getElementById("finalMessage");

const endTitleEl =
    document.getElementById("endTitle");

const endIconEl =
    document.getElementById("endIcon");


// =====================================================
// بناء سلم الجوائز
// =====================================================

function buildPrizeList() {

    prizeList.innerHTML = "";

    prizes
        .map((prize, index) => ({
            prize,
            index
        }))
        .reverse()
        .forEach(item => {

            const div =
                document.createElement("div");

            div.className = "prize";

            div.dataset.index =
                item.index;

            div.innerHTML = `
                <span>${item.index + 1}</span>
                <strong>${formatNumber(item.prize)}</strong>
            `;

            prizeList.appendChild(div);
        });
}


// =====================================================
// بدء اللعبة
// =====================================================

function startGame() {

    currentQuestionIndex = 0;

    score = 0;

    timeLeft = 15;

    gameRunning = true;

    answeringLocked = false;

    startUI.classList.add("hidden");

    gameOverUI.classList.add("hidden");

    updateBestScore();

    updateScore();

    buildPrizeList();

    loadQuestion();
}


// =====================================================
// تحميل السؤال
// =====================================================

function loadQuestion() {

    const question =
        questions[currentQuestionIndex];

    if (!question) {

        finishGame(true);

        return;
    }


    answeringLocked = false;


    questionNumberEl.textContent =
        `السؤال ${currentQuestionIndex + 1} من ${questions.length}`;


    questionEl.textContent =
        question.question;


    answerButtons.forEach((button, index) => {

        button.className = "answer-btn";

        button.disabled = false;

        button.querySelector(".answer-text").textContent =
            question.answers[index];
    });


    updateProgress();

    updatePrizeHighlight();

    startTimer();

    playSound("clickSound");

}


// =====================================================
// المؤقت
// =====================================================

function startTimer() {

    clearInterval(timerInterval);

    timeLeft = 15;

    updateTimer();

    timerInterval = setInterval(() => {

        timeLeft--;

        updateTimer();


        if (timeLeft <= 0) {

            clearInterval(timerInterval);

            timeOut();
        }

    }, 1000);
}


function updateTimer() {

    timerEl.textContent =
        timeLeft;


    timerEl.parentElement.classList.toggle(
        "danger",
        timeLeft <= 5
    );
}


// =====================================================
// انتهاء الوقت
// =====================================================

function timeOut() {

    if (answeringLocked) return;

    answeringLocked = true;

    answerButtons.forEach(button => {
        button.disabled = true;
    });

    showNotification("⏰ انتهى الوقت!");

    playSound("wrongSound");

    setTimeout(() => {

        nextQuestion();

    }, 1100);
}


// =====================================================
// التحقق من الإجابة
// =====================================================

function checkAnswer(selectedIndex) {

    if (!gameRunning || answeringLocked) {
        return;
    }

    answeringLocked = true;

    clearInterval(timerInterval);

    answerButtons.forEach(button => {
        button.disabled = true;
    });


    const question =
        questions[currentQuestionIndex];


    const selectedButton =
        document.querySelector(
            `.answer-btn[data-index="${selectedIndex}"]`
        );


    if (selectedIndex === question.correct) {

        selectedButton.classList.add("correct");

        score =
            prizes[currentQuestionIndex];

        updateScore();

        showNotification(
            `✅ إجابة صحيحة! ربحت ${formatNumber(score)} نقطة`
        );

        playSound("correctSound");


        setTimeout(() => {

            if (
                currentQuestionIndex ===
                questions.length - 1
            ) {

                finishGame(true);

            } else {

                nextQuestion();
            }

        }, 1100);


    } else {

        selectedButton.classList.add("wrong");

        const correctButton =
            document.querySelector(
                `.answer-btn[data-index="${question.correct}"]`
            );

        correctButton.classList.add("correct");

        showNotification(
            `❌ إجابة خاطئة!`
        );

        playSound("wrongSound");


        setTimeout(() => {

            finishGame(false);

        }, 1300);
    }
}


// =====================================================
// السؤال التالي
// =====================================================

function nextQuestion() {

    currentQuestionIndex++;

    if (
        currentQuestionIndex >=
        questions.length
    ) {

        finishGame(true);

        return;
    }

    loadQuestion();
}


// =====================================================
// تخطي السؤال
// =====================================================

function skipQuestion() {

    if (!gameRunning || answeringLocked) {
        return;
    }


    answeringLocked = true;

    clearInterval(timerInterval);


    answerButtons.forEach(button => {
        button.disabled = true;
    });


    showNotification(
        "⏭️ تم تخطي السؤال"
    );


    setTimeout(() => {

        nextQuestion();

    }, 700);
}


// =====================================================
// النهاية
// =====================================================

function finishGame(completed) {

    clearInterval(timerInterval);

    gameRunning = false;

    answeringLocked = true;


    if (score > bestScore) {

        bestScore = score;

        localStorage.setItem(
            "millionaireBest",
            bestScore
        );
    }


    finalScoreEl.textContent =
        formatNumber(score);

    endBestScoreEl.textContent =
        formatNumber(bestScore);


    if (completed) {

        endIconEl.textContent = "🏆";

        endTitleEl.textContent =
            "🎉 مبروك!";

        finalMessageEl.textContent =
            "لقد أكملت جميع الأسئلة بنجاح!";

        playSound("correctSound");

    } else {

        endIconEl.textContent = "💥";

        endTitleEl.textContent =
            "انتهت اللعبة";

        finalMessageEl.textContent =
            "إجابة غير صحيحة، حاول مرة أخرى!";

        playSound("gameOverSound");
    }


    updateBestScore();


    setTimeout(() => {

        gameOverUI.classList.remove("hidden");

    }, 400);
}


// =====================================================
// النقاط
// =====================================================

function updateScore() {

    scoreEl.textContent =
        formatNumber(score);
}


// =====================================================
// أفضل نتيجة
// =====================================================

function updateBestScore() {

    bestScoreEl.textContent =
        formatNumber(bestScore);
}


// =====================================================
// التقدم
// =====================================================

function updateProgress() {

    const percentage =
        Math.round(
            (currentQuestionIndex /
                questions.length) * 100
        );

    progressBar.style.width =
        `${percentage}%`;

    progressText.textContent =
        `${percentage}%`;
}


// =====================================================
// سلم الجوائز
// =====================================================

function updatePrizeHighlight() {

    document
        .querySelectorAll(".prize")
        .forEach(item => {

            const index =
                Number(item.dataset.index);

            item.classList.remove(
                "active",
                "passed"
            );


            if (
                index ===
                currentQuestionIndex
            ) {

                item.classList.add(
                    "active"
                );
            }


            if (
                index <
                currentQuestionIndex
            ) {

                item.classList.add(
                    "passed"
                );
            }

        });
}


// =====================================================
// الإشعارات
// =====================================================

let notificationTimeout;

function showNotification(text) {

    clearTimeout(notificationTimeout);

    notifyEl.textContent =
        text;

    notifyEl.classList.add(
        "show"
    );


    notificationTimeout =
        setTimeout(() => {

            notifyEl.classList.remove(
                "show"
            );

        }, 2500);
}


// =====================================================
// الأصوات
// =====================================================

function playSound(id) {

    const sound =
        document.getElementById(id);

    if (!sound) return;


    sound.currentTime = 0;

    sound.play().catch(() => {});
}


// =====================================================
// إعادة اللعبة
// =====================================================

function restartGame() {

    startGame();
}


// =====================================================
// تنسيق الأرقام
// =====================================================

function formatNumber(number) {

    return Number(number).toLocaleString(
        "ar-EG"
    );
}


// =====================================================
// الوضع الليلي / النهاري
// =====================================================

toggleTheme.addEventListener(
    "click",
    () => {

        document.body.classList.toggle(
            "light"
        );


        const isLight =
            document.body.classList.contains(
                "light"
            );


        toggleTheme.textContent =
            isLight
                ? "🌙 الوضع الليلي"
                : "🌞 وضع النهار";


        localStorage.setItem(
            "millionaireTheme",
            isLight
                ? "light"
                : "dark"
        );
    }
);


// =====================================================
// استعادة الثيم
// =====================================================

const savedTheme =
    localStorage.getItem(
        "millionaireTheme"
    );


if (savedTheme === "light") {

    document.body.classList.add(
        "light"
    );

    toggleTheme.textContent =
        "🌙 الوضع الليلي";
}


// =====================================================
// الأحداث
// =====================================================

answerButtons.forEach(button => {

    button.addEventListener(
        "click",
        () => {

            const index =
                Number(button.dataset.index);

            checkAnswer(index);
        }
    );

});


startBtn.addEventListener(
    "click",
    startGame
);


restartBtn.addEventListener(
    "click",
    restartGame
);


restartTopBtn.addEventListener(
    "click",
    restartGame
);


skipBtn.addEventListener(
    "click",
    skipQuestion
);


// =====================================================
// النجوم
// =====================================================

function createStars() {

    const stars =
        document.querySelector(".stars");


    for (let i = 0; i < 100; i++) {

        const star =
            document.createElement("span");

        star.className =
            "star";

        star.style.left =
            `${Math.random() * 100}%`;

        star.style.top =
            `${Math.random() * 100}%`;

        star.style.animationDelay =
            `${Math.random() * 4}s`;

        star.style.animationDuration =
            `${2 + Math.random() * 4}s`;

        stars.appendChild(star);
    }
}


// =====================================================
// تشغيل
// =====================================================

createStars();

buildPrizeList();

updateBestScore();

