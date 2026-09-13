
"use strict";


// =====================================================
// الدروس
// =====================================================

const lessons = [

    {
        title: "الدرس 1: مقدمة HTML",
        content: "HTML هي لغة ترميز تُستخدم لبناء هيكل صفحات الويب.",
        codeExample:
`<!DOCTYPE html>
<html>
<head>
    <title>صفحتي الأولى</title>
</head>
<body>
    <h1>مرحبا بالعالم!</h1>
    <p>هذه أول صفحة HTML.</p>
</body>
</html>`
    },

    {
        title: "الدرس 2: العناوين",
        content: "تستخدم العناصر h1 إلى h6 لإنشاء مستويات مختلفة من العناوين.",
        codeExample:
`<h1>العنوان الرئيسي</h1>
<h2>العنوان الثاني</h2>
<h3>العنوان الثالث</h3>`
    },

    {
        title: "الدرس 3: الفقرات",
        content: "العنصر p يستخدم لكتابة الفقرات والنصوص.",
        codeExample:
`<p>هذه فقرة نصية.</p>
<p>وهذه فقرة أخرى.</p>`
    },

    {
        title: "الدرس 4: الروابط",
        content: "العنصر a يستخدم لإنشاء روابط إلى صفحات أو مواقع أخرى.",
        codeExample:
`<a href="https://www.google.com">
    اذهب إلى جوجل
</a>`
    },

    {
        title: "الدرس 5: الصور",
        content: "العنصر img يسمح بإضافة الصور إلى الصفحة.",
        codeExample:
`<img
    src="image.jpg"
    alt="صورة مثال"
    width="200"
>`
    },

    {
        title: "الدرس 6: القوائم غير المرتبة",
        content: "العنصر ul ينشئ قائمة غير مرتبة، والعنصر li يمثل كل عنصر.",
        codeExample:
`<ul>
    <li>العنصر الأول</li>
    <li>العنصر الثاني</li>
    <li>العنصر الثالث</li>
</ul>`
    },

    {
        title: "الدرس 7: القوائم المرتبة",
        content: "العنصر ol ينشئ قائمة مرتبة بالأرقام.",
        codeExample:
`<ol>
    <li>الخطوة الأولى</li>
    <li>الخطوة الثانية</li>
    <li>الخطوة الثالثة</li>
</ol>`
    },

    {
        title: "الدرس 8: الجداول",
        content: "يمكن إنشاء الجداول باستخدام table و tr و th و td.",
        codeExample:
`<table border="1">
    <tr>
        <th>الاسم</th>
        <th>العمر</th>
    </tr>

    <tr>
        <td>Ali</td>
        <td>18</td>
    </tr>
</table>`
    },

    {
        title: "الدرس 9: النماذج Forms",
        content: "النماذج تستخدم لجمع البيانات من المستخدم.",
        codeExample:
`<form>
    <label for="name">الاسم:</label>

    <input
        type="text"
        id="name"
    >

    <button type="submit">
        إرسال
    </button>
</form>`
    },

    {
        title: "الدرس 10: التعليقات",
        content: "التعليقات تساعدك على توضيح الكود ولا تظهر للمستخدم.",
        codeExample:
`<!-- هذا تعليق داخل HTML -->`
    },

    {
        title: "الدرس 11: Textarea",
        content: "textarea يستخدم لإدخال نصوص كبيرة ومتعددة الأسطر.",
        codeExample:
`<textarea
    rows="5"
    cols="40">
اكتب هنا...
</textarea>`
    },

    {
        title: "الدرس 12: Select",
        content: "select ينشئ قائمة منسدلة مع مجموعة من الخيارات.",
        codeExample:
`<select>
    <option>واحد</option>
    <option>اثنان</option>
    <option>ثلاثة</option>
</select>`
    },

    {
        title: "الدرس 13: أنواع Input",
        content: "يمكن استخدام input بأنواع مختلفة مثل text و password و checkbox و radio.",
        codeExample:
`<input type="text">

<input type="password">

<input type="checkbox">

<input
    type="radio"
    name="gender"
>`
    },

    {
        title: "الدرس 14: عناصر Inline",
        content: "عناصر مثل span و strong و em تعمل داخل السطر.",
        codeExample:
`<p>
    هذا
    <strong>نص قوي</strong>
    و
    <em>نص مائل</em>.
</p>`
    },

    {
        title: "الدرس 15: عناصر Block",
        content: "العناصر block تبدأ عادةً في سطر جديد مثل div و p والعناوين.",
        codeExample:
`<div>
    <p>فقرة داخل div</p>
</div>`
    },

    {
        title: "الدرس 16: الصور مع الروابط",
        content: "يمكن جعل الصورة نفسها رابطًا.",
        codeExample:
`<a href="https://google.com">
    <img
        src="image.jpg"
        alt="صورة"
    >
</a>`
    },

    {
        title: "الدرس 17: Audio",
        content: "يمكن استخدام audio لإضافة ملفات صوتية.",
        codeExample:
`<audio controls>
    <source
        src="audio.mp3"
        type="audio/mpeg"
    >
</audio>`
    },

    {
        title: "الدرس 18: Video",
        content: "العنصر video يسمح بإضافة فيديو داخل الصفحة.",
        codeExample:
`<video
    width="320"
    controls
>
    <source
        src="video.mp4"
        type="video/mp4"
    >
</video>`
    },

    {
        title: "الدرس 19: Iframe",
        content: "iframe يسمح بعرض مستند أو صفحة أخرى داخل الصفحة.",
        codeExample:
`<iframe
    src="https://example.com"
    width="300"
    height="200">
</iframe>`
    },

    {
        title: "الدرس 20: Meta Tags",
        content: "وسوم meta توفر معلومات مهمة للمتصفح ومحركات البحث.",
        codeExample:
`<meta charset="UTF-8">

<meta
    name="description"
    content="صفحة HTML"
>`
    },

    {
        title: "الدرس 21: Title",
        content: "عنصر title يظهر في عنوان تبويب المتصفح.",
        codeExample:
`<title>
    صفحتي الجديدة
</title>`
    },

    {
        title: "الدرس 22: CSS خارجي",
        content: "يمكن ربط ملف CSS خارجي باستخدام عنصر link.",
        codeExample:
`<link
    rel="stylesheet"
    href="style.css"
>`
    },

    {
        title: "الدرس 23: الخلفيات",
        content: "يمكن إضافة خلفية باستخدام CSS داخل الصفحة أو ملف خارجي.",
        codeExample:
`<style>
    body {
        background-image:
            url("bg.jpg");
    }
</style>`
    },

    {
        title: "الدرس 24: hr و br",
        content: "br ينقل النص لسطر جديد و hr يضيف خطًا فاصلًا.",
        codeExample:
`<p>السطر الأول</p>

<br>

<hr>

<p>السطر الثاني</p>`
    },

    {
        title: "الدرس 25: Lists مع Links",
        content: "يمكن دمج القوائم مع الروابط لإنشاء قوائم تنقل بسيطة.",
        codeExample:
`<ul>
    <li>
        <a href="#home">
            الرئيسية
        </a>
    </li>

    <li>
        <a href="#about">
            من نحن
        </a>
    </li>
</ul>`
    },

    {
        title: "الدرس 26: Header و Footer",
        content: "العناصر الدلالية header و footer تستخدم لرأس وتذييل الصفحة.",
        codeExample:
`<header>
    رأس الصفحة
</header>

<footer>
    حقوق الموقع
</footer>`
    },

    {
        title: "الدرس 27: Section و Article",
        content: "section يقسم الصفحة إلى أقسام، و article يستخدم للمحتوى المستقل.",
        codeExample:
`<section>
    <h2>قسم جديد</h2>
</section>

<article>
    <h2>مقال</h2>
    <p>محتوى المقال.</p>
</article>`
    },

    {
        title: "الدرس 28: Nav و Aside",
        content: "nav يستخدم للتنقل و aside للمحتوى الجانبي.",
        codeExample:
`<nav>
    <a href="#">الرئيسية</a>
    <a href="#">الألعاب</a>
</nav>

<aside>
    محتوى جانبي
</aside>`
    },

    {
        title: "الدرس 29: Figure و Figcaption",
        content: "تستخدم figure مع figcaption للصورة ووصفها.",
        codeExample:
`<figure>
    <img
        src="img.jpg"
        alt="مثال"
    >

    <figcaption>
        وصف الصورة
    </figcaption>
</figure>`
    },

    {
        title: "الدرس 30: Strong و Em و Mark",
        content: "هذه العناصر تستخدم لإبراز وتنسيق بعض النصوص.",
        codeExample:
`<p>
    <strong>قوي</strong>

    <em>مائل</em>

    <mark>مميز</mark>
</p>`
    },

    {
        title: "الدرس 31: Abbr",
        content: "العنصر abbr يستخدم لعرض اختصار مع شرح عند الوقوف عليه.",
        codeExample:
`<abbr
    title="HyperText Markup Language">
    HTML
</abbr>`
    },

    {
        title: "الدرس 32: Blockquote",
        content: "blockquote يستخدم لعرض اقتباسات طويلة.",
        codeExample:
`<blockquote>
    هذا اقتباس من نص آخر.
</blockquote>`
    },

    {
        title: "الدرس 33: Code",
        content: "العنصر code يستخدم لعرض جزء من التعليمات البرمجية داخل النص.",
        codeExample:
`<p>
    استخدم
    <code>
        &lt;div&gt;
    </code>
</p>`
    },

    {
        title: "الدرس 34: Pre",
        content: "pre يحافظ على المسافات والأسطر كما هي.",
        codeExample:
`<pre>
السطر الأول
    السطر الثاني
        السطر الثالث
</pre>`
    },

    {
        title: "الدرس 35: Small",
        content: "small يعرض النص بحجم أصغر من النص العادي.",
        codeExample:
`<p>
    نص عادي
    <small>
        نص صغير
    </small>
</p>`
    },

    {
        title: "الدرس 36: Sub و Sup",
        content: "sub للنص السفلي و sup للنص العلوي.",
        codeExample:
`H<sub>2</sub>O

X<sup>2</sup>`
    },

    {
        title: "الدرس 37: Description Lists",
        content: "dl و dt و dd تستخدم لإنشاء قوائم تعريفية.",
        codeExample:
`<dl>

    <dt>HTML</dt>

    <dd>
        لغة ترميز صفحات الويب
    </dd>

</dl>`
    },

    {
        title: "الدرس 38: Details و Summary",
        content: "details يسمح بإنشاء جزء قابل للفتح والإغلاق.",
        codeExample:
`<details>
    <summary>
        اضغط هنا
    </summary>

    هذا هو المحتوى المخفي.
</details>`
    },

    {
        title: "الدرس 39: Audio و Video HTML5",
        content: "في هذا الدرس نجمع بين الصوت والفيديو باستخدام عناصر HTML5 الحديثة.",
        codeExample:
`<video
    controls
    src="video.mp4">
</video>

<audio
    controls
    src="audio.mp3">
</audio>`
    },

    {
        title: "الدرس 40: مشروع صغير",
        content: "تهانينا! الآن سنجمع الأساسيات في مشروع HTML صغير.",
        codeExample:
`<!DOCTYPE html>

<html>

<head>
    <title>
        مشروعي
    </title>
</head>

<body>

    <header>
        <h1>
            موقعي الأول
        </h1>
    </header>

    <main>

        <h2>
            مرحبًا بك
        </h2>

        <p>
            أنا أتعلم HTML
            مع FUN X.
        </p>

        <button>
            اضغط هنا
        </button>

    </main>

</body>

</html>`
    }

];


