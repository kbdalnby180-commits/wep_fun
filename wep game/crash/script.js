// ==================== الأصوات ====================
const soundTakeoff = new Audio("sounds/take-off-36682.mp3");
const soundExplosion = new Audio("sounds/explosion-312361.mp3");
const soundClick = new Audio("sounds/ui-button-click-5-327756.mp3");

// ==================== إعدادات اللعبة ====================
const MIN_BET = 10;
const INITIAL_BALANCE = 50.0;
const TICK_MS = 50;
const STEP = 0.02;

let balance = parseFloat(localStorage.getItem("balance") || INITIAL_BALANCE);
let multiplier = 1.0;
let crashPoint = 0;
let running = false;
let timer = null;

let userBets = [0];
let userCashed = [false];
let transactions = [];
let aiPlayers = [];

// ==================== عناصر HTML ====================
const elBalance = document.getElementById("balance");
const elMultiplier = document.getElementById("multiplier");
const elResult = document.getElementById("result");
const plane = document.getElementById("plane");
const line = document.getElementById("line");
const explosion = document.getElementById("explosion");
const elTransactionsList = document.getElementById("transactionsList");
const playArea = document.getElementById("playArea");
const playersArea = document.getElementById("playersArea");

// ==================== وظائف الأصوات ====================
function playClick() {
    soundClick.currentTime = 0;
    soundClick.play();
}

// ==================== حفظ الرصيد ====================
function saveState() {
    localStorage.setItem("balance", balance.toFixed(2));
}

function updateBalance() {
    elBalance.innerText = `رصيدك: ${balance.toFixed(2)} جنيه`;
    saveState();
}

// ==================== إدارة المعاملات ====================
function pushTransaction(obj) {
    transactions.unshift(obj);
    renderTransactions();
}

function renderTransactions() {
    if (transactions.length === 0) {
        elTransactionsList.innerText = 'لا توجد معاملات بعد';
        return;
    }

    elTransactionsList.innerHTML = transactions.map(t => {
        switch(t.type) {
            case 'cashout':
                return `<div>✅ <b>${t.player}</b> سحب عند <b>x${t.at}</b> — رهان: <b>${t.bet} ج</b> — كسب: <b>${t.won} ج</b></div>`;
            case 'loss':
                return `<div>❌ <b>${t.player}</b> خسر — رهان: <b>${t.bet} ج</b></div>`;
            case 'deposit':
                return `<div>💰 <b>${t.player || 'محفظتك'}</b> دفع/إيداع: <b>+${t.amount} ج</b></div>`;
        }
    }).join('');
}

// ==================== تحديد نقطة الانفجار ====================
function getCrashPoint() {
    const r = Math.random();
    if (r < 0.55) return parseFloat((1 + Math.random() * 5).toFixed(2));
    if (r < 0.75) return parseFloat((6 + Math.random() * 4).toFixed(2));
    if (r < 0.9) return parseFloat((10 + Math.random() * 6).toFixed(2));
    return parseFloat((16 + Math.random() * 4).toFixed(2));
}

// ==================== إنشاء لاعبين AI ====================
function generatePlayers() {
    playersArea.innerHTML = "";
    aiPlayers = [];

    const n = 10 + Math.floor(Math.random() * 15);
    for (let i = 0; i < n; i++) {
        const pid = maskId("X");
        const bet = 10 + Math.floor(Math.random() * 90);
        const cashAt = (Math.random() < 0.4) ? (1.2 + Math.random() * 8).toFixed(2) : null;

        aiPlayers.push({ id: pid, bet: bet, cashAt: cashAt, cashed: false });

        const card = document.createElement("div");
        card.className = "player-card";
        card.innerHTML = `
            <div class="player-id">${pid}</div>
            <div class="player-bet">رهان: ${bet} ج</div>
            <div class="player-status ok">✅ مستمر</div>
        `;
        playersArea.appendChild(card);
    }
}

