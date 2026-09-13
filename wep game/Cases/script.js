
document.addEventListener("DOMContentLoaded", () => {

    "use strict";


    /* =====================================================
       SETTINGS
    ===================================================== */

    const KILLER = "2";

    const STORAGE_KEY =
        "detective_x_case_01";


    /* =====================================================
       ELEMENTS
    ===================================================== */

    const choice =
        document.getElementById("choice");

    const solveBtn =
        document.getElementById("solveBtn");

    const result =
        document.getElementById("result");

    const resultModal =
        document.getElementById("resultModal");

    const closeModal =
        document.getElementById("closeModal");

    const modalIcon =
        document.getElementById("modalIcon");

    const modalTag =
        document.getElementById("modalTag");

    const modalTitle =
        document.getElementById("modalTitle");

    const modalText =
        document.getElementById("modalText");

    const particles =
        document.getElementById("particles");


    /* =====================================================
       STATE
    ===================================================== */

    let solved =
        localStorage.getItem(
            STORAGE_KEY
        ) === "1";


    /* =====================================================
       MODAL
    ===================================================== */

    function openModal(
        icon,
        tag,
        title,
        text
    ) {

        modalIcon.textContent =
            icon;

        modalTag.textContent =
            tag;

        modalTitle.textContent =
            title;

        modalText.textContent =
            text;

        resultModal.classList.add(
            "show"
        );

        document.body.style.overflow =
            "hidden";

    }


    function hideModal() {

        resultModal.classList.remove(
            "show"
        );

        document.body.style.overflow =
            "";

    }


    closeModal.addEventListener(
        "click",
        hideModal
    );


    resultModal.addEventListener(
        "click",
        event => {

            if (
                event.target === resultModal
            ) {

                hideModal();

            }

        }
    );


    document.addEventListener(
        "keydown",
        event => {

            if (
                event.key === "Escape"
            ) {

                hideModal();

            }

        }
    );


    /* =====================================================
       ALREADY SOLVED
    ===================================================== */

    function lockCase() {

        solved = true;

        solveBtn.disabled =
            true;

        choice.disabled =
            true;


        result.textContent =
            "🔒 تم اتخاذ القرار مسبقًا. القضية مغلقة.";

        result.style.color =
            "#8795a8";

    }


    if (solved) {

        lockCase();

    }


    /* =====================================================
       SOLVE CASE
    ===================================================== */

    function solveCase() {

        if (solved) {

            openModal(
                "🔒",
                "CASE LOCKED",
                "القضية مغلقة",
                "لقد استخدمت محاولة هذه القضية بالفعل."
            );

            return;

        }


        const selected =
            choice.value;


        if (!selected) {

            result.textContent =
                "⚠️ اختر مشتبهًا قبل إغلاق القضية.";

            result.style.color =
                "#ffd45a";

            return;

        }


        const confirmed =
            window.confirm(
                "هل أنت متأكد من القرار؟\nالقرار نهائي ولن تحصل على محاولة أخرى."
            );


        if (!confirmed) {

            return;

        }


        localStorage.setItem(
            STORAGE_KEY,
            "1"
        );


        lockCase();


        if (
            selected === KILLER
        ) {

            result.textContent =
                "✔ تحليل عبقري — لقد حددت القاتل الصحيح.";

            result.style.color =
                "#50df9e";


            openModal(
                "🏆",
                "CASE SOLVED",
                "تحليل عبقري!",
                "أحسنت. المشتبه الثاني هو القاتل الحقيقي، وقد أغلقت القضية بنجاح."
            );

        } else {

            result.textContent =
                "✖ قرار خاطئ — القاتل أفلت.";

            result.style.color =
                "#ff7683";


            openModal(
                "💥",
                "CASE FAILED",
                "قرار خاطئ",
                "القرار لم يكن صحيحًا. المشتبه الثاني هو القاتل الحقيقي."
            );

        }

    }


    solveBtn.addEventListener(
        "click",
        solveCase
    );


    /* =====================================================
       PARTICLES
    ===================================================== */

    function createParticles() {

        const count =
            window.innerWidth < 600
                ? 30
                : 55;


        for (
            let i = 0;
            i < count;
            i++
        ) {

            const particle =
                document.createElement(
                    "span"
                );


            particle.style.position =
                "absolute";


            particle.style.left =
                `${Math.random() * 100}%`;


            particle.style.top =
                `${Math.random() * 100}%`;


            particle.style.width =
                `${Math.random() * 2 + 1}px`;


            particle.style.height =
                particle.style.width;


            particle.style.borderRadius =
                "50%";


            particle.style.background =
                "rgba(72,220,255,0.65)";


            particle.style.boxShadow =
                "0 0 8px rgba(72,220,255,0.45)";


            particle.style.opacity =
                `${Math.random() * 0.45 + 0.10}`;


            const duration =
                Math.random() * 8 + 5;


            particle.style.animation =
                `detectiveParticle ${duration}s ease-in-out infinite`;


            particle.style.animationDelay =
                `${Math.random() * 5}s`;


            particles.appendChild(
                particle
            );

        }

    }


    /* =====================================================
       PARTICLE ANIMATION
    ===================================================== */

    const style =
        document.createElement(
            "style"
        );


    style.textContent = `

        @keyframes detectiveParticle {

            0%,
            100% {

                transform:
                    translate3d(
                        0,
                        0,
                        0
                    );

            }

            50% {

                transform:
                    translate3d(
                        10px,
                        -18px,
                        0
                    );

            }

        }

    `;


    document.head.appendChild(
        style
    );


    /* =====================================================
       INIT
    ===================================================== */

    createParticles();

});