// =====================================================
// العناصر
// =====================================================

const titleEl =
    document.getElementById("lesson-title");

const contentEl =
    document.getElementById("lesson-content");

const codeEl =
    document.getElementById("lesson-code");

const editorEl =
    document.getElementById("editor");

const previewEl =
    document.getElementById("preview");

const counterEl =
    document.getElementById("lesson-counter");

const progressBar =
    document.getElementById("lessonProgress");

const progressPercent =
    document.getElementById("lessonPercent");

const globalProgressPercent =
    document.getElementById("progressPercent");

const completionText =
    document.getElementById("completionText");

const lessonBadge =
    document.getElementById("lessonBadge");

const saveStatus =
    document.getElementById("saveStatus");

const lessonList =
    document.getElementById("lessonList");

const lessonSearch =
    document.getElementById("lessonSearch");

const toast =
    document.getElementById("toast");


// =====================================================
// التخزين
// =====================================================

let currentLesson =
    Number(
        localStorage.getItem("funx_html_currentLesson")
    ) || 0;


let savedCodes =
    readStorage(
        "funx_html_savedCodes",
        {}
    );


let completedLessons =
    readStorage(
        "funx_html_completedLessons",
        []
    );


let isRunning =
    false;


// =====================================================
// قراءة LocalStorage بأمان
// =====================================================

