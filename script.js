/* ==================== أوقات الأذان ==================== */

const prayerTimes = {
    fajr: { time: "05:10", name: "الفجر" },
    dhuhr: { time: "12:00", name: "الظهر" },
    asr: { time: "15:15", name: "العصر" },
    maghrib: { time: "17:00", name: "المغرب" },
    isha: { time: "18:20", name: "العشاء" }
};

const adhanAudio = new Audio("audio/adhan.mp3");

function getNextPrayer() {
    const now = new Date();
    const today = now.toISOString().split("T")[0];

    let next = null;
    let nextKey = "";

    for (let key in prayerTimes) {
        const t = new Date(`${today} ${prayerTimes[key].time}`);
        if (t > now) {
            next = t;
            nextKey = key;
            break;
        }
    }

    if (!next) {
        nextKey = "fajr";
        next = new Date(`${today} ${prayerTimes.fajr.time}`);
        next.setDate(next.getDate() + 1);
    }

    return { next, nextKey, nextName: prayerTimes[nextKey].name };
}

const countdownBox = document.createElement("div");
countdownBox.id = "adhanCountdown";
countdownBox.style.cssText = `
    position: fixed;
    top: 85px;
    right: 10px;
    background: rgba(0,0,0,0.7);
    padding: 10px 15px;
    border-radius: 10px;
    font-size: 16px;
    color: #0ff;
    z-index: 2000;
    box-shadow: 0 0 10px #0ff;
`;
document.body.appendChild(countdownBox);

function updateAdhanCountdown() {
    const now = new Date();
    const { next, nextKey, nextName } = getNextPrayer();
    let diff = Math.floor((next - now) / 1000);

    if (diff <= 0) {
        showAdhanPopup(nextName);
        adhanAudio.play();
        setTimeout(updateAdhanCountdown, 60000);
        return;
    }

    const h = Math.floor(diff / 3600);
    const m = Math.floor((diff % 3600) / 60);
    const s = diff % 60;

    countdownBox.textContent =
        `متبقي على صلاة ${nextName}: ${h} ساعة ${m} دقيقة ${s} ثانية`;

    setTimeout(updateAdhanCountdown, 1000);
}
updateAdhanCountdown();

