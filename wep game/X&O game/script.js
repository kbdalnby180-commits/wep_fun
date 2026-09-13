
"use strict";


// =====================================================
// العناصر
// =====================================================

const menu = document.getElementById("menu");
const gameUI = document.getElementById("gameUI");

const board = document.getElementById("board");
const statusEl = document.getElementById("status");

const result = document.getElementById("result");
const resultIcon = document.getElementById("resultIcon");
const resultTitle = document.getElementById("resultTitle");
const resultText = document.getElementById("resultText");

const difficultyBox =
    document.getElementById("difficultyBox");

const difficulty =
    document.getElementById("difficulty");

const oName =
    document.getElementById("oName");

const scoreXEl =
    document.getElementById("scoreX");

const scoreOEl =
    document.getElementById("scoreO");

const scoreDrawEl =
    document.getElementById("scoreDraw");


// =====================================================
// المتغيرات
// =====================================================

let cells = [];

let boardState =
    Array(9).fill("");

let currentPlayer = "X";

let mode = "bot";

let gameOver = false;

let botThinking = false;

let scores = {
    X: 0,
    O: 0,
    draw: 0
};


// =====================================================
// بدايات القائمة
// =====================================================

difficultyBox.addEventListener(
    "click",
    event => {
        event.stopPropagation();
    }
);


// =====================================================
// بدء اللعبة
// =====================================================

function startGame(selectedMode) {

    mode = selectedMode;

    menu.classList.add("hidden");
    gameUI.classList.remove("hidden");

    result.classList.add("hidden");

    if (mode === "bot") {

        oName.textContent =
            "الروبوت O";

    } else {

        oName.textContent =
            "اللاعب O";
    }

    initBoard();
}


// =====================================================
// إنشاء اللوحة
// =====================================================

function initBoard() {

    board.innerHTML = "";

    cells = [];

    boardState =
        Array(9).fill("");

    currentPlayer = "X";

    gameOver = false;

    botThinking = false;

    result.classList.add("hidden");

    statusEl.textContent =
        "دور اللاعب X";


    for (let i = 0; i < 9; i++) {

        const cell =
            document.createElement("button");

        cell.className = "cell";

        cell.type = "button";

        cell.dataset.index = i;

        cell.addEventListener(
            "click",
            () => playerMove(i)
        );

        board.appendChild(cell);

        cells.push(cell);
    }

    highlightWinner([]);

    updateBoardVisual();
}


// =====================================================
// حركة اللاعب
// =====================================================

function playerMove(index) {

    if (gameOver) return;

    if (botThinking) return;

    if (boardState[index] !== "") return;


    if (
        mode === "bot" &&
        currentPlayer === "O"
    ) {
        return;
    }


    makeMove(index, currentPlayer);


    if (finishIfNeeded()) {
        return;
    }


    switchTurn();


    // الروبوت
    if (
        mode === "bot" &&
        currentPlayer === "O"
    ) {

        botThinking = true;

        statusEl.textContent =
            "🤖 الروبوت يفكر...";

        setTimeout(() => {

            botMove();

        }, 450);
    }
}


// =====================================================
// تنفيذ الحركة
// =====================================================

function makeMove(index, player) {

    boardState[index] = player;

    cells[index].textContent =
        player;

    cells[index].classList.add(
        player.toLowerCase()
    );

    cells[index].disabled = true;

    cells[index].classList.add(
        "pop"
    );
}


// =====================================================
// الروبوت
// =====================================================

function botMove() {

    if (gameOver) {
        botThinking = false;
        return;
    }


    let move;


    switch (difficulty.value) {

        case "easy":
            move = easyMove();
            break;

        case "medium":
            move = mediumMove();
            break;

        default:
            move = hardMove();
            break;
    }


    if (
        move === null ||
        move === undefined
    ) {

        botThinking = false;
        return;
    }


    makeMove(move, "O");

    botThinking = false;


    if (finishIfNeeded()) {
        return;
    }


    switchTurn();

    statusEl.textContent =
        "🎮 دور اللاعب X";
}


// =====================================================
// المستوى السهل
// =====================================================

function easyMove() {

    const available =
        getAvailableMoves();

    if (!available.length) {
        return null;
    }


    const random =
        Math.floor(
            Math.random() *
            available.length
        );

    return available[random];
}


// =====================================================
// المستوى المتوسط
// =====================================================

function mediumMove() {

    // فرصة للفوز
    const winningMove =
        findWinningMove("O");

    if (winningMove !== null) {
        return winningMove;
    }


    // منع X من الفوز
    const blockingMove =
        findWinningMove("X");

    if (blockingMove !== null) {
        return blockingMove;
    }


    // أخذ الوسط
    if (boardState[4] === "") {
        return 4;
    }


    // حركة عشوائية
    return easyMove();
}


// =====================================================
// المستوى الصعب
// =====================================================

function hardMove() {

    let bestScore = -Infinity;

    let bestMoves = [];


    const available =
        getAvailableMoves();


    for (const move of available) {

        boardState[move] = "O";

        const score =
            minimax(
                boardState,
                0,
                false
            );

        boardState[move] = "";


        if (score > bestScore) {

            bestScore = score;

            bestMoves = [move];

        } else if (score === bestScore) {

            bestMoves.push(move);
        }
    }


    if (!bestMoves.length) {
        return null;
    }


    return bestMoves[
        Math.floor(
            Math.random() *
            bestMoves.length
        )
    ];
}


// =====================================================
// Minimax
// =====================================================

