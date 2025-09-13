// 🌟 إنشاء النجوم
for(let i=0;i<100;i++){
    const star = document.createElement('div');
    star.className = 'star';
    star.style.top = Math.random()*100+'%';
    star.style.left = Math.random()*100+'%';
    star.style.width = star.style.height = Math.random()*2+1+'px';
    document.body.appendChild(star);
}

// إشعار ترحيبي
function showNotification(text){
    const notify = document.getElementById('notify');
    notify.innerText = text;
    notify.style.display = 'block';
    setTimeout(()=>notify.style.display='none',5000);
}
showNotification("مرحباً بك في ركن القرآن الكريم");
