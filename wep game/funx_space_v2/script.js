
document.addEventListener("DOMContentLoaded", () => {
  "use strict";

  /* =========================================================
     ELEMENTS
  ========================================================= */

  const canvas = document.getElementById("gameCanvas");
  const ctx = canvas.getContext("2d");

  const startBtn = document.getElementById("startBtn");
  const pauseBtn = document.getElementById("pauseBtn");
  const retryBtn = document.getElementById("retryBtn");

  const shopBtn = document.getElementById("shopBtn");
  const missionsBtn = document.getElementById("missionsBtn");
  const settingsBtn = document.getElementById("settingsBtn");

  const autoFire = document.getElementById("autoFire");
  const freeAim = document.getElementById("freeAim");
  const freeAimState = document.getElementById("freeAimState");

  const controlModeEl = document.getElementById("controlMode");

  const scoreEl = document.getElementById("scoreEl");
  const levelEl = document.getElementById("levelEl");
  const highScoreEl = document.getElementById("highScoreEl");
  const waveEl = document.getElementById("waveEl");

  const comboEl = document.getElementById("comboEl");
  const killsEl = document.getElementById("killsEl");
  const musicState = document.getElementById("musicState");

  const hpFill = document.getElementById("hpFill");
  const hpText = document.getElementById("hpText");

  const gpList = document.getElementById("gpList");

  const joy = document.getElementById("joy");
  const joyDot = document.getElementById("joyDot");
  const fireBtn = document.getElementById("fireBtn");

  const gameOverScreen = document.getElementById("gameOverScreen");
  const finalScore = document.getElementById("finalScore");
  const finalLevel = document.getElementById("finalLevel");
  const finalKills = document.getElementById("finalKills");
  const finalHigh = document.getElementById("finalHigh");

  const shopModal = document.getElementById("shopModal");
  const shopScore = document.getElementById("shopScore");
  const shopItems = document.getElementById("shopItems");
  const closeShop = document.getElementById("closeShop");

  const missionModal = document.getElementById("missionModal");
  const missionBody = document.getElementById("missionBody");
  const closeMission = document.getElementById("closeMission");

  const dailyModal = document.getElementById("dailyModal");
  const dailyBody = document.getElementById("dailyBody");
  const closeDaily = document.getElementById("closeDaily");

  const settingsModal = document.getElementById("settingsModal");
  const toggleMusicBtn = document.getElementById("toggleMusic");
  const closeSettings = document.getElementById("closeSettings");

  const masterVol = document.getElementById("masterVol");

  /* =========================================================
     CANVAS
  ========================================================= */

  function resizeCanvas() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    canvas.width = Math.floor(innerWidth * dpr);
    canvas.height = Math.floor(innerHeight * dpr);

    canvas.style.width = innerWidth + "px";
    canvas.style.height = innerHeight + "px";

    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  resizeCanvas();

  window.addEventListener("resize", () => {
    resizeCanvas();

    if (player) {
      player.x = Math.max(
        player.size,
        Math.min(innerWidth - player.size, player.x)
      );

      player.y = Math.max(
        player.size,
        Math.min(innerHeight - player.size, player.y)
      );
    }

    adjustTouchUI();
  });

  /* =========================================================
     AUDIO
  ========================================================= */

  const AudioContextClass =
    window.AudioContext || window.webkitAudioContext;

  let audioCtx = null;
  let masterGain = null;

  let musicOn =
    localStorage.getItem("fx_music") !== "off";

  let musicNodes = null;
  let engineOsc = null;
  let engineGain = null;

  function ensureAudio() {
    if (!AudioContextClass) return;

    if (!audioCtx) {
      audioCtx = new AudioContextClass();
    }

    if (audioCtx.state === "suspended") {
      audioCtx.resume().catch(() => {});
    }

    if (!masterGain) {
      masterGain = audioCtx.createGain();
      masterGain.gain.value =
        parseFloat(localStorage.getItem("fx_volume")) || 0.7;

      masterGain.connect(audioCtx.destination);
    }
  }

  function setMasterVolume(value) {
    ensureAudio();

    if (!masterGain) return;

    masterGain.gain.value = value;

    localStorage.setItem(
      "fx_volume",
      String(value)
    );
  }

  function beep(
    frequency,
    duration = 0.07,
    type = "sine",
    volume = 0.07
  ) {
    try {
      ensureAudio();

      if (!audioCtx || !masterGain) return;

      const oscillator = audioCtx.createOscillator();
      const gain = audioCtx.createGain();

      oscillator.type = type;
      oscillator.frequency.value = frequency;

      gain.gain.value = volume;

      oscillator.connect(gain);
      gain.connect(masterGain);

      oscillator.start();

      oscillator.stop(
        audioCtx.currentTime + duration
      );
    } catch (_) {}
  }

  function playShoot() {
    beep(840, 0.045, "square", 0.045);
  }

  function playHit() {
    beep(150, 0.08, "sawtooth", 0.07);
    beep(70, 0.09, "sine", 0.035);
  }

  function playPickup() {
    beep(1100, 0.05, "triangle", 0.06);
    setTimeout(
      () => beep(1500, 0.07, "triangle", 0.05),
      35
    );
  }

  function startMusic() {
    try {
      if (!musicOn) return;

      ensureAudio();

      if (!audioCtx || musicNodes) return;

      const o1 = audioCtx.createOscillator();
      const o2 = audioCtx.createOscillator();

      const gain = audioCtx.createGain();
      const filter = audioCtx.createBiquadFilter();

      o1.type = "sine";
      o2.type = "triangle";

      o1.frequency.value = 92;
      o2.frequency.value = 184;

      filter.type = "lowpass";
      filter.frequency.value = 650;

      gain.gain.value = 0.035;

      o1.connect(gain);
      o2.connect(gain);

      gain.connect(filter);
      filter.connect(masterGain);

      o1.start();
      o2.start();

      musicNodes = {
        o1,
        o2,
        gain,
        filter
      };
    } catch (_) {}
  }

  function stopMusic() {
    try {
      if (!musicNodes) return;

      musicNodes.o1.stop();
      musicNodes.o2.stop();

      musicNodes = null;
    } catch (_) {}
  }

  function toggleMusic() {
    musicOn = !musicOn;

    localStorage.setItem(
      "fx_music",
      musicOn ? "on" : "off"
    );

    musicState.textContent =
      musicOn ? "On" : "Off";

    toggleMusicBtn.textContent =
      musicOn ? "إيقاف" : "تشغيل";

    if (musicOn) {
      startMusic();
    } else {
      stopMusic();
    }
  }

  function engineHumStart() {
    try {
      ensureAudio();

      if (!audioCtx || engineOsc) return;

      engineOsc =
        audioCtx.createOscillator();

      engineGain =
        audioCtx.createGain();

      engineOsc.type = "sine";
      engineOsc.frequency.value = 45;

      engineGain.gain.value = 0.018;

      engineOsc.connect(engineGain);
      engineGain.connect(masterGain);

      engineOsc.start();
    } catch (_) {}
  }

  function engineHumStop() {
    try {
      if (!engineOsc) return;

      engineOsc.stop();

      engineOsc = null;
      engineGain = null;
    } catch (_) {}
  }

  /* =========================================================
     SAVE DATA
  ========================================================= */

  let score = 0;
  let level = 1;

  let highScore =
    Number(localStorage.getItem("fx_high")) || 0;

  let kills = 0;
  let wave = 1;
  let combo = 1;
  let comboTimer = 0;

  let upgrades;

  try {
    upgrades =
      JSON.parse(
        localStorage.getItem("fx_upgrades")
      );
  } catch (_) {
    upgrades = null;
  }

  if (!upgrades) {
    upgrades = {
      speed: 0,
      power: 0,
      shots: 0,
      shield: 0,
      appearance: 0,
      turrets: 0,
      allies: 0,
      fireRate: 0
    };
  }

  let controlMode =
    localStorage.getItem("fx_control") || "auto";

  controlModeEl.value = controlMode;

  /* =========================================================
     GAME STATE
  ========================================================= */

  let running = false;
  let paused = false;
  let gameStarted = false;

  let player = null;

  let npcs = [];
  let bullets = [];
  let enemies = [];
  let pickups = [];
  let explosions = [];
  let particles = [];

  let stars = [];

  let lastTime = performance.now();

  let spawnTimer = 0;
  let spawnInterval = 3.8;

  let waveEnemyKills = 0;

  let gameLoopId = null;

  /* =========================================================
     INPUT
  ========================================================= */

  const input = {
    left: 0,
    right: 0,
    up: 0,
    down: 0,
    action: 0
  };

  let activeTouchId = null;
  let joyCenter = null;

  function getDetectedControl() {
    if (controlMode !== "auto") {
      return controlMode;
    }

    const hasTouch =
      "ontouchstart" in window;

    if (
      hasTouch &&
      Math.min(innerWidth, innerHeight) < 900
    ) {
      return "touch";
    }

    if (
      navigator.getGamepads &&
      Array.from(navigator.getGamepads()).some(Boolean)
    ) {
      return "gamepad";
    }

    return "keyboard";
  }

  /* =========================================================
     KEYBOARD
  ========================================================= */

  window.addEventListener("keydown", event => {
    if (
      getDetectedControl() !== "keyboard" &&
      controlMode !== "keyboard"
    ) {
      return;
    }

    switch (event.code) {

      case "ArrowLeft":
      case "KeyA":
        input.left = 1;
        break;

      case "ArrowRight":
      case "KeyD":
        input.right = 1;
        break;

      case "ArrowUp":
      case "KeyW":
        input.up = 1;
        break;

      case "ArrowDown":
      case "KeyS":
        input.down = 1;
        break;

      case "Space":
        input.action = 1;
        break;
    }
  });

  window.addEventListener("keyup", event => {

    switch (event.code) {

      case "ArrowLeft":
      case "KeyA":
        input.left = 0;
        break;

      case "ArrowRight":
      case "KeyD":
        input.right = 0;
        break;

      case "ArrowUp":
      case "KeyW":
        input.up = 0;
        break;

      case "ArrowDown":
      case "KeyS":
        input.down = 0;
        break;

      case "Space":
        input.action = 0;
        break;
    }
  });

  /* =========================================================
     TOUCH
  ========================================================= */

  function adjustTouchUI() {
    const mode = getDetectedControl();

    const enabled =
      mode === "touch" ||
      controlMode === "touch";

    joy.style.display =
      enabled ? "flex" : "none";

    fireBtn.style.display =
      enabled ? "flex" : "none";
  }

  function joyGetCenter() {
    const rect =
      joy.getBoundingClientRect();

    return {
      x: rect.left + rect.width / 2,
      y: rect.top + rect.height / 2
    };
  }

  function handleJoyMove(x, y) {

    if (!joyCenter) return;

    const dx = x - joyCenter.x;
    const dy = y - joyCenter.y;

    const max = joy.clientWidth * 0.36;

    const nx =
      Math.max(
        -max,
        Math.min(max, dx)
      );

    const ny =
      Math.max(
        -max,
        Math.min(max, dy)
      );

    joyDot.style.transform =
      `translate(${nx}px,${ny}px)`;

    input.left = nx < -10 ? 1 : 0;
    input.right = nx > 10 ? 1 : 0;

    input.up = ny < -10 ? 1 : 0;
    input.down = ny > 10 ? 1 : 0;
  }

  joy.addEventListener(
    "pointerdown",
    event => {

      if (
        getDetectedControl() !== "touch" &&
        controlMode !== "touch"
      ) {
        return;
      }

      joy.setPointerCapture(
        event.pointerId
      );

      activeTouchId =
        event.pointerId;

      joyCenter =
        joyGetCenter();

      handleJoyMove(
        event.clientX,
        event.clientY
      );
    }
  );

  joy.addEventListener(
    "pointermove",
    event => {

      if (
        event.pointerId !== activeTouchId
      ) {
        return;
      }

      handleJoyMove(
        event.clientX,
        event.clientY
      );
    }
  );

  function resetJoystick() {
    activeTouchId = null;

    joyDot.style.transform =
      "translate(0,0)";

    input.left = 0;
    input.right = 0;
    input.up = 0;
    input.down = 0;
  }

  joy.addEventListener(
    "pointerup",
    resetJoystick
  );

  joy.addEventListener(
    "pointercancel",
    resetJoystick
  );

  fireBtn.addEventListener(
    "pointerdown",
    event => {

      event.preventDefault();

      input.action = 1;

      setTimeout(() => {
        input.action = 0;
      }, 100);

      ensureAudio();
    }
  );

  window.addEventListener(
    "pointerdown",
    () => {
      ensureAudio();
    },
    { passive: true }
  );

  /* =========================================================
     GAMEPAD
  ========================================================= */

  function scanGamepads() {

    if (!navigator.getGamepads) {
      gpList.textContent = "غير مدعوم";
      return;
    }

    const pads =
      Array.from(
        navigator.getGamepads()
      ).filter(Boolean);

    if (!pads.length) {
      gpList.textContent = "—";
      return;
    }

    gpList.textContent =
      pads
        .map((gamepad, index) =>
          `#${index + 1} ${gamepad.id.slice(0, 28)}`
        )
        .join(" | ");
  }

  function pollGamepads() {

    if (!navigator.getGamepads) {
      return;
    }

    if (
      getDetectedControl() !== "gamepad"
    ) {
      return;
    }

    const pads =
      Array.from(
        navigator.getGamepads()
      ).filter(Boolean);

    const gamepad = pads[0];

    if (!gamepad) return;

    const horizontal =
      gamepad.axes[0] || 0;

    const vertical =
      gamepad.axes[1] || 0;

    input.left =
      horizontal < -0.25 ? 1 : 0;

    input.right =
      horizontal > 0.25 ? 1 : 0;

    input.up =
      vertical < -0.25 ? 1 : 0;

    input.down =
      vertical > 0.25 ? 1 : 0;

    input.action =
      gamepad.buttons[0]?.pressed ||
      gamepad.buttons[1]?.pressed ||
      gamepad.buttons[7]?.pressed
        ? 1
        : 0;
  }

  window.addEventListener(
    "gamepadconnected",
    scanGamepads
  );

  window.addEventListener(
    "gamepaddisconnected",
    scanGamepads
  );

  /* =========================================================
     ENTITIES
  ========================================================= */

  function createStars() {

    stars = [];

    for (let i = 0; i < 260; i++) {

      stars.push({
        x: Math.random() * innerWidth,
        y: Math.random() * innerHeight,
        size: Math.random() * 1.8 + .2,
        speed: Math.random() * 1.7 + .2,
        alpha: Math.random() * .8 + .2
      });
    }
  }

  createStars();

  function createPlayer() {

    const shield =
      Number(upgrades.shield) || 0;

    return {
      x: innerWidth / 2,
      y: innerHeight - 130,

      size: 44,

      speed:
        225 +
        Number(upgrades.speed || 0) * 18,

      hp: 6 + shield,
      maxHp: 6 + shield,

      fireCooldown: 0,

      weapon: {
        power:
          1 +
          Number(upgrades.power || 0),

        shots:
          1 +
          Number(upgrades.shots || 0)
      },

      appearance:
        Number(upgrades.appearance || 0),

      turrets:
        Number(upgrades.turrets || 0)
    };
  }

  function createEnemy() {

    const random =
      Math.random();

    let type;

    if (random < .58) {
      type = "scout";
    } else if (random < .87) {
      type = "heavy";
    } else {
      type = "fast";
    }

    const data = {
      scout: {
        size: 34,
        hp: 1,
        speed: 85
      },

      heavy: {
        size: 56,
        hp: 4,
        speed: 58
      },

      fast: {
        size: 42,
        hp: 2,
        speed: 125
      }
    }[type];

    return {
      x:
        Math.random() *
        (innerWidth - 100) +
        50,

      y:
        -80 -
        Math.random() * 220,

      size: data.size,
      hp: data.hp,
      maxHp: data.hp,
      speed:
        data.speed +
        level * 5,

      type,

      phase:
        Math.random() * Math.PI * 2,

      color:
        type === "scout"
          ? "#ff6575"
          : type === "heavy"
          ? "#ff9c65"
          : "#d56dff"
    };
  }

  function spawnEnemyWave(count = null) {

    const amount =
      count ??
      Math.min(
        20,
        3 +
        level +
        Math.floor(Math.random() * 3)
      );

    for (let i = 0; i < amount; i++) {
      enemies.push(createEnemy());
    }

    wave++;
    waveEl.textContent = wave;
  }

  /* =========================================================
     BULLETS
  ========================================================= */

  function fireFrom(source) {

    if (!source) return;

    const power =
      source.weapon?.power || 1;

    const shots =
      source.weapon?.shots || 1;

    const spread =
      Math.min(
        70,
        (shots - 1) * 10
      );

    for (let i = 0; i < shots; i++) {

      const offset =
        shots === 1
          ? 0
          : -spread / 2 +
            i *
              (spread /
                Math.max(1, shots - 1));

      bullets.push({
        x:
          source.x + offset,

        y:
          source.y -
          source.size * .65,

        vx:
          freeAim.checked
            ? 0
            : offset * .004,

        vy:
          -1,

        speed:
          360 +
          power * 35,

        radius:
          5 +
          power * 1.8,

        damage:
          power,

        life:
          180,

        friendly:
          true
      });
    }

    if (source.turrets > 0) {

      for (
        let i = 0;
        i < source.turrets;
        i++
      ) {

        const angle =
          -Math.PI / 2 +
          (
            i -
            (source.turrets - 1) / 2
          ) *
            .22;

        bullets.push({
          x:
            source.x +
            Math.cos(angle) *
              source.size * .5,

          y:
            source.y +
            Math.sin(angle) *
              source.size * .5,

          vx:
            Math.cos(angle),

          vy:
            Math.sin(angle),

          speed: 310,

          radius: 4.5,

          damage: Math.max(
            1,
            power - 1
          ),

          life: 130,

          friendly: true
        });
      }
    }

    playShoot();
  }

  /* =========================================================
     COLLISIONS
  ========================================================= */

  function circleRectCollision(
    cx,
    cy,
    radius,
    rectX,
    rectY,
    width,
    height
  ) {

    const dx =
      Math.abs(cx - rectX);

    const dy =
      Math.abs(cy - rectY);

    const halfW =
      width / 2;

    const halfH =
      height / 2;

    if (
      dx >
      halfW + radius
    ) {
      return false;
    }

    if (
      dy >
      halfH + radius
    ) {
      return false;
    }

    if (dx <= halfW) {
      return true;
    }

    if (dy <= halfH) {
      return true;
    }

    const cornerX =
      dx - halfW;

    const cornerY =
      dy - halfH;

    return (
      cornerX * cornerX +
      cornerY * cornerY
    ) <=
      radius * radius;
  }

  function distance(
    x1,
    y1,
    x2,
    y2
  ) {
    return Math.hypot(
      x1 - x2,
      y1 - y2
    );
  }

  /* =========================================================
     PARTICLES
  ========================================================= */

  function createExplosion(
    x,
    y,
    power = 1
  ) {

    explosions.push({
      x,
      y,
      radius: 8,
      maxRadius:
        45 + power * 8,
      alpha: 1
    });

    for (let i = 0; i < 15; i++) {

      const angle =
        Math.random() *
        Math.PI * 2;

      const speed =
        Math.random() *
          130 +
        40;

      particles.push({
        x,
        y,

        vx:
          Math.cos(angle) *
          speed,

        vy:
          Math.sin(angle) *
          speed,

        life:
          .5 +
          Math.random() *
          .6,

        size:
          Math.random() * 3 +
          1
      });
    }
  }

  function updateParticles(dt) {

    for (
      let i = particles.length - 1;
      i >= 0;
      i--
    ) {

      const p =
        particles[i];

      p.x +=
        p.vx * dt;

      p.y +=
        p.vy * dt;

      p.vx *=
        .97;

      p.vy *=
        .97;

      p.life -= dt;

      if (p.life <= 0) {
        particles.splice(i, 1);
      }
    }
  }

  /* =========================================================
     PICKUPS
  ========================================================= */

  function spawnPickup(x, y) {

    const types = [
      "score",
      "speed",
      "shield",
      "power",
      "fireRate"
    ];

    pickups.push({
      x,
      y,
      radius: 11,

      type:
        types[
          Math.floor(
            Math.random() *
            types.length
          )
        ],

      pulse:
        Math.random() *
        Math.PI *
        2
    });
  }

  function applyPickup(pickup) {

    if (!player) return;

    switch (pickup.type) {

      case "score":
        score += 250;
        break;

      case "speed":
        player.speed += 15;
        upgrades.speed++;
        break;

      case "shield":
        player.hp =
          Math.min(
            player.maxHp,
            player.hp + 1
          );
        break;

      case "power":
        player.weapon.power++;
        upgrades.power++;
        break;

      case "fireRate":
        upgrades.fireRate++;
        break;
    }

    saveUpgrades();
    updateUI();
    playPickup();
  }

  /* =========================================================
     AI
  ========================================================= */

  function enemyAI(enemy, dt) {

    if (!player) return;

    enemy.phase += dt * 2;

    const targetX =
      player.x;

    const targetY =
      player.y;

    if (enemy.type === "scout") {

      const dx =
        targetX - enemy.x;

      const dy =
        targetY - enemy.y;

      const angle =
        Math.atan2(dy, dx);

      enemy.x +=
        Math.cos(angle) *
        enemy.speed *
        dt;

      enemy.y +=
        Math.sin(angle) *
        enemy.speed *
        dt;

    } else if (
      enemy.type === "fast"
    ) {

      enemy.x +=
        Math.sin(enemy.phase * 2) *
        70 *
        dt;

      enemy.y +=
        enemy.speed *
        dt;

    } else {

      enemy.x +=
        Math.sin(enemy.phase) *
        28 *
        dt;

      enemy.y +=
        enemy.speed *
        dt;
    }
  }

  /* =========================================================
     ALLY
  ========================================================= */

  function spawnAlly() {

    if (!player) return;

    if (
      npcs.length >=
      (upgrades.allies || 0)
    ) {
      return;
    }

    npcs.push({
      x:
        player.x - 80,

      y:
        player.y - 40,

      size:
        27,

      speed:
        170,

      fireCooldown:
        0
    });
  }

  function updateAllies(dt) {

    for (const npc of npcs) {

      if (!player) continue;

      npc.x +=
        (
          player.x - 80 -
          npc.x
        ) *
        dt *
        2.5;

      npc.y +=
        (
          player.y - 55 -
          npc.y
        ) *
        dt *
        2.5;

      if (
        npc.fireCooldown <= 0 &&
        enemies.length
      ) {

        const enemy =
          enemies[0];

        const dx =
          enemy.x -
          npc.x;

        const dy =
          enemy.y -
          npc.y;

        const len =
          Math.hypot(dx, dy) || 1;

        bullets.push({
          x: npc.x,
          y: npc.y,

          vx: dx / len,
          vy: dy / len,

          speed: 300,

          radius: 4,

          damage: 1,

          life: 100,

          friendly: true
        });

        npc.fireCooldown =
          1.1;

      } else {

        npc.fireCooldown -=
          dt;
      }
    }
  }

  /* =========================================================
     PLAYER DAMAGE
  ========================================================= */

  function damagePlayer() {

    if (!player) return;

    player.hp--;

    createExplosion(
      player.x,
      player.y,
      1
    );

    playHit();

    if (player.hp <= 0) {
      endGame();
    }

    updateHP();
  }

  /* =========================================================
     UI
  ========================================================= */

  function updateHP() {

    if (!player) {
      hpFill.style.width = "0%";
      hpText.textContent = "0 / 0";
      return;
    }

    const percent =
      Math.max(
        0,
        Math.min(
          100,
          (player.hp /
            player.maxHp) *
            100
        )
      );

    hpFill.style.width =
      percent + "%";

    hpText.textContent =
      `${player.hp} / ${player.maxHp}`;
  }

  function updateUI() {

    scoreEl.textContent =
      Math.floor(score);

    levelEl.textContent =
      level;

    highScoreEl.textContent =
      highScore;

    waveEl.textContent =
      wave;

    killsEl.textContent =
      kills;

    comboEl.textContent =
      `x${combo}`;

    shopScore.textContent =
      Math.floor(score);

    updateHP();
  }

  function saveUpgrades() {

    localStorage.setItem(
      "fx_upgrades",
      JSON.stringify(upgrades)
    );
  }

  /* =========================================================
     GAME UPDATE
  ========================================================= */

  function update(dt) {

    if (!running || paused) {
      return;
    }

    pollGamepads();

    /* Stars */

    for (const star of stars) {

      star.y +=
        star.speed *
        30 *
        dt;

      if (
        star.y >
        innerHeight
      ) {

        star.y = -3;
        star.x =
          Math.random() *
          innerWidth;
      }
    }

    /* Player */

    if (!player) {
      player = createPlayer();

      for (
        let i = 0;
        i < (upgrades.allies || 0);
        i++
      ) {
        spawnAlly();
      }
    }

    let vx =
      input.right -
      input.left;

    let vy =
      input.down -
      input.up;

    if (vx !== 0 || vy !== 0) {

      const length =
        Math.hypot(vx, vy) || 1;

      player.x +=
        (vx / length) *
        player.speed *
        dt;

      player.y +=
        (vy / length) *
        player.speed *
        dt;

      player.x =
        Math.max(
          player.size,
          Math.min(
            innerWidth -
              player.size,
            player.x
          )
        );

      player.y =
        Math.max(
          player.size,
          Math.min(
            innerHeight -
              player.size,
            player.y
          )
        );
    }

    /* Fire */

    if (
      (
        input.action ||
        autoFire.checked
      ) &&
      player.fireCooldown <= 0
    ) {

      fireFrom(player);

      const rate =
        Number(upgrades.fireRate) || 0;

      player.fireCooldown =
        Math.max(
          .07,
          .24 -
          rate * .02
        );
    }

    if (
      player.fireCooldown > 0
    ) {
      player.fireCooldown -= dt;
    }

    /* Allies */

    updateAllies(dt);

    /* Enemies */

    for (
      let i = enemies.length - 1;
      i >= 0;
      i--
    ) {

      const enemy =
        enemies[i];

      enemyAI(enemy, dt);

      /* Bullet collision */

      for (
        let j =
          bullets.length - 1;
        j >= 0;
        j--
      ) {

        const bullet =
          bullets[j];

        if (!bullet.friendly) {
          continue;
        }

        if (
          circleRectCollision(
            bullet.x,
            bullet.y,
            bullet.radius,
            enemy.x,
            enemy.y,
            enemy.size,
            enemy.size
          )
        ) {

          enemy.hp -=
            bullet.damage;

          bullets.splice(j, 1);

          if (enemy.hp <= 0) {

            enemies.splice(i, 1);

            const gained =
              100 * combo;

            score += gained;

            kills++;
            waveEnemyKills++;

            combo =
              Math.min(
                9,
                combo + 1
              );

            comboTimer = 2.5;

            level =
              1 +
              Math.floor(
                score / 1200
              );

            if (
              Math.random() < .28
            ) {
              spawnPickup(
                enemy.x,
                enemy.y
              );
            }

            createExplosion(
              enemy.x,
              enemy.y,
              1
            );

            playHit();

            updateUI();

          }

          break;
        }
      }

      if (
        player &&
        distance(
          player.x,
          player.y,
          enemy.x,
          enemy.y
        ) <
          player.size +
          enemy.size / 2
      ) {

        enemies.splice(i, 1);

        damagePlayer();

        continue;
      }

      if (
        enemy.y >
          innerHeight + 100 ||
        enemy.x <
          -100 ||
        enemy.x >
          innerWidth + 100
      ) {

        enemies.splice(i, 1);
      }
    }

    /* Bullets */

    for (
      let i =
        bullets.length - 1;
      i >= 0;
      i--
    ) {

      const bullet =
        bullets[i];

      bullet.x +=
        bullet.vx *
        bullet.speed *
        dt;

      bullet.y +=
        bullet.vy *
        bullet.speed *
        dt;

      bullet.life--;

      if (
        bullet.life <= 0 ||
        bullet.x < -100 ||
        bullet.x > innerWidth + 100 ||
        bullet.y < -100 ||
        bullet.y > innerHeight + 100
      ) {

        bullets.splice(i, 1);
      }
    }

    /* Pickups */

    for (
      let i =
        pickups.length - 1;
      i >= 0;
      i--
    ) {

      const pickup =
        pickups[i];

      pickup.y +=
        75 * dt;

      pickup.pulse +=
        dt * 4;

      if (
        player &&
        distance(
          player.x,
          player.y,
          pickup.x,
          pickup.y
        ) <
          45
      ) {

        applyPickup(pickup);

        pickups.splice(i, 1);

        continue;
      }

      if (
        pickup.y >
        innerHeight + 60
      ) {
        pickups.splice(i, 1);
      }
    }

    /* Explosions */

    for (
      let i =
        explosions.length - 1;
      i >= 0;
      i--
    ) {

      const explosion =
        explosions[i];

      explosion.radius +=
        150 * dt;

      explosion.alpha -=
        2.5 * dt;

      if (
        explosion.radius >
          explosion.maxRadius ||
        explosion.alpha <= 0
      ) {

        explosions.splice(i, 1);
      }
    }

    /* Particles */

    updateParticles(dt);

    /* Combo */

    if (comboTimer > 0) {

      comboTimer -= dt;

      if (comboTimer <= 0) {
        combo = 1;
      }
    }

    /* Spawn */

    spawnTimer += dt;

    spawnInterval =
      Math.max(
        0.8,
        3.8 -
        level * .08
      );

    if (
      spawnTimer >=
      spawnInterval
    ) {

      spawnEnemyWave();

      spawnTimer = 0;

      waveEnemyKills = 0;
    }

    updateUI();
  }

  /* =========================================================
     RENDER
  ========================================================= */

  function drawRoundRect(
    x,
    y,
    width,
    height,
    radius
  ) {

    ctx.beginPath();

    ctx.moveTo(
      x + radius,
      y
    );

    ctx.arcTo(
      x + width,
      y,
      x + width,
      y + height,
      radius
    );

    ctx.arcTo(
      x + width,
      y + height,
      x,
      y + height,
      radius
    );

    ctx.arcTo(
      x,
      y + height,
      x,
      y,
      radius
    );

    ctx.arcTo(
      x,
      y,
      x + width,
      y,
      radius
    );

    ctx.closePath();
  }

  function drawBackground() {

    const gradient =
      ctx.createLinearGradient(
        0,
        0,
        0,
        innerHeight
      );

    gradient.addColorStop(
      0,
      "#071936"
    );

    gradient.addColorStop(
      .55,
      "#020719"
    );

    gradient.addColorStop(
      1,
      "#00030c"
    );

    ctx.fillStyle =
      gradient;

    ctx.fillRect(
      0,
      0,
      innerWidth,
      innerHeight
    );

    for (const star of stars) {

      ctx.globalAlpha =
        star.alpha;

      ctx.fillStyle =
        "#ffffff";

      ctx.fillRect(
        star.x,
        star.y,
        star.size,
        star.size
      );
    }

    ctx.globalAlpha = 1;
  }

  function drawPlayer() {

    if (!player) return;

    const x = player.x;
    const y = player.y;
    const size = player.size;

    ctx.save();

    ctx.shadowColor =
      "#6ffcff";

    ctx.shadowBlur = 25;

    ctx.fillStyle =
      "#6ffcff";

    if (
      player.appearance === 0
    ) {

      ctx.beginPath();

      ctx.moveTo(
        x,
        y - size
      );

      ctx.lineTo(
        x - size * .65,
        y + size * .55
      );

      ctx.lineTo(
        x,
        y + size * .25
      );

      ctx.lineTo(
        x + size * .65,
        y + size * .55
      );

      ctx.closePath();

      ctx.fill();

    } else if (
      player.appearance === 1
    ) {

      ctx.beginPath();

      ctx.ellipse(
        x,
        y,
        size * .72,
        size * .4,
        0,
        0,
        Math.PI * 2
      );

      ctx.fill();

    } else {

      ctx.beginPath();

      ctx.moveTo(
        x,
        y - size
      );

      ctx.lineTo(
        x - size * .8,
        y + size * .6
      );

      ctx.lineTo(
        x,
        y + size * .25
      );

      ctx.lineTo(
        x + size * .8,
        y + size * .6
      );

      ctx.closePath();

      ctx.fill();
    }

    /* Core */

    ctx.shadowBlur = 10;

    ctx.fillStyle =
      "#ffffff";

    ctx.beginPath();

    ctx.arc(
      x,
      y - 3,
      4,
      0,
      Math.PI * 2
    );

    ctx.fill();

    /* Turrets */

    for (
      let i = 0;
      i < player.turrets;
      i++
    ) {

      const angle =
        -Math.PI / 2 +
        (
          i -
          (player.turrets - 1) / 2
        ) *
        .25;

      const tx =
        x +
        Math.cos(angle) *
          size * .75;

      const ty =
        y +
        Math.sin(angle) *
          size * .75;

      ctx.fillStyle =
        "#ffd37a";

      ctx.beginPath();

      ctx.arc(
        tx,
        ty,
        5,
        0,
        Math.PI * 2
      );

      ctx.fill();
    }

    ctx.restore();
  }

  function drawEnemies() {

    for (const enemy of enemies) {

      ctx.save();

      ctx.shadowColor =
        enemy.color;

      ctx.shadowBlur = 18;

      ctx.fillStyle =
        enemy.color;

      drawRoundRect(
        enemy.x - enemy.size / 2,
        enemy.y - enemy.size / 2,
        enemy.size,
        enemy.size,
        9
      );

      ctx.fill();

      ctx.fillStyle =
        "rgba(255,255,255,.15)";

      drawRoundRect(
        enemy.x - enemy.size * .23,
        enemy.y - enemy.size * .20,
        enemy.size * .46,
        enemy.size * .18,
        5
      );

      ctx.fill();

      /* HP */

      if (
        enemy.hp < enemy.maxHp
      ) {

        const width =
          enemy.size;

        ctx.fillStyle =
          "rgba(0,0,0,.45)";

        ctx.fillRect(
          enemy.x - width / 2,
          enemy.y - enemy.size / 2 - 8,
          width,
          3
        );

        ctx.fillStyle =
          "#77ffae";

        ctx.fillRect(
          enemy.x - width / 2,
          enemy.y - enemy.size / 2 - 8,
          width *
            (enemy.hp /
              enemy.maxHp),
          3
        );
      }

      ctx.restore();
    }
  }

  function drawBullets() {

    for (const bullet of bullets) {

      const radius =
        bullet.radius;

      const gradient =
        ctx.createRadialGradient(
          bullet.x,
          bullet.y,
          0,
          bullet.x,
          bullet.y,
          radius * 3
        );

      gradient.addColorStop(
        0,
        "rgba(255,255,255,1)"
      );

      gradient.addColorStop(
        .25,
        "rgba(110,240,255,.95)"
      );

      gradient.addColorStop(
        1,
        "rgba(90,130,255,0)"
      );

      ctx.fillStyle =
        gradient;

      ctx.beginPath();

      ctx.arc(
        bullet.x,
        bullet.y,
        radius * 2.3,
        0,
        Math.PI * 2
      );

      ctx.fill();
    }
  }

  function drawPickups() {

    for (const pickup of pickups) {

      const pulse =
        1 +
        Math.sin(
          pickup.pulse
        ) *
        .12;

      ctx.save();

      ctx.translate(
        pickup.x,
        pickup.y
      );

      ctx.scale(
        pulse,
        pulse
      );

      ctx.shadowBlur = 20;

      let color =
        "#ffd166";

      if (
        pickup.type === "shield"
      ) {
        color = "#62f6a2";
      }

      if (
        pickup.type === "power"
      ) {
        color = "#6ffcff";
      }

      if (
        pickup.type === "fireRate"
      ) {
        color = "#b78cff";
      }

      ctx.shadowColor =
        color;

      ctx.fillStyle =
        color;

      ctx.beginPath();

      ctx.arc(
        0,
        0,
        pickup.radius,
        0,
        Math.PI * 2
      );

      ctx.fill();

      ctx.fillStyle =
        "#03111c";

      ctx.font =
        "bold 10px Arial";

      ctx.textAlign =
        "center";

      ctx.textBaseline =
        "middle";

      const icon =
        pickup.type === "score"
          ? "+"
          : pickup.type === "shield"
          ? "S"
          : pickup.type === "power"
          ? "P"
          : "F";

      ctx.fillText(
        icon,
        0,
        0
      );

      ctx.restore();
    }
  }

  function drawAllies() {

    for (const npc of npcs) {

      ctx.save();

      ctx.shadowColor =
        "#8a9bff";

      ctx.shadowBlur = 17;

      ctx.fillStyle =
        "#8195ff";

      ctx.beginPath();

      ctx.moveTo(
        npc.x,
        npc.y - npc.size / 2
      );

      ctx.lineTo(
        npc.x - npc.size / 2,
        npc.y + npc.size / 2
      );

      ctx.lineTo(
        npc.x + npc.size / 2,
        npc.y + npc.size / 2
      );

      ctx.closePath();

      ctx.fill();

      ctx.restore();
    }
  }

  function drawExplosions() {

    for (const explosion of explosions) {

      ctx.save();

      ctx.globalAlpha =
        explosion.alpha;

      ctx.fillStyle =
        "#ffb36b";

      ctx.shadowColor =
        "#ff7b48";

      ctx.shadowBlur = 30;

      ctx.beginPath();

      ctx.arc(
        explosion.x,
        explosion.y,
        explosion.radius,
        0,
        Math.PI * 2
      );

      ctx.fill();

      ctx.restore();
    }
  }

  function drawParticles() {

    for (const p of particles) {

      ctx.globalAlpha =
        Math.max(
          0,
          p.life
        );

      ctx.fillStyle =
        "#bafaff";

      ctx.beginPath();

      ctx.arc(
        p.x,
        p.y,
        p.size,
        0,
        Math.PI * 2
      );

      ctx.fill();
    }

    ctx.globalAlpha = 1;
  }

  function render() {

    drawBackground();

    drawEnemies();
    drawPickups();
    drawBullets();
    drawAllies();

    drawParticles();
    drawExplosions();

    drawPlayer();
  }

  /* =========================================================
     MAIN LOOP
  ========================================================= */

  function gameLoop(time) {

    const dt =
      Math.min(
        .04,
        (time - lastTime) / 1000
      );

    lastTime = time;

    update(dt);
    render();

    gameLoopId =
      requestAnimationFrame(
        gameLoop
      );
  }

  /* =========================================================
     START / PAUSE / RESET
  ========================================================= */

  function startGame() {

    ensureAudio();

    if (!gameStarted) {

      resetGameState();

      gameStarted = true;
    }

    running = true;
    paused = false;

    pauseBtn.textContent =
      "⏸ إيقاف";

    startBtn.textContent =
      "🚀 شغال";

    if (musicOn) {
      startMusic();
    }

    engineHumStart();
  }

  function resetGameState() {

    score = 0;
    level = 1;

    kills = 0;
    combo = 1;

    wave = 0;

    spawnTimer = 0;

    bullets = [];
    enemies = [];
    pickups = [];
    explosions = [];
    particles = [];
    npcs = [];

    player =
      createPlayer();

    spawnEnemyWave(4);

    for (
      let i = 0;
      i < (upgrades.allies || 0);
      i++
    ) {
      spawnAlly();
    }

    updateUI();
  }

  function resetGame() {

    gameStarted = true;

    running = true;
    paused = false;

    resetGameState();

    closeAllModals();

    lastTime =
      performance.now();

    ensureAudio();

    if (musicOn) {
      startMusic();
    }

    engineHumStart();
  }

  function togglePause() {

    if (!gameStarted) {
      startGame();
      return;
    }

    paused = !paused;

    pauseBtn.textContent =
      paused
        ? "▶ متابعة"
        : "⏸ إيقاف";

    if (paused) {

      engineHumStop();
      stopMusic();

    } else {

      engineHumStart();

      if (musicOn) {
        startMusic();
      }
    }
  }

  /* =========================================================
     GAME OVER
  ========================================================= */

  function endGame() {

    running = false;

    engineHumStop();
    stopMusic();

    if (score > highScore) {

      highScore =
        Math.floor(score);

      localStorage.setItem(
        "fx_high",
        String(highScore)
      );
    }

    finalScore.textContent =
      `نقاطك: ${Math.floor(score)}`;

    finalLevel.textContent =
      level;

    finalKills.textContent =
      kills;

    finalHigh.textContent =
      highScore;

    gameOverScreen.classList.add(
      "show"
    );

    updateUI();
  }

  /* =========================================================
     SHOP
  ========================================================= */

  function openShop() {

    closeAllModals();

    shopScore.textContent =
      Math.floor(score);

    shopItems.innerHTML = "";

    const items = [

      {
        id: "speed",
        title: "⚡ سرعة السفينة",
        desc: "زيادة سرعة الحركة",
        cost: 500
      },

      {
        id: "power",
        title: "💥 قوة السلاح",
        desc: "زيادة ضرر الطلقات",
        cost: 700
      },

      {
        id: "shots",
        title: "🔫 عدد الطلقات",
        desc: "إضافة طلقة إضافية",
        cost: 900
      },

      {
        id: "shield",
        title: "🛡 الدرع",
        desc: "زيادة HP للسفينة",
        cost: 600
      },

      {
        id: "turret",
        title: "🔫 مدفع إضافي",
        desc: "تركيب مدفع جانبي",
        cost: 900
      },

      {
        id: "ally",
        title: "🤖 سفينة مساعدة",
        desc: "تضيف حليفًا يطلق النار",
        cost: 1200
      },

      {
        id: "appearance",
        title: "✨ شكل جديد",
        desc: "تغيير شكل السفينة",
        cost: 800
      }
    ];

    for (const item of items) {

      const wrapper =
        document.createElement("div");

      wrapper.className =
        "shopItem";

      wrapper.innerHTML = `
        <div>
          <strong>${item.title}</strong>
          <span>${item.desc}</span>
          <span class="price">
            ${item.cost} نقطة
          </span>
        </div>

        <button>
          شراء
        </button>
      `;

      const buyButton =
        wrapper.querySelector(
          "button"
        );

      buyButton.addEventListener(
        "click",
        () => {

          if (score < item.cost) {
            showToast(
              "❌ نقاط غير كافية"
            );
            return;
          }

          score -= item.cost;

          purchaseUpgrade(
            item.id
          );

          shopScore.textContent =
            Math.floor(score);

          updateUI();

          showToast(
            "✅ تم شراء الترقية"
          );
        }
      );

      shopItems.appendChild(
        wrapper
      );
    }

    shopModal.classList.add(
      "show"
    );
  }

  function purchaseUpgrade(id) {

    if (!player) {
      player =
        createPlayer();
    }

    switch (id) {

      case "speed":

        upgrades.speed++;

        player.speed += 18;

        break;

      case "power":

        upgrades.power++;

        player.weapon.power++;

        break;

      case "shots":

        upgrades.shots++;

        player.weapon.shots++;

        break;

      case "shield":

        upgrades.shield++;

        player.maxHp++;
        player.hp++;

        break;

      case "turret":

        upgrades.turrets++;

        player.turrets++;

        break;

      case "ally":

        upgrades.allies++;

        spawnAlly();

        break;

      case "appearance":

        upgrades.appearance =
          (
            upgrades.appearance +
            1
          ) % 3;

        player.appearance =
          upgrades.appearance;

        break;
    }

    saveUpgrades();
    updateUI();
  }

  /* =========================================================
     MISSIONS
  ========================================================= */

  function openMissions() {

    closeAllModals();

    missionBody.innerHTML = `
      <div class="missionCard">
        <strong>
          🎯 مهمة الموجة
        </strong>

        <p>
          اهزم 10 أعداء في موجة واحدة
        </p>

        <p>
          التقدم:
          ${Math.min(
            waveEnemyKills,
            10
          )} / 10
        </p>

        <p>
          المكافأة:
          300 نقطة
        </p>
      </div>

      <div class="missionCard">
        <strong>
          💥 مهمة الكومبو
        </strong>

        <p>
          وصل إلى Combo x5
        </p>

        <p>
          الحالة:
          ${
            combo >= 5
              ? "مكتملة ✅"
              : "قيد التنفيذ"
          }
        </p>

        <p>
          المكافأة:
          500 نقطة
        </p>
      </div>

      <div class="missionCard">
        <strong>
          🚀 مهمة البقاء
        </strong>

        <p>
          الوصول إلى المستوى 10
        </p>

        <p>
          الحالية:
          المستوى ${level}
        </p>
      </div>
    `;

    missionModal.classList.add(
      "show"
    );
  }

  /* =========================================================
     DAILY REWARD
  ========================================================= */

  function checkDailyReward() {

    const today =
      new Date()
        .toISOString()
        .slice(0, 10);

    const saved =
      localStorage.getItem(
        "fx_daily"
      );

    if (saved === today) {
      return;
    }

    localStorage.setItem(
      "fx_daily",
      today
    );

    score += 200;

    dailyBody.innerHTML = `
      <div style="
        margin-top:10px;
        color:#9beaff;
        font-size:14px;
      ">
        🎁 حصلت على
        <strong style="color:#ffd166">
          200 نقطة
        </strong>
      </div>
    `;

    dailyModal.classList.add(
      "show"
    );

    updateUI();
  }

  /* =========================================================
     SETTINGS
  ========================================================= */

  function updateSettingsUI() {

    musicState.textContent =
      musicOn
        ? "On"
        : "Off";

    toggleMusicBtn.textContent =
      musicOn
        ? "إيقاف"
        : "تشغيل";

    freeAimState.textContent =
      freeAim.checked
        ? "On"
        : "Off";

    masterVol.value =
      localStorage.getItem(
        "fx_volume"
      ) || "0.7";
  }

  /* =========================================================
     MODAL HELPERS
  ========================================================= */

  function closeAllModals() {

    document
      .querySelectorAll(".modal")
      .forEach(modal => {
        modal.classList.remove(
          "show"
        );
      });
  }

  function showToast(message) {

    const old =
      document.getElementById(
        "fxToast"
      );

    if (old) old.remove();

    const toast =
      document.createElement(
        "div"
      );

    toast.id =
      "fxToast";

    toast.textContent =
      message;

    Object.assign(
      toast.style,
      {
        position: "fixed",
        left: "50%",
        bottom: "22px",
        transform:
          "translateX(-50%)",
        zIndex: "1000",
        padding: "11px 17px",
        borderRadius: "13px",
        background:
          "rgba(5,14,28,.90)",
        border:
          "1px solid rgba(104,247,255,.24)",
        color: "#dffcff",
        fontSize: "12px",
        backdropFilter: "blur(12px)",
        boxShadow:
          "0 12px 35px rgba(0,0,0,.35)"
      }
    );

    document.body.appendChild(
      toast
    );

    setTimeout(() => {
      toast.remove();
    }, 1600);
  }

  /* =========================================================
     EVENTS
  ========================================================= */

  startBtn.addEventListener(
    "click",
    startGame
  );

  pauseBtn.addEventListener(
    "click",
    togglePause
  );

  retryBtn.addEventListener(
    "click",
    resetGame
  );

  document
    .getElementById("tryAgain")
    .addEventListener(
      "click",
      () => {
        resetGame();
      }
    );

  document
    .getElementById("goShop")
    .addEventListener(
      "click",
      openShop
    );

  shopBtn.addEventListener(
    "click",
    openShop
  );

  missionsBtn.addEventListener(
    "click",
    openMissions
  );

  settingsBtn.addEventListener(
    "click",
    () => {

      closeAllModals();

      updateSettingsUI();

      settingsModal.classList.add(
        "show"
      );
    }
  );

  closeShop.addEventListener(
    "click",
    () => {
      shopModal.classList.remove(
        "show"
      );
    }
  );

  closeMission.addEventListener(
    "click",
    () => {
      missionModal.classList.remove(
        "show"
      );
    }
  );

  closeDaily.addEventListener(
    "click",
    () => {
      dailyModal.classList.remove(
        "show"
      );
    }
  );

  closeSettings.addEventListener(
    "click",
    () => {
      settingsModal.classList.remove(
        "show"
      );
    }
  );

  toggleMusicBtn.addEventListener(
    "click",
    toggleMusic
  );

  masterVol.addEventListener(
    "input",
    event => {
      setMasterVolume(
        Number(event.target.value)
      );
    }
  );

  autoFire.addEventListener(
    "change",
    () => {
      localStorage.setItem(
        "fx_autofire",
        autoFire.checked
          ? "on"
          : "off"
      );
    }
  );

  freeAim.addEventListener(
    "change",
    () => {
      localStorage.setItem(
        "fx_freeaim",
        freeAim.checked
          ? "on"
          : "off"
      );

      updateSettingsUI();
    }
  );

  controlModeEl.addEventListener(
    "change",
    event => {

      controlMode =
        event.target.value;

      localStorage.setItem(
        "fx_control",
        controlMode
      );

      adjustTouchUI();
    }
  );

  /* =========================================================
     ESCAPE
  ========================================================= */

  window.addEventListener(
    "keydown",
    event => {

      if (
        event.code === "Escape"
      ) {
        closeAllModals();
      }
    }
  );

  /* =========================================================
     AUTO SAVE
  ========================================================= */

  window.addEventListener(
    "beforeunload",
    () => {

      saveUpgrades();

      localStorage.setItem(
        "fx_high",
        String(highScore)
      );

      localStorage.setItem(
        "fx_control",
        controlMode
      );
    }
  );

  /* =========================================================
     INITIALIZATION
  ========================================================= */

  const savedAutoFire =
    localStorage.getItem(
      "fx_autofire"
    );

  autoFire.checked =
    savedAutoFire === "on";

  const savedFreeAim =
    localStorage.getItem(
      "fx_freeaim"
    );

  freeAim.checked =
    savedFreeAim === "on";

  updateSettingsUI();

  updateUI();

  adjustTouchUI();

  scanGamepads();

  checkDailyReward();

  render();

  if (!gameLoopId) {
    gameLoopId =
      requestAnimationFrame(
        gameLoop
      );
  }

  console.log(
    "🚀 Fun X Space V3 initialized successfully"
  );
});