function readStorage(key, fallback) {

    try {

        const value =
            localStorage.getItem(key);

        return value
            ? JSON.parse(value)
            : fallback;

    } catch {

        return fallback;
    }
}


// =====================================================
// حفظ LocalStorage
// =====================================================

function saveData() {

    localStorage.setItem(
        "funx_html_savedCodes",
        JSON.stringify(savedCodes)
    );

    localStorage.setItem(
        "funx_html_completedLessons",
        JSON.stringify(completedLessons)
    );

    localStorage.setItem(
        "funx_html_currentLesson",
        currentLesson
    );
}


// =====================================================
// عرض الدرس
// =====================================================

function showLesson(index) {

    if (
        index < 0 ||
        index >= lessons.length
    ) {
        return;
    }


    currentLesson = index;

    const lesson =
        lessons[currentLesson];


    titleEl.textContent =
        lesson.title;


    contentEl.textContent =
        lesson.content;


    codeEl.textContent =
        lesson.codeExample;


    lessonBadge.textContent =
        `LESSON ${String(index + 1).padStart(2, "0")}`;


    const lessonProgress =
        Math.round(
            ((index + 1) /
                lessons.length) * 100
        );


    progressBar.style.width =
        `${lessonProgress}%`;


    progressPercent.textContent =
        `${lessonProgress}%`;


    counterEl.textContent =
        `درس ${index + 1} من ${lessons.length}`;


    const savedCode =
        savedCodes[currentLesson];


    editorEl.value =
        typeof savedCode === "string"
            ? savedCode
            : "";


    previewEl.srcdoc = "";


    updateGlobalProgress();

    renderLessonList(
        lessonSearch.value
    );


    saveData();


    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
}


