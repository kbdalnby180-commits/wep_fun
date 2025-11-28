// =============== JS ===============

// النجوم
for(let i=0;i<60;i++){
    const star=document.createElement('div');
    star.className='star';
    star.style.top=Math.random()*100+'%';
    star.style.left=Math.random()*100+'%';
    star.style.width=star.style.height=Math.random()*2+1+'px';
    document.body.appendChild(star);
}

// الثلج
for(let i=0;i<80;i++){ // كثافة أعلى
    const snow=document.createElement('div');
    snow.className='snowflake';
    snow.textContent='❄';
    snow.style.left=Math.random()*100+'%';
    snow.style.fontSize=10+Math.random()*20+'px';
    snow.style.animationDuration=3+Math.random()*5+'s';
    snow.style.opacity=Math.random();
    document.body.appendChild(snow);
}

// بابا نويل كثير
for(let i=0;i<20;i++){
    const santa=document.createElement('div');
    santa.className='santa';
    santa.textContent='🎅';
    santa.style.left=Math.random()*100+'%';
    santa.style.animationDuration=(5+Math.random()*5)+'s';
    document.body.appendChild(santa);
}

// القمر/الشمس
const celestial = document.getElementById('celestial');
function updateCelestial(){
    const h=new Date().getHours();
    if(h>=6 && h<18){
        document.body.style.background="linear-gradient(to bottom,#82ccdd,#a0e1ff)";
        celestial.style.background="radial-gradient(circle,#fff,#cce6ff)";
    }else{
        document.body.style.background="linear-gradient(to bottom,#0a3d62,#1e3799)";
        celestial.style.background="radial-gradient(circle,#cce6ff,#99ccff)";
    }
}
setInterval(updateCelestial,1000);
updateCelestial();

// ساعة وتاريخ
function updateClock(){
    const now=new Date();
    document.getElementById('clock').textContent=
        now.getHours().toString().padStart(2,'0')+":"+now.getMinutes().toString().padStart(2,'0')+":"+now.getSeconds().toString().padStart(2,'0');
    document.getElementById('calendar').textContent=
        now.getDate().toString().padStart(2,'0')+"/"+(now.getMonth()+1).toString().padStart(2,'0')+"/"+now.getFullYear();
}
setInterval(updateClock,1000);
updateClock();

// الروبوت
const chatToggle=document.getElementById('chatToggle');
const chatbot=document.getElementById('chatbot');
const chatMessages=document.getElementById('chatMessages');
const chatInput=document.getElementById('chatInput');
const sendBtn=document.getElementById('sendBtn');

chatToggle.addEventListener('click',()=>{chatbot.classList.toggle('hidden');});

const pages=[
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
pages.forEach(p=>{
    const div=document.createElement('div');
    div.className='bot';
    div.innerHTML=`<a href="${p.url}" target="_blank" style="color:#0ff;text-decoration:none;">${p.name}</a>`;
    chatMessages.appendChild(div);
});

function addMessage(sender,text){
    const msg=document.createElement('div');
    msg.className=sender;
    msg.textContent=text;
    chatMessages.appendChild(msg);
    chatMessages.scrollTop=chatMessages.scrollHeight;
}

function botReply(userText){
    let reply="🤖 مش فاهم قصدك، جرّب تكتب حاجة تانية.";
    pages.forEach(p=>{
        if(userText.toLowerCase().includes(p.name.replace(/[^a-zA-Z\u0600-\u06FF]/g,"").toLowerCase())){
            reply=`✅ ${p.name}`;
            setTimeout(()=>window.open(p.url,"_blank"),500);
        }
    });
    addMessage("bot",reply);
}

sendBtn.addEventListener('click',()=>{
    const text=chatInput.value.trim();
    if(!text) return;
    addMessage("user",text);
    chatInput.value="";
    setTimeout(()=>botReply(text),500);
});