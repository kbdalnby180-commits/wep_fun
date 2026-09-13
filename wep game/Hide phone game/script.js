
document.addEventListener("DOMContentLoaded", () => {

  "use strict";

  /* =========================================================
     ELEMENTS
  ========================================================= */

  const playersCount =
    document.getElementById("playersCount");

  const timerMinutes =
    document.getElementById("timerMinutes");

  const playersInputs =
    document.getElementById("playersInputs");

  const setup =
    document.getElementById("setup");

  const gameArea =
    document.getElementById("gameArea");

  const timer =
    document.getElementById("timer");

  const timerFill =
    document.getElementById("timerFill");

  const buttonsArea =
    document.getElementById("buttonsArea");

  const scoreTable =
    document.getElementById("scoreTable");

  const roundBreak =
    document.getElementById("roundBreak");

  const breakCircle =
    document.getElementById("breakCircle");

  const roundNumber =
    document.getElementById("roundNumber");

  const gameStatus =
    document.getElementById("gameStatus");

  const winnerBanner =
    document.getElementById("winnerBanner");

  const resultModal =
    document.getElementById("resultModal");

  const resultText =
    document.getElementById("resultText");

  const finalRanking =
    document.getElementById("finalRanking");

  const toast =
    document.getElementById("toast");

  /* =========================================================
     STATE
  ========================================================= */

  let scores = [];

  let playerNames = [];

  let currentSeconds = 0;

  let totalSeconds = 0;

  let timerInterval = null;

  let breakInterval = null;

  let breakSeconds = 15;

  let currentRound = 1;

  let gameRunning = false;

  let roundLocked = false;

  /* =========================================================
     PLAYER INPUTS
  ========================================================= */

  function generatePlayers() {

    const count =
      Number(playersCount.value);

    let html = "";

    for (
      let i = 1;
      i <= count;
      i++
    ) {

      html += `
        <div class="playerInput">

          <div class="playerNumber">
            ${i}
          </div>

          <input
            type="text"
            id="p${i}"
            placeholder="اسم اللاعب ${i}"
            maxlength="20"
            autocomplete="off"
          >

        </div>
      `;
    }

    playersInputs.innerHTML =
      html;

    showToast(
      "✅ تم تجهيز أسماء اللاعبين"
    );
  }

  /* =========================================================
     START GAME
  ========================================================= */

  function startGame() {

    const count =
      Number(playersCount.value);

    clearInterval(timerInterval);
    clearInterval(breakInterval);

    playerNames = [];
    scores = [];

    for (
      let i = 1;
      i <= count;
      i++
    ) {

      const input =
        document.getElementById(
          `p${i}`
        );

      let name =
        input?.value.trim() ||
        `لاعب ${i}`;

      playerNames.push(
        name.slice(0, 20)
      );

      scores.push(0);
    }

    currentRound = 1;

    gameRunning = true;

    roundLocked = false;

    setup.classList.add(
      "hidden"
    );

    gameArea.classList.remove(
      "hidden"
    );

    winnerBanner.classList.add(
      "hidden"
    );

    buildPlayerButtons();

    updateScoreboard();

    startRound();

    showToast(
      "🚀 بدأت اللعبة!"
    );
  }

  /* =========================================================
     BUILD BUTTONS
  ========================================================= */

  function buildPlayerButtons() {

    buttonsArea.innerHTML = "";

    playerNames.forEach(
      (name, index) => {

        const button =
          document.createElement(
            "button"
          );

        button.className =
          "playerButton";

        button.type =
          "button";

        button.innerHTML = `
          <span class="phone">
            📱
          </span>

          <span class="name">
            ${escapeHTML(name)}
          </span>

          <small>
            اضغط عند العثور
          </small>
        `;

        button.addEventListener(
          "click",
          () => stopTime(index)
        );

        buttonsArea.appendChild(
          button
        );
      }
    );
  }

  /* =========================================================
     START ROUND
  ========================================================= */

  function startRound() {

    clearInterval(timerInterval);

    roundLocked = false;

    roundBreak.classList.add(
      "hidden"
    );

    const selected =
      Number(timerMinutes.value);

    totalSeconds =
      selected;

    currentSeconds =
      selected;

    roundNumber.textContent =
      currentRound;

    gameStatus.textContent =
      "● اللعب مستمر";

    gameStatus.style.color =
      "var(--green)";

    gameStatus.style.borderColor =
      "rgba(74,222,128,.15)";

    updateTimerDisplay();

    timerInterval =
      setInterval(
        tickTimer,
        1000
      );
  }

  /* =========================================================
     TIMER
  ========================================================= */

  function tickTimer() {

    if (!gameRunning || roundLocked) {
      return;
    }

    currentSeconds--;

    updateTimerDisplay();

    if (currentSeconds <= 0) {

      clearInterval(
        timerInterval
      );

      roundLocked = true;

      gameStatus.textContent =
        "● انتهى الوقت";

      gameStatus.style.color =
        "var(--red)";

      gameStatus.style.borderColor =
        "rgba(251,113,133,.18)";

      showToast(
        "⏰ انتهى وقت الجولة!"
      );

      startBreak();
    }
  }

  function updateTimerDisplay() {

    const minutes =
      Math.floor(
        currentSeconds / 60
      );

    const seconds =
      currentSeconds % 60;

    const formatted =
      String(minutes).padStart(2, "0") +
      ":" +
      String(seconds).padStart(2, "0");

    timer.textContent =
      formatted;

    const percent =
      totalSeconds > 0
        ? (
            currentSeconds /
            totalSeconds
          ) * 100
        : 0;

    timerFill.style.width =
      Math.max(
        0,
        percent
      ) + "%";

    if (percent <= 25) {

      timerFill.style.background =
        "linear-gradient(90deg,#fb7185,#ef4444)";

      timer.style.color =
        "#fb7185";

    } else if (percent <= 50) {

      timerFill.style.background =
        "linear-gradient(90deg,#facc15,#fb923c)";

      timer.style.color =
        "#facc15";

    } else {

      timerFill.style.background =
        "linear-gradient(90deg,#4ade80,#67e8f9,#60a5fa)";

      timer.style.color =
        "var(--text)";
    }
  }

  /* =========================================================
     FOUND PHONE
  ========================================================= */

  function stopTime(playerIndex) {

    if (
      !gameRunning ||
      roundLocked
    ) {
      return;
    }

    roundLocked = true;

    clearInterval(
      timerInterval
    );

    scores[playerIndex]++;

    updateScoreboard();

    const foundBy =
      playerNames[playerIndex];

    gameStatus.textContent =
      "● تم العثور على الهاتف";

    gameStatus.style.color =
      "var(--cyan)";

    gameStatus.style.borderColor =
      "rgba(103,232,249,.18)";

    showToast(
      `🎉 ${foundBy} وجد الهاتف!`
    );

    startBreak();
  }

  /* =========================================================
     BREAK
  ========================================================= */

  function startBreak() {

    clearInterval(
      breakInterval
    );

    breakSeconds = 15;

    breakCircle.textContent =
      breakSeconds;

    roundBreak.classList.remove(
      "hidden"
    );

    breakInterval =
      setInterval(
        () => {

          breakSeconds--;

          breakCircle.textContent =
            breakSeconds;

          if (
            breakSeconds <= 0
          ) {

            clearInterval(
              breakInterval
            );

            roundBreak.classList.add(
              "hidden"
            );

            currentRound++;

            updateScoreboard();

            startRound();
          }

        },
        1000
      );
  }

  /* =========================================================
     SCOREBOARD
  ========================================================= */

  function updateScoreboard() {

    const ranking =
      playerNames
        .map(
          (name, index) => ({
            name,
            score:
              scores[index],
            index
          })
        )
        .sort(
          (a, b) =>
            b.score -
            a.score
        );

    scoreTable.innerHTML = "";

    ranking.forEach(
      (player, rank) => {

        const row =
          document.createElement(
            "tr"
          );

        if (rank === 0) {
          row.classList.add(
            "rankOne"
          );
        }

        row.innerHTML = `
          <td>
            ${
              rank === 0
                ? "🥇"
                : rank === 1
                ? "🥈"
                : rank === 2
                ? "🥉"
                : rank + 1
            }
          </td>

          <td>
            ${escapeHTML(
              player.name
            )}
          </td>

          <td class="scoreHighlight">
            ${player.score}
          </td>
        `;

        scoreTable.appendChild(
          row
        );
      }
    );

    if (ranking.length) {

      const leader =
        ranking[0];

      winnerBanner.innerHTML =
        `🏆 المتصدر حاليًا: <strong>${escapeHTML(
          leader.name
        )}</strong> — ${leader.score} نقطة`;

      if (leader.score > 0) {
        winnerBanner.classList.remove(
          "hidden"
        );
      }
    }
  }

  /* =========================================================
     END GAME
  ========================================================= */

  function endGame() {

    if (!gameRunning) {
      return;
    }

    const shouldEnd =
      confirm(
        "هل تريد إنهاء اللعبة وعرض النتيجة؟"
      );

    if (!shouldEnd) {
      return;
    }

    gameRunning = false;

    roundLocked = true;

    clearInterval(
      timerInterval
    );

    clearInterval(
      breakInterval
    );

    roundBreak.classList.add(
      "hidden"
    );

    gameStatus.textContent =
      "● انتهت اللعبة";

    gameStatus.style.color =
      "var(--red)";

    showFinalResults();
  }

  /* =========================================================
     FINAL RESULTS
  ========================================================= */

  function showFinalResults() {

    const ranking =
      playerNames
        .map(
          (name, index) => ({
            name,
            score:
              scores[index]
          })
        )
        .sort(
          (a, b) =>
            b.score -
            a.score
        );

    const top =
      ranking[0];

    resultText.innerHTML =
      top
        ? `الفائز هو <strong>${escapeHTML(
            top.name
          )}</strong> بـ ${top.score} نقطة 🏆`
        : "أحسنتم!";

    finalRanking.innerHTML =
      "";

    ranking.forEach(
      (player, index) => {

        const item =
          document.createElement(
            "div"
          );

        item.className =
          "finalPlayer";

        const medal =
          index === 0
            ? "🥇"
            : index === 1
            ? "🥈"
            : index === 2
            ? "🥉"
            : `#${index + 1}`;

        item.innerHTML = `
          <span>
            ${medal}
            ${escapeHTML(
              player.name
            )}
          </span>

          <strong>
            ${player.score}
          </strong>
        `;

        finalRanking.appendChild(
          item
        );
      }
    );

    resultModal.classList.remove(
      "hidden"
    );
  }

  /* =========================================================
     RESULT MODAL
  ========================================================= */

  function closeResultModal() {

    resultModal.classList.add(
      "hidden"
    );
  }

  function closeResultAndRestart() {

    closeResultModal();

    restartCurrentGame();
  }

  /* =========================================================
     RESTART
  ========================================================= */

  function restartCurrentGame() {

    clearInterval(
      timerInterval
    );

    clearInterval(
      breakInterval
    );

    gameRunning = true;

    roundLocked = false;

    currentRound = 1;

    scores =
      playerNames.map(
        () => 0
      );

    winnerBanner.classList.add(
      "hidden"
    );

    resultModal.classList.add(
      "hidden"
    );

    updateScoreboard();

    buildPlayerButtons();

    startRound();

    showToast(
      "🔄 بدأت لعبة جديدة"
    );
  }

  /* =========================================================
     THEME
  ========================================================= */

  window.toggleTheme =
    function() {

      document.body.classList.toggle(
        "night"
      );

      const night =
        document.body.classList.contains(
          "night"
        );

      localStorage.setItem(
        "fx_phone_theme",
        night
          ? "night"
          : "light"
      );
    };

  function loadTheme() {

    const saved =
      localStorage.getItem(
        "fx_phone_theme"
      );

    if (
      saved === "night"
    ) {
      document.body.classList.add(
        "night"
      );
    }
  }

  /* =========================================================
     TOAST
  ========================================================= */

  let toastTimeout;

  function showToast(message) {

    clearTimeout(
      toastTimeout
    );

    toast.textContent =
      message;

    toast.classList.add(
      "show"
    );

    toastTimeout =
      setTimeout(
        () => {
          toast.classList.remove(
            "show"
          );
        },
        1800
      );
  }

  /* =========================================================
     HTML SAFETY
  ========================================================= */

  function escapeHTML(value) {

    return String(value)
      .replace(
        /&/g,
        "&amp;"
      )
      .replace(
        /</g,
        "&lt;"
      )
      .replace(
        />/g,
        "&gt;"
      )
      .replace(
        /"/g,
        "&quot;"
      )
      .replace(
        /'/g,
        "&#039;"
      );
  }

  /* =========================================================
     EXPOSE FUNCTIONS
  ========================================================= */

  window.generatePlayers =
    generatePlayers;

  window.startGame =
    startGame;

  window.stopTime =
    stopTime;

  window.endGame =
    endGame;

  window.restartCurrentGame =
    restartCurrentGame;

  window.closeResultModal =
    closeResultModal;

  window.closeResultAndRestart =
    closeResultAndRestart;

  /* =========================================================
     INIT
  ========================================================= */

  loadTheme();

  generatePlayers();

  console.log(
    "📱 Fun X Phone Hide initialized successfully"
  );

});

