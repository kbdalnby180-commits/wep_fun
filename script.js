// نجوم
for(let i=0;i<60;i++){
    const star=document.createElement('div');
    star.className='star';
    star.style.top=Math.random()*100+'%';
    star.style.left=Math.random()*100+'%';
    star.style.width=star.style.height=Math.random()*2+1+'px';
    document.body.appendChild(star);
}

// قمر/شمس
const celestial=document.getElementById('celestial');
function updateCelestial(){
    const now=new Date();
    const h=now.getHours();
    if(h>=6 && h<18){
        document.body.style.background="linear-gradient(180deg,#87CEEB,#FFD700)";
        celestial.style.background="radial-gradient(circle,#FFD700,#FFA500)";
    } else {
        document.body.style.background="#000";
        celestial.style.background="radial-gradient(circle,#fff,#ccc)";
    }
}
setInterval(updateCelestial,1000);
updateCelestial();

// إشعار مرة واحدة
const notify=document.getElementById('notify');
if(!localStorage.getItem('updateSeen')){
    notify.style.display='block';
    notify.onclick=()=>{
        localStorage.setItem('updateSeen','true');
        alert("📢 تفاصيل التحديث 1.5: تحسينات للهاتف والكمبيوتر!");
    };
}

// ساعة وتاريخ
function updateClock(){
    const now=new Date();
    document.getElementById('clock').textContent=
        now.getHours().toString().padStart(2,'0')+":"+
        now.getMinutes().toString().padStart(2,'0')+":"+
        now.getSeconds().toString().padStart(2,'0');
    document.getElementById('calendar').textContent=
        now.getDate().toString().padStart(2,'0')+"/"+
        (now.getMonth()+1).toString().padStart(2,'0')+"/"+now.getFullYear();
}
setInterval(updateClock,1000);
updateClock();

// القائمة الجانبية
const menuToggle=document.getElementById('menuToggle');
const sideMenu=document.getElementById('sideMenu');
let menuOpen=false;
menuToggle.addEventListener('click',()=>{
    sideMenu.style.right=menuOpen?'-100%':'0';
    menuOpen=!menuOpen;
});
