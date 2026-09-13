
/* =====================================================
   FUN X — DRAWING PAGE
===================================================== */

document.addEventListener("DOMContentLoaded", () => {

    "use strict";


    /* =================================================
       ELEMENTS
    ================================================= */

    const starsContainer =
        document.getElementById("stars");

    const celestial =
        document.getElementById("celestial");

    const celestialIcon =
        document.getElementById("celestialIcon");

    const dayNightBtn =
        document.getElementById("dayNightBtn");

    const imageUpload =
        document.getElementById("imageUpload");

    const uploadZone =
        document.getElementById("uploadZone");

    const imageCard =
        document.getElementById("imageCard");

    const selectedImage =
        document.getElementById("selectedImage");

    const fullscreenBtn =
        document.getElementById("fullscreenBtn");

    const removeBtn =
        document.getElementById("removeBtn");

    const imageName =
        document.getElementById("imageName");

    const toast =
        document.getElementById("toast");


    /* =================================================
       STATE
    ================================================= */

    const THEME_KEY =
        "funx_drawing_theme";


    let isDay = false;

    let currentObjectURL = null;


    /* =================================================
       TOAST
    ================================================= */

    function showToast(message) {

        toast.textContent =
            message;

        toast.classList.add(
            "show"
        );


        clearTimeout(
            showToast.timer
        );


        showToast.timer =
            setTimeout(() => {

                toast.classList.remove(
                    "show"
                );

            }, 2200);

    }


    /* =================================================
       CREATE STARS
    ================================================= */

    function createStars() {

        starsContainer.innerHTML = "";


        const numberOfStars =
            window.innerWidth < 600
                ? 70
                : 120;


        for (
            let i = 0;
            i < numberOfStars;
            i++
        ) {

            const star =
                document.createElement(
                    "div"
                );


            star.className =
                "star";


            const size =
                Math.random() * 2.5 + 1;


            const duration =
                Math.random() * 4 + 3;


            const opacity =
                Math.random() * 0.65 + 0.25;


            star.style.width =
                `${size}px`;


            star.style.height =
                `${size}px`;


            star.style.left =
                `${Math.random() * 100}%`;


            star.style.top =
                `${Math.random() * 100}%`;


            star.style.setProperty(
                "--duration",
                `${duration}s`
            );


            star.style.setProperty(
                "--opacity",
                opacity
            );


            /*
             * تأخير عشوائي
             */

            star.style.animationDelay =
                `${Math.random() * 5}s`;


            starsContainer.appendChild(
                star
            );

        }

    }


    /* =================================================
       BACKGROUND
    ================================================= */

    function updateBackground() {

        if (isDay) {

            document.body.classList.add(
                "light"
            );


            dayNightBtn.textContent =
                "🌙";


            celestialIcon.textContent =
                "☀";


            showToast(
                "☀️ تم تفعيل الوضع النهاري"
            );


        } else {

            document.body.classList.remove(
                "light"
            );


            dayNightBtn.textContent =
                "☀️";


            celestialIcon.textContent =
                "☾";


            showToast(
                "🌙 تم تفعيل الوضع الليلي"
            );

        }

    }


    /* =================================================
       THEME BUTTON
    ================================================= */

    dayNightBtn.addEventListener(
        "click",
        () => {

            isDay =
                !isDay;


            localStorage.setItem(
                THEME_KEY,
                isDay
                    ? "day"
                    : "night"
            );


            updateBackground();

        }
    );


    /* =================================================
       LOAD THEME
    ================================================= */

    const savedTheme =
        localStorage.getItem(
            THEME_KEY
        );


    if (savedTheme === "day") {

        isDay = true;

    } else {

        isDay = false;

    }


    /* =================================================
       UPLOAD HANDLER
    ================================================= */

    function handleImage(file) {

        if (!file) {
            return;
        }


        if (
            !file.type.startsWith(
                "image/"
            )
        ) {

            showToast(
                "⚠️ الملف المختار ليس صورة"
            );

            return;

        }


        /*
         * حذف Object URL السابق
         */

        if (currentObjectURL) {

            URL.revokeObjectURL(
                currentObjectURL
            );

        }


        /*
         * إنشاء رابط مؤقت
         */

        currentObjectURL =
            URL.createObjectURL(
                file
            );


        selectedImage.src =
            currentObjectURL;


        imageName.textContent =
            file.name;


        imageCard.hidden =
            false;


        showToast(
            "✅ تم تحميل الصورة"
        );


        /*
         * Scroll للصورة
         */

        setTimeout(() => {

            imageCard.scrollIntoView({
                behavior: "smooth",
                block: "center"
            });

        }, 150);

    }


    /* =================================================
       INPUT
    ================================================= */

    imageUpload.addEventListener(
        "change",
        event => {

            const file =
                event.target.files[0];


            handleImage(file);

        }
    );


    /* =================================================
       DRAG & DROP
    ================================================= */

    [
        "dragenter",
        "dragover"
    ].forEach(
        eventName => {

            uploadZone.addEventListener(
                eventName,
                event => {

                    event.preventDefault();

                    uploadZone.classList.add(
                        "dragging"
                    );

                }
            );

        }
    );


    [
        "dragleave",
        "drop"
    ].forEach(
        eventName => {

            uploadZone.addEventListener(
                eventName,
                event => {

                    event.preventDefault();

                    uploadZone.classList.remove(
                        "dragging"
                    );

                }
            );

        }
    );


    uploadZone.addEventListener(
        "drop",
        event => {

            const file =
                event.dataTransfer.files[0];


            handleImage(file);

        }
    );


    /* =================================================
       FULLSCREEN
    ================================================= */

    fullscreenBtn.addEventListener(
        "click",
        async () => {

            try {

                if (
                    selectedImage.requestFullscreen
                ) {

                    await selectedImage.requestFullscreen();

                } else if (
                    selectedImage.webkitRequestFullscreen
                ) {

                    selectedImage.webkitRequestFullscreen();

                } else {

                    showToast(
                        "⚠️ المتصفح لا يدعم الوضع الكامل"
                    );

                    return;

                }


                showToast(
                    "⛶ تم تفعيل الشاشة الكاملة"
                );


            } catch (error) {

                console.warn(
                    "Fullscreen error:",
                    error
                );

                showToast(
                    "⚠️ تعذر فتح الشاشة الكاملة"
                );

            }

        }
    );


    /* =================================================
       REMOVE IMAGE
    ================================================= */

    removeBtn.addEventListener(
        "click",
        () => {

            if (currentObjectURL) {

                URL.revokeObjectURL(
                    currentObjectURL
                );

                currentObjectURL =
                    null;

            }


            selectedImage.src =
                "";


            imageName.textContent =
                "—";


            imageUpload.value =
                "";


            imageCard.hidden =
                true;


            showToast(
                "🗑 تم حذف الصورة"
            );

        }
    );


    /* =================================================
       KEYBOARD SHORTCUT
    ================================================= */

    document.addEventListener(
        "keydown",
        event => {

            /*
             * D = تبديل الوضع
             */

            if (
                event.key.toLowerCase() ===
                "d"
            ) {

                dayNightBtn.click();

            }

            /*
             * Escape يترك fullscreen
             */

            if (
                event.key ===
                "Escape"
            ) {

                if (
                    document.fullscreenElement
                ) {

                    document.exitFullscreen();

                }

            }

        }
    );


    /* =================================================
       CLEANUP
    ================================================= */

    window.addEventListener(
        "beforeunload",
        () => {

            if (currentObjectURL) {

                URL.revokeObjectURL(
                    currentObjectURL
                );

            }

        }
    );


    /* =================================================
       INIT
    ================================================= */

    createStars();

    /*
     * تطبيق الوضع بدون Toast عند بدء الصفحة
     */

    if (isDay) {

        document.body.classList.add(
            "light"
        );

        dayNightBtn.textContent =
            "🌙";

        celestialIcon.textContent =
            "☀";

    } else {

        document.body.classList.remove(
            "light"
        );

        dayNightBtn.textContent =
            "☀️";

        celestialIcon.textContent =
            "☾";

    }

});

