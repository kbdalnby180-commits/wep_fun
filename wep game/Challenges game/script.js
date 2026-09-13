
document.addEventListener("DOMContentLoaded", () => {

    "use strict";


    /* =====================================================
       CHALLENGES
    ===================================================== */

    const challenges = [

        "قل نكتة وحاول تخلي المجموعة كلها تضحك 😂",

        "تكلم لمدة دقيقة وكأنك مذيع أخبار 🎤",

        "قل اسمك بالعكس عدة مرات بدون أن تخطئ 😂",

        "مثّل مشهدًا قصيرًا من فيلم أو مسلسل 🎬",

        "قل ثلاث كلمات تبدأ بنفس الحرف خلال عشر ثوانٍ ⚡",

        "احكِ موقفًا مضحكًا حصل معك 😅",

        "قل جملة بطريقة درامية جدًا 🎭",

        "قلّد شخصية خيالية حتى يعرفها الموجودون 🎭",

        "تحدث بلهجة مختلفة لمدة دقيقة 🗣️",

        "صف شيئًا أمامك بدون ذكر اسمه وخلي الآخرين يخمنوا 🔎",

        "اكتب جملة قصيرة باستخدام ثلاث كلمات يختارها الآخرون ✍️",

        "قل خمسة أسماء أكلات في عشر ثوانٍ 🍕",

        "حاول أن تقول جملة كاملة بدون استخدام كلمة معينة يختارها الفريق 🤫",

        "تحدث عن هوايتك المفضلة لمدة دقيقة 🎨",

        "قم بتمثيل مذيع رياضي يصف مباراة خيالية ⚽",

        "ابتكر إعلانًا مضحكًا لشيء موجود بجانبك 📺",

        "قل شيئًا إيجابيًا عن كل شخص في المجموعة 🤍",

        "اختر شيئًا أمامك واخترع له قصة غريبة 😂",

        "حاول إقناع المجموعة بفكرة طريفة لمدة دقيقة 💡",

        "قل ثلاث عبارات مضحكة متتالية بدون التوقف 😂",

        "احكِ قصة قصيرة تبدأ بكلمة يختارها الفريق 📖",

        "تحدث لمدة دقيقة وكأنك شخصية في لعبة فيديو 🎮",

        "ابتكر اسمًا لفيلم كوميدي في خمس ثوانٍ 🎬",

        "صف يومك بطريقة مبالغ فيها جدًا 😂",

        "اختر شخصًا واذكر شيئًا مميزًا يعجبك في شخصيته 🌟",

        "ابتكر شعارًا مضحكًا لـ Fun X 🚀",

        "قل جملة عادية وكأنك روبوت 🤖",

        "تكلم لمدة دقيقة دون استخدام كلمة نعم أو لا 🚫",

        "اختر موضوعًا عشوائيًا وتحدث عنه لمدة 30 ثانية 🎙️",

        "اختر اسمًا مضحكًا لفريق من أربعة أشخاص 👥"

    ];


    /* =====================================================
       ELEMENTS
    ===================================================== */

    const challengeBox =
        document.getElementById(
            "challenge"
        );


    const challengeText =
        document.getElementById(
            "challengeText"
        );


    const challengeBtn =
        document.getElementById(
            "challengeBtn"
        );


    const copyBtn =
        document.getElementById(
            "copyBtn"
        );


    const status =
        document.getElementById(
            "status"
        );


    const challengeCount =
        document.getElementById(
            "challengeCount"
        );


    const toast =
        document.getElementById(
            "toast"
        );


    /* =====================================================
       STATE
    ===================================================== */

    let lastIndex = -1;


    let displayedCount = 0;


    /* =====================================================
       TOAST
    ===================================================== */

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

            }, 1800);

    }


    /* =====================================================
       RANDOM CHALLENGE
    ===================================================== */

    function getRandomChallenge() {

        if (
            challenges.length === 0
        ) {

            return null;

        }


        let index;


        /*
         * منع تكرار نفس التحدي مرتين متتاليتين
         */

        do {

            index =
                Math.floor(
                    Math.random() *
                    challenges.length
                );

        } while (
            challenges.length > 1 &&
            index === lastIndex
        );


        lastIndex =
            index;


        return challenges[index];

    }


    /* =====================================================
       SHOW CHALLENGE
    ===================================================== */

    function showChallenge() {

        const challenge =
            getRandomChallenge();


        if (!challenge) {

            return;

        }


        /*
         * إعادة تشغيل Animation
         */

        challengeBox.classList.remove(
            "show"
        );


        void challengeBox.offsetWidth;


        challengeText.textContent =
            challenge;


        challengeBox.classList.add(
            "show"
        );


        displayedCount++;


        challengeCount.textContent =
            displayedCount;


        status.classList.add(
            "active"
        );


        status.innerHTML = `
            <span></span>
            تحدي نشط — بالتوفيق! 🔥
        `;


        showToast(
            "🎲 تم اختيار تحدٍ جديد"
        );

    }


    /* =====================================================
       COPY
    ===================================================== */

    async function copyChallenge() {

        const text =
            challengeText.textContent.trim();


        if (
            !text ||
            text ===
            "اضغط على الزر لتبدأ التحدي!"
        ) {

            showToast(
                "⚠️ اختر تحديًا أولًا"
            );

            return;

        }


        try {

            await navigator.clipboard.writeText(
                text
            );


            showToast(
                "📋 تم نسخ التحدي"
            );

        } catch {

            /*
             * Fallback للمتصفحات القديمة
             */

            const textarea =
                document.createElement(
                    "textarea"
                );


            textarea.value =
                text;


            document.body.appendChild(
                textarea
            );


            textarea.select();


            document.execCommand(
                "copy"
            );


            textarea.remove();


            showToast(
                "📋 تم نسخ التحدي"
            );

        }

    }


    /* =====================================================
       EVENTS
    ===================================================== */

    challengeBtn.addEventListener(
        "click",
        showChallenge
    );


    copyBtn.addEventListener(
        "click",
        copyChallenge
    );


    /* =====================================================
       KEYBOARD
    ===================================================== */

    document.addEventListener(
        "keydown",
        event => {

            /*
             * Space
             */

            if (
                event.code ===
                "Space"
            ) {

                event.preventDefault();

                showChallenge();

            }


            /*
             * Enter
             */

            if (
                event.key ===
                "Enter" &&
                document.activeElement.tagName !==
                "BUTTON"
            ) {

                showChallenge();

            }

        }
    );


    /* =====================================================
       PARTICLES
    ===================================================== */

    function createParticles() {

        const container =
            document.getElementById(
                "particles"
            );


        const amount =
            window.innerWidth < 600
                ? 30
                : 55;


        for (
            let i = 0;
            i < amount;
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
                "rgba(255,145,95,0.55)";


            particle.style.boxShadow =
                "0 0 8px rgba(255,145,95,0.45)";


            particle.style.opacity =
                `${Math.random() * 0.4 + 0.10}`;


            const duration =
                Math.random() * 8 + 5;


            particle.style.animation =
                `challengeParticle ${duration}s ease-in-out infinite`;


            particle.style.animationDelay =
                `${Math.random() * 5}s`;


            container.appendChild(
                particle
            );

        }

    }


    const particleStyle =
        document.createElement(
            "style"
        );


    particleStyle.textContent = `

        @keyframes challengeParticle {

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
                        12px,
                        -18px,
                        0
                    );

            }

        }

    `;


    document.head.appendChild(
        particleStyle
    );


    /* =====================================================
       INIT
    ===================================================== */

    challengeCount.textContent =
        challenges.length;


    createParticles();

});

