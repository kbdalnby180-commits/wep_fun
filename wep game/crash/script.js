
/* =====================================================
   PLANEX — ARCADE GAME
   Virtual points only
===================================================== */

document.addEventListener("DOMContentLoaded", () => {

    "use strict";


    /* =================================================
       SOUNDS
    ================================================= */

    const soundTakeoff =
        new Audio(
            "sounds/take-off-36682.mp3"
        );


    const soundExplosion =
        new Audio(
            "sounds/explosion-312361.mp3"
        );


    const soundClick =
        new Audio(
            "sounds/ui-button-click-5-327756.mp3"
        );


    /* =================================================
       SETTINGS
    ================================================= */

    const MIN_POINTS = 1;

    const INITIAL_POINTS = 500;

    const TICK_MS = 50;

    const STEP = 0.02;

    const STORAGE_KEY =
        "planex_arcade_state";


    /* =================================================
       STATE
    ================================================= */

    let points =
        INITIAL_POINTS;


    let multiplier = 1;

    let crashPoint = 0;

    let running = false;

    let timer = null;

    let roundNumber = 1;

    let playerPoints = 0;

    let playerCollected = false;

    let history = [];

    let aiPlayers = [];


    /* =================================================
       LOAD
    ================================================= */

    try {

        const saved =
            localStorage.getItem(
                STORAGE_KEY
            );


        if (saved) {

            const parsed =
                JSON.parse(saved);


            points =
                Number(
                    parsed.points
                ) || INITIAL_POINTS;


            roundNumber =
                Number(
                    parsed.roundNumber
                ) || 1;


            history =
                Array.isArray(
                    parsed.history
                )
                    ? parsed.history
                    : [];

        }

    } catch (error) {

        console.warn(
            "Storage error:",
            error
        );

    }


    /* =================================================
       ELEMENTS
    ================================================= */

    const balanceEl =
        document.getElementById(
            "balance"
        );


    const multiplierEl =
        document.getElementById(
            "multiplier"
        );


    const resultEl =
        document.getElementById(
            "result"
        );


    const roundNumberEl =
        document.getElementById(
            "roundNumber"
        );


    const plane =
        document.getElementById(
            "plane"
        );


    const line =
        document.getElementById(
            "line"
        );


    const explosion =
        document.getElementById(
            "explosion"
        );


    const crashFlash =
        document.getElementById(
            "crashFlash"
        );


    const playArea =
        document.getElementById(
            "playArea"
        );


    const playersArea =
        document.getElementById(
            "playersArea"
        );


    const historyEl =
        document.getElementById(
            "transactionsList"
        );


    const statusEl =
        document.getElementById(
            "gameStatus"
        );


    const startBtn =
        document.getElementById(
            "bet1Start"
        );


    const collectBtn =
        document.getElementById(
            "bet1Cash"
        );


    const pointsInput =
        document.getElementById(
            "bet1"
        );


    /* =================================================
       SAVE
    ================================================= */

    function saveState() {

        localStorage.setItem(
            STORAGE_KEY,
            JSON.stringify({
                points,
                roundNumber,
                history
            })
        );

    }


    /* =================================================
       SOUND
    ================================================= */

    function playClick() {

        try {

            soundClick.currentTime =
                0;

            soundClick.play()
                .catch(() => {});

        } catch {}

    }


    /* =================================================
       UI
    ================================================= */

    function updateUI() {

        balanceEl.textContent =
            points.toFixed(0);


        roundNumberEl.textContent =
            roundNumber;


        collectBtn.disabled =
            !running;

    }


    function setStatus(
        text,
        className
    ) {

        statusEl.textContent =
            text;


        statusEl.className =
            "status " +
            className;

    }


    /* =================================================
       CRASH POINT
    ================================================= */

    function getCrashPoint() {

        const r =
            Math.random();


        if (r < 0.55) {

            return Number(
                (
                    1 +
                    Math.random() * 4
                ).toFixed(2)
            );

        }


        if (r < 0.78) {

            return Number(
                (
                    5 +
                    Math.random() * 5
                ).toFixed(2)
            );

        }


        if (r < 0.92) {

            return Number(
                (
                    10 +
                    Math.random() * 7
                ).toFixed(2)
            );

        }


        return Number(
            (
                17 +
                Math.random() * 8
            ).toFixed(2)
        );

    }


    /* =================================================
       AI PLAYERS
    ================================================= */

    function generatePlayers() {

        playersArea.innerHTML =
            "";


        aiPlayers = [];


        const count =
            8 +
            Math.floor(
                Math.random() * 8
            );


        for (
            let i = 0;
            i < count;
            i++
        ) {

            const id =
                `BOT-${String(
                    i + 1
                ).padStart(
                    2,
                    "0"
                )}`;


            const botPoints =
                5 +
                Math.floor(
                    Math.random() * 46
                );


            const collectAt =
                (
                    1.2 +
                    Math.random() * 7
                ).toFixed(2);


            aiPlayers.push({

                id,

                points:
                    botPoints,

                collectAt:
                    Number(
                        collectAt
                    ),

                collected:
                    false

            });


            renderAIPlayer(
                aiPlayers[
                    aiPlayers.length - 1
                ]
            );

        }

    }


    function renderAIPlayer(
        player
    ) {

        const card =
            document.createElement(
                "div"
            );


        card.className =
            "player-card";


        card.innerHTML = `

            <div class="player-id">
                ${player.id}
            </div>

            <div class="player-points">
                نقاط: ${player.points}
            </div>

            <div class="player-status">
                ⏳ مستمر
            </div>

        `;


        playersArea.appendChild(
            card
        );

    }


    /* =================================================
       START ROUND
    ================================================= */

    function startRound() {

        if (running) {

            return;

        }


        const selected =
            Number(
                pointsInput.value
            );


        if (
            !Number.isFinite(
                selected
            ) ||
            selected < MIN_POINTS
        ) {

            resultEl.textContent =
                "⚠️ أدخل عدد نقاط صحيح";

            return;

        }


        if (
            selected > points
        ) {

            resultEl.textContent =
                "⚠️ لا تملك نقاطًا كافية";

            return;

        }


        playClick();


        points -=
            selected;


        playerPoints =
            selected;


        playerCollected =
            false;


        multiplier = 1;


        crashPoint =
            getCrashPoint();


        running =
            true;


        resultEl.textContent =
            "🚀 الطائرة أقلعت...";


        resultEl.className =
            "result";


        setStatus(
            "الجولة جارية",
            "running"
        );


        plane.style.right =
            "0px";


        line.style.width =
            "0px";


        plane.classList.add(
            "flying"
        );


        explosion.classList.remove(
            "show"
        );


        generatePlayers();


        updateUI();


        saveState();


        try {

            soundTakeoff.currentTime =
                0;

            soundTakeoff.play()
                .catch(() => {});

        } catch {}


        clearInterval(
            timer
        );


        timer =
            setInterval(
                gameTick,
                TICK_MS
            );

    }


    /* =================================================
       GAME TICK
    ================================================= */

    function gameTick() {

        if (!running) {

            return;

        }


        multiplier =
            Number(
                (
                    multiplier +
                    STEP
                ).toFixed(2)
            );


        multiplierEl.textContent =
            `x${multiplier.toFixed(2)}`;


        /*
         * Move plane
         */

        const maxWidth =
            Math.max(
                0,
                playArea.clientWidth -
                plane.clientWidth
            );


        const progress =
            Math.min(
                1,
                multiplier / 30
            );


        const position =
            progress *
            maxWidth;


        plane.style.right =
            `${position}px`;


        line.style.width =
            `${position}px`;


        /*
         * AI
         */

        aiPlayers.forEach(
            (player, index) => {

                if (
                    !player.collected &&
                    multiplier >=
                        player.collectAt &&
                    multiplier <
                        crashPoint
                ) {

                    player.collected =
                        true;


                    const card =
                        playersArea
                            .children[
                                index
                            ];


                    if (card) {

                        const status =
                            card.querySelector(
                                ".player-status"
                            );


                        if (status) {

                            status.textContent =
                                "⭐ جمع النقاط";

                        }

                    }

                }

            }
        );


        /*
         * Crash
         */

        if (
            multiplier >=
            crashPoint
        ) {

            crashRound();

        }

    }


    /* =================================================
       PLAYER COLLECT
    ================================================= */

    function collectPoints() {

        if (
            !running ||
            playerCollected
        ) {

            return;

        }


        playClick();


        playerCollected =
            true;


        const reward =
            Math.floor(
                playerPoints *
                multiplier
            );


        points +=
            reward;


        addHistory({
            type:
                "win",
            text:
                `⭐ جمعت ${reward} نقطة عند x${multiplier.toFixed(2)}`
        });


        resultEl.textContent =
            `⭐ حصلت على ${reward} نقطة`;


        resultEl.className =
            "result success";


        clearInterval(
            timer
        );


        running =
            false;


        plane.classList.remove(
            "flying"
        );


        setStatus(
            "تم جمع النقاط",
            "waiting"
        );


        updateUI();


        saveState();

    }


    /* =================================================
       CRASH
    ================================================= */

    function crashRound() {

        clearInterval(
            timer
        );


        running =
            false;


        plane.classList.remove(
            "flying"
        );


        setStatus(
            "تحطمت!",
            "crashed"
        );


        /*
         * Explosion
         */

        const planeRight =
            plane.style.right;


        const planeTop =
            plane.offsetTop +
            (
                plane.offsetHeight / 2
            );


        explosion.style.right =
            planeRight;


        explosion.style.top =
            `${planeTop}px`;


        explosion.classList.remove(
            "show"
        );


        void explosion.offsetWidth;


        explosion.classList.add(
            "show"
        );


        crashFlash.classList.remove(
            "active"
        );


        void crashFlash.offsetWidth;


        crashFlash.classList.add(
            "active"
        );


        try {

            soundExplosion.currentTime =
                0;

            soundExplosion.play()
                .catch(() => {});

        } catch {}


        if (
            !playerCollected
        ) {

            addHistory({
                type:
                    "loss",
                text:
                    `💥 تحطمت عند x${crashPoint.toFixed(2)} — خسرت ${playerPoints} نقطة`
            });


            resultEl.textContent =
                `💥 تحطمت الطائرة عند x${crashPoint.toFixed(2)}`;


            resultEl.className =
                "result fail";

        }


        updateUI();

        saveState();


        /*
         * Round increment after display
         */

        roundNumber++;


        saveState();

    }


    /* =================================================
       HISTORY
    ================================================= */

    function addHistory(
        item
    ) {

        history.unshift(
            item
        );


        if (
            history.length > 20
        ) {

            history =
                history.slice(
                    0,
                    20
                );

        }


        renderHistory();

    }


    function renderHistory() {

        if (
            history.length === 0
        ) {

            historyEl.textContent =
                "لا توجد جولات بعد";

            return;

        }


        historyEl.innerHTML =
            history.map(
                item => `

                    <div class="
                        history-row
                        ${item.type}
                    ">
                        ${item.text}
                    </div>

                `
            ).join("");

    }


    /* =================================================
       BUTTONS
    ================================================= */

    startBtn.addEventListener(
        "click",
        startRound
    );


    collectBtn.addEventListener(
        "click",
        collectPoints
    );


    pointsInput.addEventListener(
        "keydown",
        event => {

            if (
                event.key === "Enter"
            ) {

                startRound();

            }

        }
    );


    /* =================================================
       KEYBOARD
    ================================================= */

    document.addEventListener(
        "keydown",
        event => {

            if (
                event.code === "Space"
            ) {

                event.preventDefault();


                if (
                    running
                ) {

                    collectPoints();

                } else {

                    startRound();

                }

            }

        }
    );


    /* =================================================
       PARTICLES
    ================================================= */

    function createParticles() {

        const count =
            window.innerWidth < 600
                ? 30
                : 55;


        const container =
            document.getElementById(
                "particles"
            );


        for (
            let i = 0;
            i < count;
            i++
        ) {

            const particle =
                document.createElement(
                    "span"
                );


            particle.style.position =
                "absolute";


            particle.style.width =
                `${Math.random() * 2 + 1}px`;


            particle.style.height =
                particle.style.width;


            particle.style.borderRadius =
                "50%";


            particle.style.left =
                `${Math.random() * 100}%`;


            particle.style.top =
                `${Math.random() * 100}%`;


            particle.style.background =
                "rgba(80,190,255,0.7)";


            particle.style.opacity =
                `${Math.random() * 0.5 + 0.1}`;


            particle.style.boxShadow =
                "0 0 8px rgba(80,190,255,0.5)";


            const duration =
                Math.random() * 8 + 5;


            particle.style.animation =
                `particleFloat ${duration}s ease-in-out infinite`;


            particle.style.animationDelay =
                `${Math.random() * 5}s`;


            container.appendChild(
                particle
            );

        }

    }


    const particleAnimation =
        document.createElement(
            "style"
        );


    particleAnimation.textContent = `

        @keyframes particleFloat {

            0%,
            100% {
                transform:
                    translate3d(0,0,0);
            }

            50% {
                transform:
                    translate3d(
                        12px,
                        -18px,
                        0
                    );
            }

        }

    `;


    document.head.appendChild(
        particleAnimation
    );


    /* =================================================
       INITIALIZE
    ================================================= */

    renderHistory();

    updateUI();

    createParticles();


});