// =====================================================
// قائمة الدروس
// =====================================================

function renderLessonList(filter = "") {

    lessonList.innerHTML = "";


    const normalizedFilter =
        filter
            .trim()
            .toLowerCase();


    let visibleCount = 0;


    lessons.forEach(
        (lesson, index) => {

            const match =
                !normalizedFilter ||
                lesson.title
                    .toLowerCase()
                    .includes(
                        normalizedFilter
                    );


            if (!match) {
                return;
            }


            visibleCount++;


            const button =
                document.createElement("button");


            button.type =
                "button";


            button.className =
                "lesson-item";


            if (
                index ===
                currentLesson
            ) {
                button.classList.add(
                    "active"
                );
            }


            if (
                completedLessons.includes(
                    index
                )
            ) {
                button.classList.add(
                    "completed"
                );
            }


            const completed =
                completedLessons.includes(
                    index
                );


            button.innerHTML = `
                <span class="lesson-number">
                    ${String(index + 1).padStart(2, "0")}
                </span>

                <span class="lesson-name">
                    ${escapeHTML(
                        lesson.title.replace(
                            /^الدرس \d+:\s*/i,
                            ""
                        )
                    )}
                </span>

                <span class="lesson-state">
                    ${completed ? "✓" : "›"}
                </span>
            `;


            button.addEventListener(
                "click",
                () => {

                    showLesson(index);

                }
            );


            lessonList.appendChild(
                button
            );
        }
    );


    if (visibleCount === 0) {

        const empty =
            document.createElement(
                "div"
            );


        empty.className =
            "lesson-empty";


        empty.innerHTML =
            "🔎<br>لا يوجد درس مطابق";


        lessonList.appendChild(
            empty
        );
    }
}


