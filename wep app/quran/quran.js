
document.addEventListener("DOMContentLoaded", () => {
    "use strict";

    /* =====================================================
       إنشاء النجوم / النقاط الذهبية
       ===================================================== */

    const starsContainer = document.querySelector(".stars");

    if (starsContainer) {

        const starCount = window.innerWidth <= 768 ? 45 : 80;

        for (let i = 0; i < starCount; i++) {

            const star = document.createElement("span");

            star.className = "star";

            star.style.top = `${Math.random() * 100}%`;
            star.style.left = `${Math.random() * 100}%`;

            const size = Math.random() * 3 + 1;

            star.style.width = `${size}px`;
            star.style.height = `${size}px`;

            star.style.animationDuration =
                `${Math.random() * 4 + 3}s`;

            star.style.animationDelay =
                `${Math.random() * 4}s`;

            starsContainer.appendChild(star);
        }
    }


    /* =====================================================
       نظام الإشعارات
       ===================================================== */

    const notify = document.getElementById("notify");

    let notificationTimer = null;

    function showNotification(text) {

        if (!notify) return;

        clearTimeout(notificationTimer);

        notify.textContent = text;

        notify.style.display = "block";
        notify.style.opacity = "0";
        notify.style.transform = "translateY(20px)";

        requestAnimationFrame(() => {

            notify.style.transition =
                "opacity 0.4s ease, transform 0.4s ease";

            notify.style.opacity = "1";
            notify.style.transform = "translateY(0)";
        });

        notificationTimer = setTimeout(() => {

            notify.style.opacity = "0";
            notify.style.transform = "translateY(20px)";

            setTimeout(() => {
                notify.style.display = "none";
            }, 400);

        }, 4500);
    }


    /* =====================================================
       رسالة الترحيب
       ===================================================== */

    setTimeout(() => {

        showNotification(
            "مرحباً بك في ركن القرآن الكريم 🕌📚"
        );

    }, 500);


    /* =====================================================
       التحكم في مشغلات الصوت
       منع تشغيل أكثر من صوت في نفس الوقت
       ===================================================== */

    const audios = document.querySelectorAll("audio");

    audios.forEach((audio) => {

        audio.addEventListener("play", () => {

            audios.forEach((otherAudio) => {

                if (otherAudio !== audio) {
                    otherAudio.pause();
                }

            });
        });

    });


    /* =====================================================
       إشعار عند بدء تشغيل التلاوة
       ===================================================== */

    audios.forEach((audio, index) => {

        audio.addEventListener("play", () => {

            showNotification(
                `🎧 تم تشغيل التلاوة رقم ${index + 1}`
            );
        });

    });


    /* =====================================================
       رسالة عند انتهاء التلاوة
       ===================================================== */

    audios.forEach((audio) => {

        audio.addEventListener("ended", () => {

            showNotification(
                "✨ انتهت التلاوة — بارك الله فيك"
            );

        });

    });

});

