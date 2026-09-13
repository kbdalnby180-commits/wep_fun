
"use strict";

document.addEventListener("DOMContentLoaded", () => {

    // ==========================================
    // العناصر
    // ==========================================

    const game = document.getElementById("game");
    const level = document.getElementById("level");

    const startBtn = document.getElementById("startBtn");
    const playAgainBtn = document.getElementById("playAgainBtn");

    const matchesElement = document.getElementById("matches");
    const movesElement = document.getElementById("moves");
    const timerElement = document.getElementById("timer");

    const winPanel = document.getElementById("winPanel");
    const finalMoves = document.getElementById("finalMoves");
    const finalTime = document.getElementById("finalTime");


    // ==========================================
    // الرموز
    // ==========================================

    const emojis = [
        "🍎","🍌","🍇","🍉","🍒",
        "🥑","🥕","🥦","🍔","🍕",
        "🍟","🍩","🍪","🍫","🍿",
        "🥤","⚽","🏀","🏈","🎾",
        "🎲","🎯","🎹","🎸","🎺",
        "🚗","✈️","🚀","🚲","🛵",
        "🏰","🌋","🌙","⭐","☀️",
        "🌈","❄️","🐶","🐱","🐭",
        "🐹","🐰","🦊","🐻","🐼",
        "🐸","🐵","🐧","🐦","🐤",
        "🐴"
    ];


    // ==========================================
    // حالة اللعبة
    // ==========================================

    let firstCard = null;
    let secondCard = null;

    let locked = false;

    let matches = 0;
    let moves = 0;

    let seconds = 0;

    let timerInterval = null;
    let gameStarted = false;


    // ==========================================
    // بداية اللعبة
    // ==========================================

    startBtn.addEventListener("click", startGame);
    playAgainBtn.addEventListener("click", startGame);


    function startGame() {

        stopTimer();

        const pairs = parseInt(level.value, 10);

        firstCard = null;
        secondCard = null;
        locked = false;

        matches = 0;
        moves = 0;
        seconds = 0;

        gameStarted = false;

        updateStats(pairs);
        updateTimer();

        winPanel.classList.add("hidden");

        game.innerHTML = "";

        // اختيار الرموز بدون تغيير المصفوفة الأصلية
        const selected = shuffle([...emojis]).slice(0, pairs);

        // إنشاء الأزواج
        const cards = shuffle([
            ...selected,
            ...selected
        ]);

        setGrid(pairs);

        cards.forEach((emoji, index) => {

            const card = document.createElement("button");

            card.type = "button";
            card.className = "card";

            card.dataset.emoji = emoji;
            card.dataset.index = index;

            card.setAttribute(
                "aria-label",
                "بطاقة مخفية"
            );

            card.addEventListener("click", flipCard);

            game.appendChild(card);
        });
    }


    // ==========================================
    // تحديد شكل الشبكة
    // ==========================================

    function setGrid(pairs) {

        if (pairs <= 6) {

            game.style.gridTemplateColumns =
                "repeat(4, minmax(65px, 90px))";

        } else if (pairs <= 12) {

            game.style.gridTemplateColumns =
                "repeat(6, minmax(60px, 85px))";

        } else {

            game.style.gridTemplateColumns =
                "repeat(8, minmax(52px, 80px))";
        }
    }


    // ==========================================
    // قلب البطاقة
    // ==========================================

    function flipCard() {

        if (locked) return;

        if (this === firstCard) return;

        if (this.classList.contains("matched")) return;


        // بدء المؤقت عند أول ضغطة
        if (!gameStarted) {

            gameStarted = true;
            startTimer();
        }


        this.classList.add("flipped");

        this.textContent = this.dataset.emoji;

        this.setAttribute(
            "aria-label",
            `بطاقة ${this.dataset.emoji}`
        );


        if (!firstCard) {

            firstCard = this;
            return;
        }


        secondCard = this;

        moves++;

        updateMoves();

        locked = true;

        checkMatch();
    }


    // ==========================================
    // التحقق من التطابق
    // ==========================================

    function checkMatch() {

        const isMatch =
            firstCard.dataset.emoji ===
            secondCard.dataset.emoji;


        if (isMatch) {

            setTimeout(() => {

                firstCard.classList.add("matched");
                secondCard.classList.add("matched");

                matches++;

                const total =
                    parseInt(level.value, 10);

                updateMatches(total);

                resetTurn();

                if (matches === total) {

                    finishGame();
                }

            }, 350);


        } else {

            setTimeout(() => {

                firstCard.classList.remove("flipped");
                secondCard.classList.remove("flipped");

                firstCard.textContent = "";
                secondCard.textContent = "";

                firstCard.setAttribute(
                    "aria-label",
                    "بطاقة مخفية"
                );

                secondCard.setAttribute(
                    "aria-label",
                    "بطاقة مخفية"
                );

                resetTurn();

            }, 850);
        }
    }


    // ==========================================
    // إنهاء الدور
    // ==========================================

    function resetTurn() {

        firstCard = null;
        secondCard = null;

        locked = false;
    }


    // ==========================================
    // إنهاء اللعبة
    // ==========================================

    function finishGame() {

        stopTimer();

        gameStarted = false;

        finalMoves.textContent = moves;
        finalTime.textContent = formatTime(seconds);

        setTimeout(() => {

            winPanel.classList.remove("hidden");

            winPanel.scrollIntoView({
                behavior: "smooth",
                block: "center"
            });

        }, 500);
    }


    // ==========================================
    // المؤقت
    // ==========================================

    function startTimer() {

        stopTimer();

        timerInterval = setInterval(() => {

            seconds++;

            updateTimer();

        }, 1000);
    }


    function stopTimer() {

        if (timerInterval) {

            clearInterval(timerInterval);

            timerInterval = null;
        }
    }


    function updateTimer() {

        timerElement.textContent =
            formatTime(seconds);
    }


    function formatTime(totalSeconds) {

        const minutes =
            Math.floor(totalSeconds / 60);

        const secs =
            totalSeconds % 60;

        return `${String(minutes).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
    }


    // ==========================================
    // الإحصائيات
    // ==========================================

    function updateStats(totalPairs) {

        matchesElement.textContent =
            `0 / ${totalPairs}`;

        movesElement.textContent = "0";
    }


    function updateMoves() {

        movesElement.textContent = moves;
    }


    function updateMatches(totalPairs) {

        matchesElement.textContent =
            `${matches} / ${totalPairs}`;
    }


    // ==========================================
    // خلط العناصر
    // ==========================================

    function shuffle(array) {

        for (
            let i = array.length - 1;
            i > 0;
            i--
        ) {

            const j =
                Math.floor(Math.random() * (i + 1));

            [array[i], array[j]] =
                [array[j], array[i]];
        }

        return array;
    }


    // ==========================================
    // تنظيف المؤقت عند إغلاق الصفحة
    // ==========================================

    window.addEventListener("beforeunload", () => {

        stopTimer();

    });

});