// =====================================================
// إكمال الدرس
// =====================================================

function markCurrentLessonComplete() {

    if (
        !completedLessons.includes(
            currentLesson
        )
    ) {

        completedLessons.push(
            currentLesson
        );

        completedLessons.sort(
            (a, b) => a - b
        );

        saveData();

        updateGlobalProgress();

        renderLessonList(
            lessonSearch.value
        );
    }
}


// =====================================================
// تحديث التقدم العام
// =====================================================

function updateGlobalProgress() {

    const completed =
        completedLessons.length;


    const percentage =
        Math.round(
            (completed /
                lessons.length) * 100
        );


    globalProgressPercent.textContent =
        `${percentage}%`;


    completionText.textContent =
        `${completed} من ${lessons.length} مكتملة`;
}


// =====================================================
// تشغيل الكود
// =====================================================

function runCode() {

    const code =
        editorEl.value.trim();


    if (!code) {

        showToast(
            "اكتب بعض كود HTML أولًا ✍️"
        );

        editorEl.focus();

        return;
    }


    previewEl.srcdoc =
        createPreviewDocument(
            code
        );


    markCurrentLessonComplete();


    isRunning = true;


    saveStatus.textContent =
        "تم التشغيل ✓";


    showToast(
        "تم تشغيل الكود 🚀"
    );
}


// =====================================================
// إنشاء المعاينة
// =====================================================

function createPreviewDocument(code) {

    if (
        /<!doctype|<html[\s>]/i.test(
            code
        )
    ) {

        return code;
    }


    return `
<!DOCTYPE html>
<html lang="ar" dir="rtl">

<head>

<meta charset="UTF-8">

<meta name="viewport"
content="width=device-width, initial-scale=1.0">

<style>

    body {
        margin: 0;
        padding: 25px;
        font-family:
            Arial,
            Tahoma,
            sans-serif;
        background:
            #ffffff;
        color:
            #111827;
    }

    img {
        max-width: 100%;
    }

    button,
    input,
    textarea,
    select {
        font: inherit;
    }

</style>

</head>

<body>

${code}

</body>

</html>
`;
}


// =====================================================
// حفظ الكود
// =====================================================

let saveTimer = null;

editorEl.addEventListener(
    "input",
    () => {

        savedCodes[currentLesson] =
            editorEl.value;


        saveStatus.textContent =
            "جاري الحفظ...";


        clearTimeout(saveTimer);


        saveTimer =
            setTimeout(
                () => {

                    saveData();

                    saveStatus.textContent =
                        "محفوظ تلقائيًا ✓";

                },
                450
            );
    }
);


// =====================================================
// نسخ كود المحرر
// =====================================================

async function copyEditorCode() {

    const text =
        editorEl.value;


    if (!text) {

        showToast(
            "لا يوجد كود لنسخه 📋"
        );

        return;
    }


    await copyText(
        text
    );


    showToast(
        "تم نسخ الكود ✓"
    );
}


// =====================================================
// نسخ المثال
// =====================================================

async function copyExample() {

    const text =
        codeEl.textContent;


    await copyText(
        text
    );


    showToast(
        "تم نسخ المثال ✓"
    );
}


// =====================================================
// Clipboard
// =====================================================

async function copyText(text) {

    try {

        await navigator.clipboard.writeText(
            text
        );

    } catch {

        const textarea =
            document.createElement(
                "textarea"
            );


        textarea.value =
            text;


        textarea.style.position =
            "fixed";

        textarea.style.opacity =
            "0";


        document.body.appendChild(
            textarea
        );


        textarea.select();


        document.execCommand(
            "copy"
        );


        textarea.remove();
    }
}


// =====================================================
// مسح المعاينة
// =====================================================

