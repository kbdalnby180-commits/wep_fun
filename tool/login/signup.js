// 🌟 إنشاء النجوم
for(let i=0;i<100;i++){
    const star=document.createElement('div');
    star.className='star';
    star.style.top=Math.random()*100+'%';
    star.style.left=Math.random()*100+'%';
    star.style.width=star.style.height=Math.random()*2+1+'px';
    document.body.appendChild(star);
}

// إذا سجل المستخدم قبل كده، يروح مباشرة للصفحة الرئيسية
if(localStorage.getItem('signedUp')){
    window.location.href = 'index.html';
}

// تسجيل الدخول
function signup(){
    const name = document.getElementById('username').value.trim();
    if(name === ""){
        alert("اكتب اسمك قبل المتابعة!");
        return;
    }
    localStorage.setItem('username', name);
    localStorage.setItem('signedUp', 'true');
    window.location.href = 'index.html';
}

// صوت الخلفية هادئ ومستمر
const bgMusic = document.getElementById('bgMusic');
bgMusic.volume = 0.2;
bgMusic.play().catch(() => {
    document.addEventListener('click', () => bgMusic.play(), { once: true });
});

// صوت التأثيرات عند أي نقرة
function playEffectSound() {
    const click = document.getElementById('clickSound');
    click.currentTime = 0;
    click.play();
}
document.body.addEventListener('click', playEffectSound);

// حركة القمر حسب الوقت
const celestial = document.querySelector('.celestial');
function updateCelestial(){
    const now = new Date();
    const hour = now.getHours() + now.getMinutes()/60;
    const percent = hour/24;
    celestial.style.top = `${10 + percent*60}%`;
    celestial.style.left = `${10 + percent*80}%`;
}
setInterval(updateCelestial,1000);
updateCelestial();
