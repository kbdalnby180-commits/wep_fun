// تكبير الروابط عند الضغط والتمرير
const links = document.querySelectorAll('.menu-table th a');
links.forEach(link => {
    link.addEventListener('mouseover', () => link.style.transform = "scale(1.1)");
    link.addEventListener('mouseout', () => link.style.transform = "scale(1)");
    link.addEventListener('click', () => {
        link.style.transform = "scale(1.2)";
        setTimeout(()=>link.style.transform="scale(1)", 200);
    });
});

// تمييز العمود عند المرور
const headers = document.querySelectorAll('.menu-table th');
headers.forEach(th => {
    th.addEventListener('mouseover', () => {
        th.style.backgroundColor = "#222";
    });
    th.addEventListener('mouseout', () => {
        th.style.backgroundColor = "rgba(0,0,0,0.8)";
    });
});

// تشغيل الفيديو عند التمرير
const video = document.getElementById('mainVideo');
window.addEventListener('scroll', () => {
    const rect = video.getBoundingClientRect();
    if(rect.top < window.innerHeight && rect.bottom > 0){
        video.play();
    } else {
        video.pause();
    }
});

// حفظ حالة الفيديو واستكمالها
window.addEventListener('beforeunload', function (e){
    localStorage.setItem('videoTime', video.currentTime);
    e.preventDefault(); e.returnValue='';
});
window.addEventListener('load', () => {
    const lastTime = localStorage.getItem('videoTime');
    if(lastTime) video.currentTime = lastTime;
});

// إشعارات ديناميكية
const section = document.querySelector('section');
const notify = document.createElement('div');
notify.innerText = "مرحبًا بك في قسم الفيديو!";
notify.style.position = "fixed";
notify.style.bottom = "20px";
notify.style.right = "20px";
notify.style.padding = "10px";
notify.style.background = "#f83a00";
notify.style.color = "#fff";
notify.style.borderRadius = "5px";
notify.style.display = "none";
document.body.appendChild(notify);

window.addEventListener('scroll', () => {
    const rect = section.getBoundingClientRect();
    if(rect.top < window.innerHeight && rect.bottom > 0){
        notify.style.display = "block";
        setTimeout(()=>notify.style.display="none",3000);
    }
});

// البحث الداخلي
const searchInput = document.getElementById('searchInput');
searchInput.addEventListener('input', () => {
    let value = searchInput.value.toLowerCase();
    headers.forEach(th => {
        if(th.innerText.toLowerCase().includes(value)){
            th.style.display = "";
        } else {
            th.style.display = "none";
        }
    });
});

// تقييم النجوم لكل رابط
headers.forEach(th => {
    let starsContainer = document.createElement("div");
    starsContainer.className = "stars";
    for(let i=1;i<=5;i++){
        let star = document.createElement("span");
        star.innerText = "★";
        star.addEventListener("click", () => {
            localStorage.setItem(th.innerText + "_rating", i);
            alert(`تم تقييم ${th.innerText} بـ ${i} نجوم`);
        });
        starsContainer.appendChild(star);
    }
    th.appendChild(starsContainer);
});
