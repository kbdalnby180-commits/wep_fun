
/* =========================================================
   FUN X — BACK TO SCHOOL 2026
   Main JavaScript
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {

    "use strict";

    /* =====================================================
       CLOCK & DATE
       ===================================================== */

    const clock = document.getElementById("clock");
    const calendar = document.getElementById("calendar");

    function updateClock() {

        const now = new Date();

        const hours = String(now.getHours()).padStart(2, "0");
        const minutes = String(now.getMinutes()).padStart(2, "0");
        const seconds = String(now.getSeconds()).padStart(2, "0");

        const day = String(now.getDate()).padStart(2, "0");
        const month = String(now.getMonth() + 1).padStart(2, "0");
        const year = now.getFullYear();

        clock.textContent =
            `${hours}:${minutes}:${seconds}`;

        calendar.textContent =
            `${day}/${month}/${year}`;
    }

    updateClock();

    setInterval(updateClock, 1000);


    /* =====================================================
       CHATBOT
       ===================================================== */

    const chatToggle =
        document.getElementById("chatToggle");

    const chatbot =
        document.getElementById("chatbot");

    const chatMessages =
        document.getElementById("chatMessages");

    const chatInput =
        document.getElementById("chatInput");

    const sendBtn =
        document.getElementById("sendBtn");


    /* =====================================================
       PAGES
       ===================================================== */

    const pages = [

        {
            name: "🎨 رسم",
            keywords: ["رسم", "paint", "drawing"],
            url: "wep app/paints/index.html"
        },

        {
            name: "🕋 Quran",
            keywords: ["quran", "قران", "القرآن", "قرآن"],
            url: "wep app/quran/index.html"
        },

        {
            name: "📻 Fun X Radio",
            keywords: ["راديو", "radio"],
            url: "wep app/radio fun x/index.html"
        },

        {
            name: "📿 السبحة الإلكترونية",
            keywords: ["سبحة", "تسبيح"],
            url: "wep app/Electronic rosary/index.html"
        },

        {
            name: "📖 مساعد المذاكرة",
            keywords: [
                "مذاكرة",
                "دراسة",
                "study",
                "مساعد"
            ],
            url: "wep app/Study assistant/index.html"
        },

        {
            name: "📚 صفحة المذاكرة",
            keywords: [
                "صفحة المذاكرة",
                "study page"
            ],
            url: "wep app/study_page_html/index.html"
        },

        {
            name: "💡 نصيحة يومية",
            keywords: [
                "نصيحة",
                "tip"
            ],
            url: "wep app/daily-tip/index.html"
        },

        {
            name: "🖼️ معرض الخلفيات",
            keywords: [
                "خلفيات",
                "wallpaper",
                "wallpapers"
            ],
            url: "tool/wallper/index.html"
        },

        {
            name: "🔗 صنع QR",
            keywords: [
                "qr",
                "كيو ار"
            ],
            url: "wep app/qr/index.html"
        },

        {
            name: "💻 FUN X LEARN HTML",
            keywords: [
                "html",
                "تعلم",
                "برمجة",
                "coding"
            ],
            url: "tool/FUN X LEARN HTML/index.html"
        },

        {
            name: "🎮 FUN X Arcade",
            keywords: [
                "ألعاب",
                "لعبة",
                "gaming",
                "arcade"
            ],
            url: "wep app/wep gaming/splash.html"
        },

        {
            name: "ℹ️ INFO WEP",
            keywords: [
                "info",
                "معلومات"
            ],
            url: "tool/Fun X/index.html"
        }

    ];


    /* =====================================================
       INITIAL BOT MESSAGE
       ===================================================== */

    addMessage(
        "bot",
        "👋 أهلاً بك في Fun X! اكتب اسم الصفحة التي تريد فتحها 📚"
    );


    /* =====================================================
       PAGE SHORTCUTS
       ===================================================== */

    pages.forEach(page => {

        const div =
            document.createElement("div");

        div.className = "bot";

        const link =
            document.createElement("a");

        link.href = page.url;

        link.target = "_blank";

        link.textContent = page.name;

        link.style.textDecoration = "none";

        link.style.color = "#1976d2";

        link.style.fontWeight = "700";

        div.appendChild(link);

        chatMessages.appendChild(div);

    });


    /* =====================================================
       TOGGLE CHAT
       ===================================================== */

    chatToggle.addEventListener("click", () => {

        chatbot.classList.toggle("hidden");

        if (!chatbot.classList.contains("hidden")) {

            setTimeout(() => {
                chatInput.focus();
            }, 150);

        }

    });


    /* =====================================================
       ADD MESSAGE
       ===================================================== */

    function addMessage(sender, text) {

        const message =
            document.createElement("div");

        message.className = sender;

        message.textContent = text;

        chatMessages.appendChild(message);

        chatMessages.scrollTop =
            chatMessages.scrollHeight;

    }


    /* =====================================================
       BOT REPLY
       ===================================================== */

    function botReply(userText) {

        const text =
            userText.toLowerCase().trim();

        let matchedPage = null;

        for (const page of pages) {

            const found =
                page.keywords.some(keyword =>
                    text.includes(
                        keyword.toLowerCase()
                    )
                );

            if (found) {

                matchedPage = page;

                break;
            }
        }


        if (matchedPage) {

            addMessage(
                "bot",
                `✅ جارٍ فتح ${matchedPage.name}...`
            );

            setTimeout(() => {

                window.open(
                    matchedPage.url,
                    "_blank"
                );

            }, 500);

            return;
        }


        addMessage(
            "bot",
            "🤖 مش لاقي الصفحة دي. جرّب تكتب: مذاكرة، رسم، QR، برمجة أو ألعاب."
        );

    }


    /* =====================================================
       SEND MESSAGE
       ===================================================== */

    function sendMessage() {

        const text =
            chatInput.value.trim();

        if (!text) return;

        addMessage(
            "user",
            text
        );

        chatInput.value = "";

        setTimeout(() => {

            botReply(text);

        }, 350);

    }


    sendBtn.addEventListener(
        "click",
        sendMessage
    );


    chatInput.addEventListener(
        "keydown",
        event => {

            if (event.key === "Enter") {

                event.preventDefault();

                sendMessage();

            }

        }
    );


    /* =====================================================
       HEADER SHADOW ON SCROLL
       ===================================================== */

    const header =
        document.getElementById("mainHeader");

    window.addEventListener(
        "scroll",
        () => {

            if (window.scrollY > 10) {

                header.style.boxShadow =
                    "0 8px 30px rgba(16,42,67,0.12)";

            } else {

                header.style.boxShadow =
                    "0 5px 25px rgba(16,42,67,0.08)";

            }

        },
        { passive: true }
    );


    console.log(
        "🎒 Fun X Back To School Edition loaded successfully!"
    );

});