function showAdhanPopup(prayerName) {
    const popup = document.createElement("div");
    popup.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: rgba(0,0,0,0.9);
        padding: 20px;
        color: #0ff;
        font-size: 22px;
        border-radius: 15px;
        text-align: center;
        z-index: 3000;
        box-shadow: 0 0 20px cyan;
    `;
    popup.innerHTML = `
        <h3>📢 حان الآن موعد صلاة <span style="color:yellow">${prayerName}</span></h3>
        <button id="closeAdhanPopup" style="
            margin-top: 15px;
            padding: 10px 20px;
            font-size: 16px;
            border:none;
            border-radius:8px;
            background:#0ff;
            color:#000;
            cursor:pointer;">إغلاق</button>
    `;
    document.body.appendChild(popup);
    document.getElementById("closeAdhanPopup").onclick = () => popup.remove();
}

/* ==================== الخلفيات والنجوم والثلج ==================== */

for (let i = 0; i < 60; i++) {
    const star = document.createElement('div');
    star.className = 'star';
    star.style.top = Math.random() * 100 + '%';
    star.style.left = Math.random() * 100 + '%';
    star.style.width = star.style.height = Math.random() * 2 + 1 + 'px';
    document.body.appendChild(star);
}

for (let i = 0; i < 80; i++) {
    const snow = document.createElement('div');
    snow.className = 'snowflake';
    snow.textContent = '❄';
    snow.style.left = Math.random() * 100 + '%';
    snow.style.fontSize = 10 + Math.random() * 20 + 'px';
    snow.style.animationDuration = 3 + Math.random() * 5 + 's';
    snow.style.opacity = Math.random();
    document.body.appendChild(snow);
}

for (let i = 0; i < 20; i++) {
    const santa = document.createElement('div');
    santa.className = 'santa';
    santa.textContent = '🎅';
    santa.style.left = Math.random() * 100 + '%';
    santa.style.animationDuration = (5 + Math.random() * 5) + 's';
    document.body.appendChild(santa);
}

const celestial = document.getElementById('celestial');
function updateCelestial() {
    const h = new Date().getHours();
    if (h >= 6 && h < 18) {
        document.body.style.background = "linear-gradient(to bottom,#82ccdd,#a0e1ff)";
        celestial.style.background = "radial-gradient(circle,#fff,#cce6ff)";
    } else {
        document.body.style.background = "linear-gradient(to bottom,#0a3d62,#1e3799)";
        celestial.style.background = "radial-gradient(circle,#cce6ff,#99ccff)";
    }
}
setInterval(updateCelestial, 1000);
updateCelestial();

/* ==================== ساعة وتاريخ ==================== */

function updateClock() {
    const now = new Date();
    document.getElementById('clock').textContent =
        now.getHours().toString().padStart(2, '0') + ":" +
        now.getMinutes().toString().padStart(2, '0') + ":" +
        now.getSeconds().toString().padStart(2, '0');

    document.getElementById('calendar').textContent =
        now.getDate().toString().padStart(2, '0') + "/" +
        (now.getMonth() + 1).toString().padStart(2, '0') + "/" +
        now.getFullYear();
}
setInterval(updateClock, 1000);
updateClock();

/* ==================== روبوت الدردشة ==================== */

const chatToggle = document.getElementById('chatToggle');
const chatbot = document.getElementById('chatbot');
const chatMessages = document.getElementById('chatMessages');
const chatInput = document.getElementById('chatInput');
const sendBtn = document.getElementById('sendBtn');

chatToggle.addEventListener('click', () => { chatbot.classList.toggle('hidden'); });

const pages = [
    { name: "🎮 Game War", url: "wep game/game war/index.html" },
    { name: "❓ Game Question", url: "wep game/Who will win the million/index.html" },
    { name: "🎲 صراحة", url: "wep game/Truth or Dare/index.html" },
    { name: "📱 إخفاء الهاتف", url: "wep game/Hide phone game/index.html" },
    { name: "❌⭕ X&O", url: "wep game/X&O game/index.html" },
    { name: "🎴 الورق المتشابه", url: "wep game/Matching card game/index.html" },
    { name: "🔥 التحديات", url: "wep game/Challenges game/index.html" },
    { name: "🎨 رسم", url: "wep app/paints/index.html" },
    { name: "🕋 Quran", url: "wep app/quran/index.html" },
    { name: "📿 السبحة الإلكترونية", url: "wep app/Electronic rosary/index.html" },
    { name: "📖 مذاكرة", url: "wep app/Study assistant/index.html" },
    { name: "📚 مذاكرة", url: "wep app/study_page_html/index.html" },
    { name: "💡 نصيحة يومية", url: "wep app/daily-tip/index.html" },
    { name: "🔗 صنع QR", url: "wep app/qr/index.html" },
    { name: "💣FUN X SPACE💣", url: "wep game/funx_space_v2/index.html" },
    { name: " FUN X LEARN HTML💻 ", url: "tool/FUN X LEARN HTML/index.html" },
    { name: " 🛫CRASH🛫 ", url: "wep game/crash/CRASH.html" },
    { name: " 💵TRADE💵 ", url: "wep game/Trade/index.html" },
    { name: "INFO WEP  ", url: "tool/Fun X/index.html" },
];

pages.forEach(p => {
    const div = document.createElement('div');
    div.className = 'bot';
    div.innerHTML = `<a href="${p.url}" target="_blank" style="color:#0ff;text-decoration:none;">${p.name}</a>`;
    chatMessages.appendChild(div);
});

function addMessage(sender, text) {
    const msg = document.createElement('div');
    msg.className = sender;
    msg.textContent = text;
    chatMessages.appendChild(msg);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

function botReply(userText) {
    let reply = "🤖 مش فاهم قصدك، جرّب تكتب حاجة تانية.";
    pages.forEach(p => {
        if (userText.toLowerCase().includes(p.name.replace(/[^a-zA-Z\u0600-\u06FF]/g, "").toLowerCase())) {
            reply = `✅ ${p.name}`;
            setTimeout(() => window.open(p.url, "_blank"), 500);
        }
    });
    addMessage("bot", reply);
}

sendBtn.addEventListener('click', () => {
    const text = chatInput.value.trim();
    if (!text) return;
    addMessage("user", text);
    chatInput.value = "";
    setTimeout(() => botReply(text), 500);
});

document.body.appendChild(shareDiv);

// أصوات تفاعلية
const clickSound = new Audio("audio/click.mp3");
document.body.addEventListener("click", () => clickSound.play());