function minimax(
    state,
    depth,
    maximizing
) {

    const winner =
        getWinner(state);


    if (winner === "O") {
        return 10 - depth;
    }

    if (winner === "X") {
        return depth - 10;
    }

    if (
        state.every(
            cell => cell !== ""
        )
    ) {
        return 0;
    }


    const moves = [];


    for (
        let i = 0;
        i < state.length;
        i++
    ) {

        if (state[i] === "") {

            state[i] =
                maximizing
                    ? "O"
                    : "X";


            const score =
                minimax(
                    state,
                    depth + 1,
                    !maximizing
                );


            state[i] = "";

            moves.push(score);
        }
    }


    return maximizing
        ? Math.max(...moves)
        : Math.min(...moves);
}


// =====================================================
// البحث عن حركة فوز
// =====================================================

function findWinningMove(player) {

    for (const move of getAvailableMoves()) {

        boardState[move] = player;

        const won =
            getWinner(boardState) === player;

        boardState[move] = "";

        if (won) {
            return move;
        }
    }

    return null;
}


// =====================================================
// الحركات المتاحة
// =====================================================

function getAvailableMoves() {

    return boardState
        .map((value, index) =>
            value === ""
                ? index
                : null
        )
        .filter(
            index => index !== null
        );
}


// =====================================================
// الفائز
// =====================================================

function getWinner(state) {

    const wins = [

        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],

        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],

        [0, 4, 8],
        [2, 4, 6]

    ];


    for (const combo of wins) {

        const [a, b, c] = combo;

        if (
            state[a] &&
            state[a] === state[b] &&
            state[a] === state[c]
        ) {
            return state[a];
        }
    }


    return null;
}


// =====================================================
// استخراج خط الفوز
// =====================================================

function getWinningCombo() {

    const wins = [

        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],

        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],

        [0, 4, 8],
        [2, 4, 6]

    ];


    for (const combo of wins) {

        const [a, b, c] = combo;

        if (
            boardState[a] &&
            boardState[a] === boardState[b] &&
            boardState[a] === boardState[c]
        ) {

            return combo;
        }
    }


    return [];
}


// =====================================================
// فحص نهاية الجولة
// =====================================================

function finishIfNeeded() {

    const winner =
        getWinner(boardState);


    if (winner) {

        gameOver = true;

        const combo =
            getWinningCombo();

        highlightWinner(combo);

        if (winner === "X") {

            scores.X++;

            showResult(
                "🎉",
                "اللاعب X فاز!",
                "مبروك! حركة ممتازة 🔥"
            );

        } else {

            scores.O++;

            showResult(
                "🤖",
                mode === "bot"
                    ? "الروبوت فاز!"
                    : "اللاعب O فاز!",
                "جولة قوية! حاول مرة أخرى 💪"
            );
        }

        updateScores();

        disableAllCells();

        return true;
    }


    if (
        boardState.every(
            cell => cell !== ""
        )
    ) {

        gameOver = true;

        scores.draw++;

        showResult(
            "🤝",
            "تعادل!",
            "ولا لاعب قدر يكمل الخط."
        );

        updateScores();

        return true;
    }


    return false;
}


// =====================================================
// تبديل الدور
// =====================================================

function switchTurn() {

    currentPlayer =
        currentPlayer === "X"
            ? "O"
            : "X";


    if (mode === "human") {

        statusEl.textContent =
            `دور اللاعب ${currentPlayer}`;

    }
}


// =====================================================
// إظهار النتيجة
// =====================================================

function showResult(
    icon,
    title,
    text
) {

    resultIcon.textContent =
        icon;

    resultTitle.textContent =
        title;

    resultText.textContent =
        text;

    result.classList.remove(
        "hidden"
    );
}


// =====================================================
// تمييز خط الفوز
// =====================================================

function highlightWinner(combo) {

    cells.forEach(cell => {

        cell.classList.remove(
            "winner"
        );
    });


    combo.forEach(index => {

        if (cells[index]) {

            cells[index].classList.add(
                "winner"
            );
        }
    });
}


// =====================================================
// تحديث اللوحة
// =====================================================

function updateBoardVisual() {

    cells.forEach(
        (cell, index) => {

            cell.textContent =
                boardState[index];

            cell.disabled =
                boardState[index] !== "";
        }
    );
}


// =====================================================
// تعطيل جميع الخانات
// =====================================================

function disableAllCells() {

    cells.forEach(
        cell => {
            cell.disabled = true;
        }
    );
}


// =====================================================
// تحديث النتائج
// =====================================================

function updateScores() {

    scoreXEl.textContent =
        scores.X;

    scoreOEl.textContent =
        scores.O;

    scoreDrawEl.textContent =
        scores.draw;
}


// =====================================================
// مباراة جديدة
// =====================================================

function newMatch() {

    result.classList.add(
        "hidden"
    );

    initBoard();
}


// =====================================================
// الرجوع للقائمة
// =====================================================

function backToMenu() {

    gameUI.classList.add(
        "hidden"
    );

    menu.classList.remove(
        "hidden"
    );

    result.classList.add(
        "hidden"
    );

    board.innerHTML = "";
}


// =====================================================
// الأزرار
// =====================================================

document
    .getElementById("newGameBtn")
    .addEventListener(
        "click",
        newMatch
    );


document
    .getElementById("playAgainBtn")
    .addEventListener(
        "click",
        newMatch
    );


document
    .getElementById("backBtn")
    .addEventListener(
        "click",
        backToMenu
    );


document
    .getElementById("menuBtn")
    .addEventListener(
        "click",
        backToMenu
    );


// =====================================================
// تحديث اختيار الصعوبة
// =====================================================

difficulty.addEventListener(
    "change",
    () => {

        if (
            mode === "bot" &&
            !gameOver
        ) {
            initBoard();
        }
    }
);


// =====================================================
// التشغيل
// =====================================================

updateScores();

