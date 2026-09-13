/* =====================================================
   سُبحتي — TASBIH APP
===================================================== */

document.addEventListener("DOMContentLoaded", () => {

    "use strict";


    /* =================================================
       DEFAULT AZKAR
    ================================================= */

    const DEFAULT_AZKAR = [

        "سُبْحَانَ اللهِ",

        "الْحَمْدُ للهِ",

        "اللَّهُ أَكْبَرُ",

        "لا حَوْلَ وَلا قُوَّةَ إِلا بِاللَّهِ",

        "أَسْتَغْفِرُ اللَّهَ",

        "اللَّهُمَّ صَلِّ وَسَلِّمْ عَلَى نَبِيِّنَا مُحَمَّد",

        "لا إله إلا الله",

        "سُبْحَانَ اللهِ وَبِحَمْدِهِ",

        "اللهم ارحمنا",

        "اللهم اغفر لنا",

        "اللهم أعنّي على ذكرك وشكرك وحسن عبادتك",

        "يا حيّ يا قيوم برحمة منك أستغيث",

        "اللهم أصلح لي ديني",

        "اللهم بارك لنا في أوقاتنا",

        "اللهم ارزقني الصبر",

        "اللهم اجعلني من الشاكرين",

        "اللهم اجعلني من التوّابين",

        "اللهم ارزقني الهداية",

        "اللهم اهدِ قلبي",

        "اللهم طهر قلبي",

        "اللهم ثبتني على الطاعة",

        "اللهم اجعل عملي خالصاً لوجهك",

        "اللهم اجعل لي من كل هم فرجاً",

        "اللهم اجعل لي في قلبي نوراً",

        "اللهم اسألك العفو والعافية",

        "استغفر الله وأتوب اليه",

        "يا رب ارحم ضعف قلبي",

        "اللهم ارحم موتانا",

        "اللهم اجعلنا من عبادك المقبولين"

    ];


    /* =================================================
       STATE
    ================================================= */

    const STORAGE_KEY = "tasbih_azkar_v3";


    let state = {

        count: 0,

        total: 0,

        target: null,

        azkar: DEFAULT_AZKAR.slice(),

        currentIndex: 0,

        autoChange: false,

        autoAfter: 33,

        beadsPerRow: 11

    };


    /* =================================================
       LOAD STORAGE
    ================================================= */

    try {

        const saved =
            localStorage.getItem(STORAGE_KEY);


        if (saved) {

            const parsed =
                JSON.parse(saved);


            Object.assign(
                state,
                parsed
            );


            if (
                !Array.isArray(state.azkar) ||
                state.azkar.length === 0
            ) {

                state.azkar =
                    DEFAULT_AZKAR.slice();

                state.currentIndex = 0;

            }

        }

    } catch (error) {

        console.warn(
            "تعذر تحميل البيانات المحفوظة",
            error
        );

    }


    /* =================================================
       ELEMENTS
    ================================================= */

    const countEl =
        document.getElementById("count");


    const totalEl =
        document.getElementById("total");


    const currentZekrEl =
        document.getElementById("currentZekr");


    const beadsWrap =
        document.getElementById("beadsWrap");


    const targetInfo =
        document.getElementById("targetInfo");


    const azkarListEl =
        document.getElementById("azkarList");


    const targetInput =
        document.getElementById("targetInput");


    const autoChange =
        document.getElementById("autoChange");


    const autoAfter =
        document.getElementById("autoAfter");


    const newZekrInput =
        document.getElementById("newZekrInput");


    const toast =
        document.getElementById("toast");


    /* =================================================
       SAVE
    ================================================= */

    function saveState() {

        try {

            localStorage.setItem(
                STORAGE_KEY,
                JSON.stringify(state)
            );

        } catch (error) {

            console.warn(
                "تعذر حفظ البيانات",
                error
            );

        }

    }


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

            }, 2200);

    }


    /* =================================================
       RENDER
    ================================================= */

    function render() {

        countEl.textContent =
            state.count;


        totalEl.textContent =
            state.total;


        /* Current Zekr */

        if (
            state.azkar &&
            state.azkar.length > 0
        ) {

            const index =
                (
                    state.currentIndex %
                    state.azkar.length +
                    state.azkar.length
                ) %
                state.azkar.length;


            currentZekrEl.textContent =
                state.azkar[index];

        } else {

            currentZekrEl.textContent =
                "— لا يوجد أذكار —";

        }


        /* Target */

        if (
            state.target &&
            state.target > 0
        ) {

            const remaining =
                Math.max(
                    0,
                    state.target -
                    state.count
                );


            targetInfo.textContent =
                `الهدف: ${state.target} — تبقى ${remaining} تسبيحات`;

        } else {

            targetInfo.textContent =
                "لم يتم تحديد هدف";

        }


        renderBeads();

        renderAzkarList();

        saveState();

    }


    /* =================================================
       BEADS
    ================================================= */

    function renderBeads() {

        beadsWrap.innerHTML = "";


        const perRow =
            state.beadsPerRow || 11;


        /*
         * نعرض 33 خرزة
         */

        const totalBeads = 33;


        const activeIndex =
            state.count % totalBeads;


        for (
            let i = 0;
            i < totalBeads;
            i++
        ) {

            const bead =
                document.createElement("div");


            bead.className =
                "bead";


            /*
             * الخرزة النشطة
             */

            if (
                i === activeIndex &&
                state.count > 0
            ) {

                bead.classList.add(
                    "active"
                );

            }


            beadsWrap.appendChild(
                bead
            );

        }

    }


    /* =================================================
       AZKAR LIST
    ================================================= */

    function renderAzkarList() {

        azkarListEl.innerHTML = "";


        state.azkar.forEach(
            (zekr, index) => {

                const item =
                    document.createElement("div");


                item.className =
                    "azkar-item";


                const text =
                    document.createElement("div");


                text.className =
                    "azkar-text";


                text.textContent =
                    zekr;


                const actions =
                    document.createElement("div");


                actions.className =
                    "azkar-actions";


                /* SELECT */

                const selectBtn =
                    document.createElement(
                        "button"
                    );


                selectBtn.className =
                    "btn primary";


                selectBtn.textContent =
                    "اختيار";


                selectBtn.addEventListener(
                    "click",
                    () => {

                        state.currentIndex =
                            index;

                        render();

                        showToast(
                            "✅ تم اختيار الذكر"
                        );

                    }
                );


                /* DELETE */

                const deleteBtn =
                    document.createElement(
                        "button"
                    );


                deleteBtn.className =
                    "btn";


                deleteBtn.textContent =
                    "حذف";


                deleteBtn.addEventListener(
                    "click",
                    () => {

                        const confirmed =
                            confirm(
                                "هل تريد حذف هذا الذكر؟"
                            );


                        if (!confirmed) {
                            return;
                        }


                        state.azkar.splice(
                            index,
                            1
                        );


                        if (
                            state.azkar.length === 0
                        ) {

                            state.currentIndex = 0;

                        } else if (
                            state.currentIndex >=
                            state.azkar.length
                        ) {

                            state.currentIndex =
                                state.azkar.length -
                                1;

                        }


                        render();

                        showToast(
                            "🗑 تم حذف الذكر"
                        );

                    }
                );


                actions.appendChild(
                    selectBtn
                );


                actions.appendChild(
                    deleteBtn
                );


                item.appendChild(
                    text
                );


                item.appendChild(
                    actions
                );


                azkarListEl.appendChild(
                    item
                );

            }
        );


        /* Empty */

        if (
            state.azkar.length === 0
        ) {

            azkarListEl.innerHTML = `
                <div style="
                    text-align:center;
                    padding:25px;
                    color:#87958f;
                    font-size:12px;
                ">
                    قائمة الأذكار فارغة.
                    <br>
                    أضف ذكرًا جديدًا.
                </div>
            `;

        }

    }


    /* =================================================
       ADD TASBIH
    ================================================= */

    function addOne(amount = 1) {

        state.count += amount;

        state.total += amount;


        /*
         * Auto change
         */

        if (
            state.autoChange &&
            state.autoAfter > 0 &&
            state.count %
                state.autoAfter === 0
        ) {

            changeZekrRandom();

        }


        render();

        checkTarget();

    }


    /* =================================================
       RESET COUNT
    ================================================= */

    function resetCount() {

        const confirmed =
            confirm(
                "هل تريد إعادة العَدّ إلى صفر؟"
            );


        if (!confirmed) {
            return;
        }


        state.count = 0;


        /*
         * لا نمسح الإجمالي هنا
         * إلا إذا كان المستخدم يريد ذلك
         */

        render();


        showToast(
            "↻ تمت إعادة ضبط العد"
        );

    }


    /* =================================================
       CLEAR ALL
    ================================================= */

    function clearStorage() {

        const confirmed =
            confirm(
                "سيتم حذف الحفظ وإرجاع الإعدادات الافتراضية. هل أنت متأكد؟"
            );


        if (!confirmed) {
            return;
        }


        localStorage.removeItem(
            STORAGE_KEY
        );


        state = {

            count: 0,

            total: 0,

            target: null,

            azkar:
                DEFAULT_AZKAR.slice(),

            currentIndex: 0,

            autoChange: false,

            autoAfter: 33,

            beadsPerRow: 11

        };


        autoChange.checked =
            false;


        autoAfter.value =
            33;


        targetInput.value =
            "";


        render();


        showToast(
            "🧹 تم مسح الحفظ"
        );

    }


    /* =================================================
       TARGET
    ================================================= */

    function setTarget() {

        const value =
            parseInt(
                targetInput.value,
                10
            );


        if (
            Number.isNaN(value) ||
            value <= 0
        ) {

            showToast(
                "⚠️ أدخل رقمًا صحيحًا"
            );

            return;

        }


        state.target =
            value;


        render();


        showToast(
            "🎯 تم تعيين الهدف"
        );

    }


    /* =================================================
       CHECK TARGET
    ================================================= */

    function checkTarget() {

        if (
            state.target &&
            state.count >= state.target
        ) {

            setTimeout(() => {

                alert(
                    `ما شاء الله 🤍\nوصلت إلى هدف ${state.target} تسبيحة`
                );

            }, 150);

        }

    }


    /* =================================================
       RANDOM ZEKR
    ================================================= */

    function changeZekrRandom() {

        if (
            !state.azkar ||
            state.azkar.length === 0
        ) {

            return;

        }


        if (
            state.azkar.length === 1
        ) {

            state.currentIndex = 0;

            render();

            return;

        }


        let newIndex =
            state.currentIndex;


        let attempts = 0;


        while (
            newIndex ===
            state.currentIndex &&
            attempts < 10
        ) {

            newIndex =
                Math.floor(
                    Math.random() *
                    state.azkar.length
                );


            attempts++;

        }


        state.currentIndex =
            newIndex;


        render();


        showToast(
            "✨ تم تغيير الذكر"
        );

    }


    /* =================================================
       NEXT
    ================================================= */

    function nextZekr() {

        if (
            !state.azkar ||
            state.azkar.length === 0
        ) {

            return;

        }


        state.currentIndex =
            (
                state.currentIndex + 1
            ) %
            state.azkar.length;


        render();


        showToast(
            "➡️ الذكر التالي"
        );

    }


    /* =================================================
       PREVIOUS
    ================================================= */

    function prevZekr() {

        if (
            !state.azkar ||
            state.azkar.length === 0
        ) {

            return;

        }


        state.currentIndex =
            (
                state.currentIndex - 1 +
                state.azkar.length
            ) %
            state.azkar.length;


        render();


        showToast(
            "⬅️ الذكر السابق"
        );

    }


    /* =================================================
       ADD NEW ZEKR
    ================================================= */

    function addNewZekr() {

        const text =
            (
                newZekrInput.value ||
                ""
            ).trim();


        if (!text) {

            showToast(
                "⚠️ اكتب الذكر أولًا"
            );

            newZekrInput.focus();

            return;

        }


        state.azkar.push(
            text
        );


        state.currentIndex =
            state.azkar.length - 1;


        newZekrInput.value =
            "";


        render();


        showToast(
            "✅ تم إضافة الذكر"
        );

    }


    /* =================================================
       RESET AZKAR
    ================================================= */

    function resetAzkar() {

        const confirmed =
            confirm(
                "سيتم حذف جميع الأذكار المضافة واستعادة القائمة الافتراضية."
            );


        if (!confirmed) {
            return;
        }


        state.azkar =
            DEFAULT_AZKAR.slice();


        state.currentIndex =
            0;


        render();


        showToast(
            "↻ تم استعادة الأذكار"
        );

    }


    /* =================================================
       BUTTON EVENTS
    ================================================= */

    document
        .getElementById("addBtn")
        .addEventListener(
            "click",
            () => addOne(1)
        );


    document
        .getElementById("add33Btn")
        .addEventListener(
            "click",
            () => addOne(33)
        );


    document
        .getElementById("resetBtn")
        .addEventListener(
            "click",
            resetCount
        );


    document
        .getElementById("clearBtn")
        .addEventListener(
            "click",
            clearStorage
        );


    document
        .getElementById("setTargetBtn")
        .addEventListener(
            "click",
            setTarget
        );


    document
        .getElementById("changeZekrBtn")
        .addEventListener(
            "click",
            changeZekrRandom
        );


    document
        .getElementById("nextZekrBtn")
        .addEventListener(
            "click",
            nextZekr
        );


    document
        .getElementById("prevZekrBtn")
        .addEventListener(
            "click",
            prevZekr
        );


    document
        .getElementById("addZekrBtn")
        .addEventListener(
            "click",
            addNewZekr
        );


    document
        .getElementById("resetAzkarBtn")
        .addEventListener(
            "click",
            resetAzkar
        );


    /* =================================================
       AUTO SETTINGS
    ================================================= */

    autoChange.addEventListener(
        "change",
        event => {

            state.autoChange =
                event.target.checked;


            saveState();

        }
    );


    autoAfter.addEventListener(
        "change",
        event => {

            const value =
                parseInt(
                    event.target.value,
                    10
                );


            if (
                !Number.isNaN(value) &&
                value > 0
            ) {

                state.autoAfter =
                    value;

            } else {

                state.autoAfter =
                    33;

                autoAfter.value =
                    33;

            }


            saveState();

        }
    );


    /* =================================================
       BEADS CLICK
    ================================================= */

    beadsWrap.addEventListener(
        "click",
        () => {

            addOne(1);

        }
    );


    /* =================================================
       KEYBOARD
    ================================================= */

    document.addEventListener(
        "keydown",
        event => {

            /*
             * Space
             */

            if (
                event.code === "Space"
            ) {

                /*
                 * لا نعمل أثناء الكتابة
                 */

                if (
                    document.activeElement.tagName ===
                    "INPUT"
                ) {

                    return;

                }


                event.preventDefault();

                addOne(1);

            }


            /*
             * + أو =
             */

            if (
                event.key === "+" ||
                event.key === "="
            ) {

                if (
                    document.activeElement.tagName ===
                    "INPUT"
                ) {

                    return;

                }


                addOne(1);

            }

        }
    );


    /* =================================================
       ENTER TO ADD ZEKR
    ================================================= */

    newZekrInput.addEventListener(
        "keydown",
        event => {

            if (
                event.key === "Enter"
            ) {

                event.preventDefault();

                addNewZekr();

            }

        }
    );


    /* =================================================
       INITIAL VALUES
    ================================================= */

    autoChange.checked =
        !!state.autoChange;


    autoAfter.value =
        state.autoAfter || 33;


    if (state.target) {

        targetInput.value =
            state.target;

    }


    /* =================================================
       INITIAL RENDER
    ================================================= */

    render();

});