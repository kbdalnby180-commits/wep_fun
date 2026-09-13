
/* =====================================================
   DAILY X — DAILY TIPS
===================================================== */

document.addEventListener("DOMContentLoaded", () => {

    "use strict";


    /* =================================================
       TIPS
    ================================================= */

    const maleTips = [

        "خصص وقتًا يوميًا للحركة والنشاط حتى لو كان لفترة قصيرة.",

        "احرص على النوم الكافي وحافظ على موعد نوم منتظم.",

        "تعلم مهارة جديدة تساعدك في دراستك أو مستقبلك.",

        "قسّم أهدافك الكبيرة إلى خطوات صغيرة تستطيع تنفيذها.",

        "ابتعد عن التدخين والعادات التي تضر بصحتك.",

        "قلل من الوقت الضائع على الهاتف واستثمره في شيء مفيد.",

        "اقرأ شيئًا مفيدًا كل يوم ولو لعدة صفحات فقط.",

        "راجع أهدافك كل فترة وتأكد أنك تتحرك في الاتجاه الصحيح.",

        "تعلم كيف تدير وقتك بدلًا من ترك يومك للصدفة.",

        "خصص وقتًا لعائلتك وأصدقائك وحافظ على علاقاتك الجيدة.",

        "لا تخجل من طلب المساعدة عندما تحتاج إليها.",

        "تجنب مقارنة نفسك بالآخرين وركز على تطورك أنت.",

        "اجعل التعلم عادة مستمرة وليس شيئًا مرتبطًا بالاختبارات فقط.",

        "حافظ على ترتيب مكانك لأنه يساعدك على التركيز.",

        "اشرب الماء بانتظام خلال اليوم.",

        "تناول وجبات متنوعة ومتوازنة قدر الإمكان.",

        "تعلم شيئًا جديدًا في البرمجة أو التقنية كل أسبوع.",

        "لا تؤجل المهام السهلة؛ إنجازها يعطيك دفعة لباقي يومك.",

        "احرص على أخذ فترات راحة قصيرة أثناء الدراسة.",

        "تعلّم من أخطائك بدلًا من الاستسلام لها.",

        "ضع هاتفك بعيدًا عندما تحتاج إلى تركيز عميق.",

        "ابدأ يومك بمهمة مهمة بدلًا من إضاعة أول ساعة.",

        "مارس هواية تحبها وخصص لها وقتًا منظمًا.",

        "عامل الناس باحترام حتى عندما تختلف معهم.",

        "تذكر أن الاستمرار أهم من البداية القوية."

    ];


    const femaleTips = [

        "خصصي وقتًا لنفسك بعيدًا عن الضوضاء والضغط اليومي.",

        "احرصي على النوم الكافي والحفاظ على روتين مناسب.",

        "تعلمي مهارة جديدة يمكن أن تفيدك في المستقبل.",

        "قسّمي أهدافك إلى خطوات صغيرة قابلة للتنفيذ.",

        "اهتمي بصحتك النفسية والجسدية معًا.",

        "قللي من استخدام الهاتف عندما تحتاجين إلى التركيز.",

        "اقرئي شيئًا مفيدًا كل يوم حتى لو كان لفترة قصيرة.",

        "اكتبي أهدافك حتى تصبح واضحة وأسهل في المتابعة.",

        "اهتمي بتنظيم وقتك بين الدراسة والراحة والهوايات.",

        "حافظي على علاقاتك الجيدة مع الأشخاص الذين يدعمونك.",

        "لا تقارني نفسك بالآخرين؛ لكل شخص طريقه الخاص.",

        "تذكري أن طلب المساعدة عند الحاجة ليس ضعفًا.",

        "خصصي وقتًا لهواية تجعلك سعيدة ومبدعة.",

        "اهتمي بتناول طعام متنوع ومتوازن.",

        "اشربي الماء بانتظام خلال اليوم.",

        "ابتعدي عن العادات التي تستنزف وقتك وطاقة يومك.",

        "احتفلي بتقدمك حتى عندما تكون الخطوات صغيرة.",

        "تعلمي مهارة رقمية جديدة يمكن أن تساعدك مستقبلًا.",

        "رتبي مكانك قبل البدء في الدراسة أو العمل.",

        "خذي فترات راحة قصيرة عندما تشعرين بالإرهاق.",

        "تعلمي من التجارب السابقة بدلًا من التفكير فيها فقط.",

        "خصصي وقتًا للعائلة والأصدقاء الذين تشعرين معهم بالراحة.",

        "لا تجعلي يومًا سيئًا يحكم على أسبوعك بالكامل.",

        "ابدئي يومك بأولوية مهمة بدلًا من تأجيل كل شيء.",

        "تذكري أن الاستمرار والتطور أهم من الكمال."

    ];


    /* =================================================
       ELEMENTS
    ================================================= */

    const genderButtons =
        document.querySelectorAll(
            ".gender-option"
        );


    const showTipBtn =
        document.getElementById(
            "showTipBtn"
        );


    const toggleTheme =
        document.getElementById(
            "toggleTheme"
        );


    const tipBox =
        document.getElementById(
            "tipBox"
        );


    const tipText =
        document.getElementById(
            "tipText"
        );


    const dayNumber =
        document.getElementById(
            "dayNumber"
        );


    const selectedGender =
        document.getElementById(
            "selectedGender"
        );


    const toast =
        document.getElementById(
            "toast"
        );


    /* =================================================
       STATE
    ================================================= */

    let selectedType = "";

    let currentTipIndex = null;


    /* =================================================
       STORAGE
    ================================================= */

    const THEME_KEY =
        "daily_x_theme";


    const GENDER_KEY =
        "daily_x_gender";


    /* =================================================
       TOAST
    ================================================= */

    function showToast(message) {

        toast.textContent =
            message;

        toast.classList.add("show");


        clearTimeout(
            showToast.timer
        );


        showToast.timer =
            setTimeout(() => {

                toast.classList.remove(
                    "show"
                );

            }, 2000);

    }


    /* =================================================
       DAY NUMBER
    ================================================= */

    function getDayNumber() {

        const now =
            new Date();


        const start =
            new Date(1970, 0, 1);


        const difference =
            Math.floor(
                (
                    now.getTime() -
                    start.getTime()
                ) /
                (
                    1000 *
                    60 *
                    60 *
                    24
                )
            );


        return difference;

    }


    function updateDayNumber() {

        dayNumber.textContent =
            getDayNumber();

    }


    /* =================================================
       GET DAILY TIP
    ================================================= */

    function getDailyTip(type) {

        const tips =
            type === "male"
                ? maleTips
                : femaleTips;


        const day =
            getDayNumber();


        /*
         * نفس النصيحة ستظل مرتبطة بنفس اليوم
         * لكل نوع، وبالتالي لن تتغير عند إعادة
         * تحميل الصفحة.
         */

        const index =
            day % tips.length;


        return {
            text: tips[index],
            index: index
        };

    }


    /* =================================================
       SELECT TYPE
    ================================================= */

    function selectGender(type) {

        selectedType =
            type;


        genderButtons.forEach(
            button => {

                button.classList.toggle(
                    "active",
                    button.dataset.gender ===
                    type
                );

            }
        );


        const name =
            type === "male"
                ? "للذكر"
                : "للأنثى";


        selectedGender.textContent =
            name;


        localStorage.setItem(
            GENDER_KEY,
            type
        );


        showToast(
            type === "male"
                ? "👨 تم اختيار نصائح الذكور"
                : "👩 تم اختيار نصائح الإناث"
        );

    }


    /* =================================================
       SHOW TIP
    ================================================= */

    function showTip() {

        if (!selectedType) {

            showToast(
                "⚠️ اختر النوع أولًا"
            );

            return;

        }


        const result =
            getDailyTip(
                selectedType
            );


        currentTipIndex =
            result.index;


        /*
         * Animation reset
         */

        tipBox.classList.remove(
            "showing"
        );


        tipBox.style.opacity = "0";


        setTimeout(() => {

            tipText.textContent =
                result.text;


            tipBox
                .querySelector(
                    ".placeholder-icon"
                )
                .textContent = "💡";


            tipBox.style.opacity =
                "1";


            tipBox.classList.add(
                "showing"
            );

        }, 180);


        showToast(
            "✨ تم عرض نصيحة اليوم"
        );

    }


    /* =================================================
       THEME
    ================================================= */

    function applyTheme(theme) {

        if (theme === "light") {

            document.body.classList.add(
                "light"
            );


            toggleTheme.textContent =
                "☀️";

        } else {

            document.body.classList.remove(
                "light"
            );


            toggleTheme.textContent =
                "🌙";

        }

    }


    toggleTheme.addEventListener(
        "click",
        () => {

            const isLight =
                document.body.classList.contains(
                    "light"
                );


            const newTheme =
                isLight
                    ? "dark"
                    : "light";


            applyTheme(
                newTheme
            );


            localStorage.setItem(
                THEME_KEY,
                newTheme
            );


            showToast(
                newTheme === "light"
                    ? "☀️ تم تفعيل الوضع النهاري"
                    : "🌙 تم تفعيل الوضع الليلي"
            );

        }
    );


    /* =================================================
       EVENTS
    ================================================= */

    genderButtons.forEach(
        button => {

            button.addEventListener(
                "click",
                () => {

                    selectGender(
                        button.dataset.gender
                    );

                    showTip();

                }
            );

        }
    );


    showTipBtn.addEventListener(
        "click",
        showTip
    );


    /* =================================================
       KEYBOARD
    ================================================= */

    document.addEventListener(
        "keydown",
        event => {

            if (
                event.key === "Enter" &&
                !event.target.matches("button")
            ) {

                showTip();

            }

        }
    );


    /* =================================================
       RESTORE SETTINGS
    ================================================= */

    const savedTheme =
        localStorage.getItem(
            THEME_KEY
        );


    if (savedTheme) {

        applyTheme(
            savedTheme
        );

    } else {

        applyTheme(
            "dark"
        );

    }


    const savedGender =
        localStorage.getItem(
            GENDER_KEY
        );


    if (
        savedGender === "male" ||
        savedGender === "female"
    ) {

        selectGender(
            savedGender
        );

    }


    /* =================================================
       INITIAL
    ================================================= */

    updateDayNumber();

});