// ==================== بدء الجولة ====================
function startBet(index) {
    if (running) { alert("جولة جارية!"); return; }

    transactions = [];
    renderTransactions();

    const input = document.getElementById("bet1");
    const val = parseFloat(input.value);

    if (isNaN(val) || val < MIN_BET) { alert("ادخل رهان صحيح"); return; }
    if (val > balance) { alert("رصيدك غير كافي"); return; }

    playClick();
    balance -= val;
    updateBalance();

    userBets[index] = val;
    userCashed[index] = false;
    multiplier = 1.0;
    elMultiplier.innerText = "x1.00";
    elResult.innerHTML = "";

    crashPoint = getCrashPoint();
    generatePlayers();

    running = true;
    plane.style.right = "0px";
    line.style.width = "0px";
    explosion.style.display = "none";

    soundTakeoff.currentTime = 0; 
    soundTakeoff.play();

    timer = setInterval(() => {
        multiplier = parseFloat((multiplier + STEP).toFixed(2));
        elMultiplier.innerText = `x${multiplier.toFixed(2)}`;

        const maxWidth = playArea.clientWidth - plane.clientWidth;
        const pos = (multiplier / 30) * maxWidth;
        plane.style.right = pos + "px";
        line.style.width = pos + "px";

        // AI players cashout
        aiPlayers.forEach((p, idx) => {
            if (p.cashAt && !p.cashed && multiplier >= p.cashAt && multiplier < crashPoint) {
                p.cashed = true;
                const win = (p.bet * multiplier).toFixed(2);
                pushTransaction({ type: 'cashout', player: p.id, bet: p.bet, at: multiplier.toFixed(2), won: win });
                playersArea.children[idx].querySelector(".player-status").innerText = "سحب";
            }
        });

        // الانفجار
        if (multiplier >= crashPoint) {
            clearInterval(timer);
            running = false;
            explosion.style.width = plane.clientWidth + "px";
            explosion.style.height = plane.clientHeight + "px";
            explosion.style.right = plane.style.right;
            explosion.style.top = plane.style.top;
            explosion.style.display = "block";
            soundExplosion.currentTime = 0; 
            soundExplosion.play();

            userBets.forEach((b, i) => { 
                if (b > 0 && !userCashed[i]) pushTransaction({ type: 'loss', player: maskId('Player' + (i+1)), bet: b }); 
            });

            aiPlayers.forEach((p, idx) => { 
                if (!p.cashed) { 
                    pushTransaction({ type: 'loss', player: p.id, bet: p.bet }); 
                    playersArea.children[idx].querySelector(".player-status").innerText = "❌ خسر"; 
                }
            });

            elResult.innerHTML = `💥 الطيارة تحطمت عند x${crashPoint}`;
        }
    }, TICK_MS);
}

// ==================== السحب ====================
function cashout(i) {
    if (!running || userCashed[i]) return;

    playClick();
    userCashed[i] = true;

    const win = parseFloat((userBets[i] * multiplier).toFixed(2));
    balance += win;
    updateBalance();

    pushTransaction({ type: 'cashout', player: maskId('Player' + (i+1)), bet: userBets[i], at: multiplier.toFixed(2), won: win.toFixed(2) });
}

// ==================== مساعدة ====================
function maskId(id) {
    return `211***${Math.floor(100 + Math.random() * 900)}`;
}

// ==================== أحداث الأزرار ====================
document.getElementById("bet1Start").onclick = () => startBet(0);
document.getElementById("bet1Cash").onclick = () => cashout(0);

// ==================== صفحة الإيداع ====================
document.getElementById("depositPage").onclick = async () => {
    playClick();
    let savedCode = localStorage.getItem("depositCode");
    let amt = prompt("⚠️ الخطوة 1: أدخل مبلغ الإيداع (20 - 60000):");
    if (!amt) return;
    amt = parseFloat(amt);
    if (isNaN(amt) || amt < 20 || amt > 60000) { alert("❌ المبلغ غير صالح!"); return; }

    if (!savedCode) {
        let code = prompt("🔐 الخطوة 2: اختر رمز أمان 4 أرقام:");
        if (!code || !/^\d{4}$/.test(code)) { alert("❌ الرمز غير صالح!"); return; }
        localStorage.setItem("depositCode", code);
        savedCode = code;
        alert("✅ تم حفظ الرمز للأبد!");
    }

    let inputCode = prompt("🔑 الخطوة 3: أدخل رمز الأمان:");
    if (inputCode !== savedCode) {
        alert("❌ الرمز غير صحيح! تابع الخطوات لحله...");
        const steps = ["اجمع الأرقام: 12 + 34", "اطرح 15 من النتيجة", "اقسم الناتج على 7", "اضرب الناتج في 3", "اطرح 5"];
        for (let i = 0; i < steps.length; i++) {
            let ans = prompt(`🔧 خطوة ${i+1}: ${steps[i]}`);
            if (ans === null) { alert("❌ تم إلغاء العملية"); return; }
            if (isNaN(parseFloat(ans))) { alert("❌ إدخال غير صالح"); i--; continue; }
        }
        alert(`✅ أحسنت! الرمز هو: ${savedCode}`);
        return;
    }

    balance += amt;
    updateBalance();
    pushTransaction({ type: 'deposit', amount: amt });
    alert("تم الإيداع بنجاح!");
}

// ==================== تهيئة اللعبة ====================
updateBalance();
renderTransactions();
