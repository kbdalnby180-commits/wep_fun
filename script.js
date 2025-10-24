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

// ===== الروبوت =====
const chatToggle = document.getElementById('chatToggle');
const chatbot = document.getElementById('chatbot');
const chatMessages = document.getElementById('chatMessages');
const chatInput = document.getElementById('chatInput');
const sendBtn = document.getElementById('sendBtn');

chatToggle.addEventListener('click', () => {
    chatbot.classList.toggle('hidden');
});

// صفحات الموقع للعرض المباشر
const pages = [
    {name:"🎮 Game War", url:"wep game/game war/index.html"},
    {name:"space war 🎮", url:"wep game/funx_space_v2/index.html"},
    {name:"❓ Game Question", url:"wep game/Who will win the million/index.html"},
    {name:"🛫 Plan X 🛫", url:"wep game/crash/CRASH.html"},
    {name:"💰 تداول", url:"wep game/Trade/index.html"},
    {name:"🎲 صراحة", url:"wep game/Truth or Dare/index.html"},
    {name:"📱 إخفاء الهاتف", url:"wep game/Hide phone game/index.html"},
    {name:"❌⭕ X&O", url:"wep game/X&O game/index.html"},
    {name:"🎴 الورق المتشابه", url:"wep game/Matching card game/index.html"},
    {name:"🔥 التحديات", url:"wep game/Challenges game/index.html"},
    {name:"🎨 رسم", url:"wep app/paints/index.html"},
    {name:"🕋 Quran", url:"wep app/quran/index.html"},
    {name:"📿 السبحة الإلكترونية", url:"wep app/Electronic rosary/index.html"},
    {name:"📖 مذاكرة", url:"wep app/Study assistant/index.html"},
    {name:"💡 نصيحة يومية", url:"wep app/daily-tip/index.html"},
    {name:"🔗 صنع QR", url:"wep app/qr/index.html"},
    {name:"ℹ️ عن الموقع", url:"tool/Fun X/index.html"},
     {name:"login wep 🙎‍♂️",url:"https://82fa57e2-9a07-41bd-a869-86ae336863dc-00-2861nct653a21.picard.replit.dev/"},
];

// عرض الصفحات مباشرة
pages.forEach(p => {
    const div = document.createElement('div');
    div.className = 'bot';
    div.innerHTML = `<a href="${p.url}" target="_blank" style="color:#0ff;text-decoration:none;">${p.name}</a>`;
    chatMessages.appendChild(div);
});

// الرد على المستخدم إذا كتب شيء
function addMessage(sender, text){
    const msg = document.createElement('div');
    msg.className = sender;
    msg.textContent = text;
    chatMessages.appendChild(msg);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

function botReply(userText){
    let reply = "🤖 مش فاهم قصدك، جرّب تكتب حاجة تانية.";
    pages.forEach(p=>{
        if(userText.toLowerCase().includes(p.name.replace(/[^a-zA-Z\u0600-\u06FF]/g,"").toLowerCase())){
            reply = `✅ ${p.name}`;
            setTimeout(()=> window.open(p.url,"_blank"),500);
        }
    });
    addMessage("bot",reply);
}

sendBtn.addEventListener('click',()=>{
    const text = chatInput.value.trim();
    if(!text) return;
    addMessage("user", text);
    chatInput.value = "";
    setTimeout(()=>botReply(text),500);
});