function clearPreview() {

    previewEl.srcdoc = "";

    showToast(
        "تم مسح المعاينة 🧹"
    );
}


// =====================================================
// الدرس التالي
// =====================================================

function nextLesson() {

    if (
        currentLesson <
        lessons.length - 1
    ) {

        currentLesson++;

        showLesson(
            currentLesson
        );

        return;
    }


    markCurrentLessonComplete();


    showToast(
        "🎉 وصلت إلى آخر درس!"
    );
}


// =====================================================
// الدرس السابق
// =====================================================

function previousLesson() {

    if (
        currentLesson >
        0
    ) {

        currentLesson--;

        showLesson(
            currentLesson
        );

        return;
    }


    showToast(
        "أنت في أول درس 👈"
    );
}


// =====================================================
// البحث
// =====================================================

lessonSearch.addEventListener(
    "input",
    () => {

        renderLessonList(
            lessonSearch.value
        );
    }
);


// =====================================================
// الأحداث
// =====================================================

document
    .getElementById("next-btn")
    .addEventListener(
        "click",
        nextLesson
    );


document
    .getElementById("prev-btn")
    .addEventListener(
        "click",
        previousLesson
    );


document
    .getElementById("run-btn")
    .addEventListener(
        "click",
        runCode
    );


document
    .getElementById("copy-btn")
    .addEventListener(
        "click",
        copyEditorCode
    );


document
    .getElementById("copy-example-btn")
    .addEventListener(
        "click",
        copyExample
    );


document
    .getElementById("clear-preview-btn")
    .addEventListener(
        "click",
        clearPreview
    );


// =====================================================
// الوضع الليلي / النهاري
// =====================================================

const modeToggle =
    document.getElementById(
        "mode-toggle"
    );


const savedTheme =
    localStorage.getItem(
        "funx_html_theme"
    );


if (
    savedTheme === "light"
) {

    document.body.classList.add(
        "light"
    );

    modeToggle.textContent =
        "☀️";
}


modeToggle.addEventListener(
    "click",
    () => {

        document.body.classList.toggle(
            "light"
        );


        const isLight =
            document.body.classList.contains(
                "light"
            );


        modeToggle.textContent =
            isLight
                ? "☀️"
                : "🌙";


        localStorage.setItem(
            "funx_html_theme",
            isLight
                ? "light"
                : "dark"
        );
    }
);


// =====================================================
// Toast
// =====================================================

let toastTimer = null;

function showToast(message) {

    clearTimeout(
        toastTimer
    );


    toast.textContent =
        message;


    toast.classList.add(
        "show"
    );


    toastTimer =
        setTimeout(
            () => {

                toast.classList.remove(
                    "show"
                );

            },
            2200
        );
}


// =====================================================
// تنظيف النصوص
// =====================================================

function escapeHTML(text) {

    return text
        .replace(
            /&/g,
            "&amp;"
        )
        .replace(
            /</g,
            "&lt;"
        )
        .replace(
            />/g,
            "&gt;"
        )
        .replace(
            /"/g,
            "&quot;"
        )
        .replace(
            /'/g,
            "&#039;"
        );
}


// =====================================================
// إنشاء النجوم
// =====================================================

const stars =
    document.getElementById(
        "stars"
    );


for (
    let i = 0;
    i < 90;
    i++
) {

    const star =
        document.createElement(
            "span"
        );


    star.className =
        "star";


    star.style.left =
        `${Math.random() * 100}%`;


    star.style.top =
        `${Math.random() * 100}%`;


    const size =
        Math.random() * 2 + 1;


    star.style.width =
        `${size}px`;


    star.style.height =
        `${size}px`;


    star.style.animationDelay =
        `${Math.random() * 4}s`;


    star.style.animationDuration =
        `${2 + Math.random() * 4}s`;


    stars.appendChild(
        star
    );
}


// =====================================================
// البداية
// =====================================================

renderLessonList();

updateGlobalProgress();

showLesson(
    Math.min(
        currentLesson,
        lessons.length - 1
    )
);

