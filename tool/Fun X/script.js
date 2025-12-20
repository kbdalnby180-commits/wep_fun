// ====== زر المتابعة ======
const followBtn = document.querySelector('.follow-btn');

followBtn.addEventListener('click', () => {
    if (followBtn.classList.contains('following')) {
        followBtn.textContent = 'متابعة';
        followBtn.classList.remove('following');
    } else {
        followBtn.textContent = 'متابع';
        followBtn.classList.add('following');
    }
});

// ====== تفاعلي Timeline ======
// عند الضغط على أي حدث يظهر تنبيه بمعلوماته
const events = document.querySelectorAll('.timeline .event');

events.forEach(event => {
    event.addEventListener('click', () => {
        const date = event.querySelector('.date').textContent;
        const description = event.querySelector('p').textContent;
        alert(`التاريخ: ${date}\nالحدث: ${description}`);
    });
});

// ====== إضافة تأثير عند تمرير الصفحة على الـ About ======
const aboutSection = document.querySelector('.about');

window.addEventListener('scroll', () => {
    const rect = aboutSection.getBoundingClientRect();
    if (rect.top < window.innerHeight - 100) {
        aboutSection.style.opacity = '1';
        aboutSection.style.transform = 'translateY(0)';
        aboutSection.style.transition = 'all 0.8s ease';
    }
});
