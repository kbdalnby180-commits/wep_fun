// ===== النجوم =====
for (let i = 0; i < 60; i++) {
    const star = document.createElement('div');
    star.className = 'star';
    star.style.top = Math.random() * 100 + '%';
    star.style.left = Math.random() * 100 + '%';
    star.style.width = star.style.height = Math.random() * 2 + 1 + 'px';
    document.body.appendChild(star);
}

// ===== القمر/الشمس =====
const celestial = document.getElementById('celestial');
function updateCelestial() {
    const now = new Date();
    const h = now.getHours();
    if (h >= 6 && h < 18) {
        document.body.style.background = "linear-gradient(180deg,#87CEEB,#FFD700)";
        celestial.style.background = "radial-gradient(circle,#FFD700,#FFA500)";
    } else {
        document.body.style.background = "#000";
        celestial.style.background = "radial-gradient(circle,#fff,#ccc)";
    }
}
setInterval(updateCelestial, 1000);
updateCelestial();

// ===== إشعار مرة واحدة =====
const notify = document.getElementById('notify');
if (notify && !localStorage.getItem('updateSeen')) {
    notify.style.display = 'block';
    notify.onclick = () => {
        localStorage.setItem('updateSeen', 'true');
        alert("📢 تفاصيل التحديث 1.5: تحسينات للهاتف والكمبيوتر!");
    };
}

// ===== ساعة وتاريخ =====
function updateClock() {
    const now = new Date();
    document.getElementById('clock').textContent =
        now.getHours().toString().padStart(2, '0') + ":" +
        now.getMinutes().toString().padStart(2, '0') + ":" +
        now.getSeconds().toString().padStart(2, '0');
    document.getElementById('calendar').textContent =
        now.getDate().toString().padStart(2, '0') + "/" +
        (now.getMonth() + 1).toString().padStart(2, '0') + "/" + now.getFullYear();
}
setInterval(updateClock, 1000);
updateClock();

// ===== القائمة الجانبية =====
const menuToggle = document.getElementById('menuToggle');
const sideMenu = document.getElementById('sideMenu');
let menuOpen = false;
if (menuToggle) {
    menuToggle.addEventListener('click', () => {
        sideMenu.style.right = menuOpen ? '-100%' : '0';
        menuOpen = !menuOpen;
    });
}

// ===== الشات بوت =====
const chatToggle = document.getElementById('chatToggle');
const chatbot = document.getElementById('chatbot');
const sendBtn = document.getElementById('sendBtn');
const chatInput = document.getElementById('chatInput');
const chatMessages = document.getElementById('chatMessages');

if (chatToggle) {
    chatToggle.addEventListener('click', () => {
        chatbot.classList.toggle('hidden');
    });
}

function addMessage(sender, text) {
    const msg = document.createElement('div');
    msg.className = sender;
    msg.textContent = text;
    chatMessages.appendChild(msg);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

function botReply(userText) {
    let reply = "🤖 مش فاهم قصدك، جرّب تكتب حاجة تانية.";

    const routes = {
        "game war": ["🎮 Game War", "wep game/game war/index.html"],
        "game question": ["❓ Game Question", "wep game/Who will win the million/index.html"],
        "plan x": ["🛫 Plan X", "wep game/crash/CRASH.html"],
        "تداول": ["💰 لعبة التداول", "wep game/Trade/index.html"],
        "صراحة": ["🎲 لعبة الصراحة والجرأة", "wep game/Truth or Dare/index.html"],
        "إخفاء": ["📱 لعبة إخفاء الهاتف", "wep game/Hide phone game/index.html"],
        "xo": ["❌⭕ لعبة X&O", "wep game/X&O game/index.html"],
        "ورق": ["🎴 لعبة الورق المتشابه", "wep game/Matching card game/index.html"],
        "التحديات": ["🔥 لعبة التحديات", "wep game/Challenges game/index.html"],
        "رسم": ["🎨 تطبيق الرسم", "wep app/paints/index.html"],
        "quran": ["🕋 القرآن الكريم", "wep app/quran/index.html"],
        "سبحة": ["📿 السبحة الإلكترونية", "wep app/Electronic rosary/index.html"],
        "مذاكرة": ["📖 مساعد المذاكرة", "wep app/Study assistant/index.html"],
        "نصيحة": ["💡 نصيحة يومية", "wep app/daily-tip/index.html"],
        "qr": ["🔗 صنع QR", "wep app/qr/index.html"],
        "عن الموقع": ["ℹ️ معلومات عن الموقع", "tool/Fun X/index.html"],
        "تحديث": ["🆕 صفحة التحديثات", "tool/update.html"]
    };

    for (let key in routes) {
        if (userText.toLowerCase().includes(key)) {
            reply = `✅ ${routes[key][0]}`;
            setTimeout(() => window.location.href = routes[key][1], 1500);
            break;
        }
    }

    addMessage("bot", reply);
}

if (sendBtn) {
    sendBtn.addEventListener('click', () => {
        const text = chatInput.value.trim();
        if (!text) return;
        addMessage("user", text);
        chatInput.value = "";
        setTimeout(() => botReply(text), 500);
    });
}
