
"use strict";


// =====================================================
// ELEMENTS
// =====================================================

const body =
    document.body;

const modeToggle =
    document.getElementById("modeToggle");

const taskInput =
    document.getElementById("taskInput");

const subjectSelect =
    document.getElementById("subjectSelect");

const addTaskBtn =
    document.getElementById("addTask");

const taskList =
    document.getElementById("taskList");

const remainingTasks =
    document.getElementById("remainingTasks");

const completedTasks =
    document.getElementById("completedTasks");

const studySessionsEl =
    document.getElementById("studySessions");

const streakEl =
    document.getElementById("streak");

const taskProgress =
    document.getElementById("taskProgress");

const timerEl =
    document.getElementById("timer");

const timerMode =
    document.getElementById("timerMode");

const startTimerBtn =
    document.getElementById("startTimer");

const pauseTimerBtn =
    document.getElementById("pauseTimer");

const resetTimerBtn =
    document.getElementById("resetTimer");

const tipBox =
    document.getElementById("tipBox");

const newTipBtn =
    document.getElementById("newTip");

const toast =
    document.getElementById("toast");

const studyGoal =
    document.getElementById("studyGoal");

const goalBar =
    document.getElementById("goalBar");

const goalPercent =
    document.getElementById("goalPercent");

const completeGoalBtn =
    document.getElementById("completeGoal");


// =====================================================
// STORAGE
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


function saveStorage(key, value) {

    localStorage.setItem(
        key,
        JSON.stringify(value)
    );
}


// =====================================================
// TASKS
// =====================================================

let tasks =
    readStorage(
        "funx_school_tasks",
        []
    );


function saveTasks() {

    saveStorage(
        "funx_school_tasks",
        tasks
    );
}


function renderTasks() {

    taskList.innerHTML = "";


    if (!tasks.length) {

        taskList.innerHTML = `
            <li class="empty-task">
                📚 لا توجد مهام حاليًا
                <small>
                    أضف أول مهمة للمدرسة!
                </small>
            </li>
        `;

        updateTaskStats();

        return;
    }


    tasks.forEach(
        (task, index) => {

            const li =
                document.createElement("li");


            li.className =
                `task-item ${
                    task.done
                        ? "done"
                        : ""
                }`;


            li.innerHTML = `

                <button
                    class="task-check"
                    aria-label="تحديد المهمة">
                    ${task.done ? "✓" : ""}
                </button>


                <div class="task-content">

                    <strong>
                        ${escapeHTML(task.text)}
                    </strong>

                    <span>
                        ${escapeHTML(task.subject)}
                    </span>

                </div>


                <button
                    class="delete-task"
                    aria-label="حذف المهمة">
                    🗑️
                </button>
            `;


            li.querySelector(
                ".task-check"
            ).addEventListener(
                "click",
                () => {

                    tasks[index].done =
                        !tasks[index].done;

                    saveTasks();

                    renderTasks();

                }
            );


            li.querySelector(
                ".delete-task"
            ).addEventListener(
                "click",
                () => {

                    tasks.splice(
                        index,
                        1
                    );

                    saveTasks();

                    renderTasks();

                }
            );


            taskList.appendChild(
                li
            );
        }
    );


    updateTaskStats();
}


function addTask() {

    const text =
        taskInput.value.trim();

    const subject =
        subjectSelect.value;


    if (!text) {

        showToast(
            "اكتب المهمة أولًا ✍️"
        );

        taskInput.focus();

        return;
    }


    tasks.unshift({

        text,
        subject,
        done: false,

        id:
            Date.now()

    });


    saveTasks();

    renderTasks();


    taskInput.value = "";

    showToast(
        "تمت إضافة المهمة ✅"
    );
}


function updateTaskStats() {

    const total =
        tasks.length;

    const completed =
        tasks.filter(
            task => task.done
        ).length;

    const remaining =
        total - completed;


    remainingTasks.textContent =
        remaining;

    completedTasks.textContent =
        completed;


    const percent =
        total
            ? Math.round(
                completed /
                total *
                100
            )
            : 0;


    taskProgress.textContent =
        `${percent}%`;
}


addTaskBtn.addEventListener(
    "click",
    addTask
);


taskInput.addEventListener(
    "keydown",
    event => {

        if (
            event.key === "Enter"
        ) {

            addTask();
        }
    }
);


// =====================================================
// TIMER
// =====================================================

let timerSeconds =
    25 * 60;

let timerInterval =
    null;

let timerRunning =
    false;


function formatTime(seconds) {

    const minutes =
        Math.floor(
            seconds / 60
        );

    const secs =
        seconds % 60;


    return (
        String(minutes)
            .padStart(2, "0")
        +
        ":"
        +
        String(secs)
            .padStart(2, "0")
    );
}


function updateTimer() {

    timerEl.textContent =
        formatTime(
            timerSeconds
        );
}


function startTimer() {

    if (timerRunning) {
        return;
    }


    timerRunning = true;

    timerMode.textContent =
        "تركيز";

    startTimerBtn.textContent =
        "▶ مستمر";


    timerInterval =
        setInterval(
            () => {

                if (
                    timerSeconds <= 0
                ) {

                    clearInterval(
                        timerInterval
                    );

                    timerInterval =
                        null;

                    timerRunning =
                        false;

                    timerMode.textContent =
                        "انتهت الجلسة";

                    startTimerBtn.textContent =
                        "▶ ابدأ";

                    recordStudySession();

                    showToast(
                        "🎉 انتهت جلسة المذاكرة!"
                    );

                    return;
                }


                timerSeconds--;

                updateTimer();

            },
            1000
        );
}


function pauseTimer() {

    clearInterval(
        timerInterval
    );

    timerInterval =
        null;

    timerRunning =
        false;

    timerMode.textContent =
        "متوقف";

    startTimerBtn.textContent =
        "▶ استكمال";
}


function resetTimer() {

    clearInterval(
        timerInterval
    );

    timerInterval =
        null;

    timerRunning =
        false;

    timerSeconds =
        25 * 60;

    timerMode.textContent =
        "تركيز";

    startTimerBtn.textContent =
        "▶ ابدأ";

    updateTimer();
}


function setTimer(minutes) {

    clearInterval(
        timerInterval
    );

    timerInterval =
        null;

    timerRunning =
        false;

    timerSeconds =
        minutes * 60;

    timerMode.textContent =
        "جاهز";

    startTimerBtn.textContent =
        "▶ ابدأ";

    updateTimer();

    showToast(
        `تم اختيار ${minutes} دقيقة ⏱️`
    );
}


document
    .querySelectorAll(
        ".timer-presets button"
    )
    .forEach(button => {

        button.addEventListener(
            "click",
            () => {

                setTimer(
                    Number(
                        button.dataset.minutes
                    )
                );

            }
        );
    });


startTimerBtn.addEventListener(
    "click",
    startTimer
);


pauseTimerBtn.addEventListener(
    "click",
    pauseTimer
);


resetTimerBtn.addEventListener(
    "click",
    resetTimer
);


// =====================================================
// STUDY SESSIONS
// =====================================================

let studySessions =
    Number(
        localStorage.getItem(
            "funx_study_sessions"
        )
    ) || 0;


let goalSessions =
    Number(
        localStorage.getItem(
            "funx_goal_sessions"
        )
    ) || 0;


function saveSessionData() {

    localStorage.setItem(
        "funx_study_sessions",
        studySessions
    );

    localStorage.setItem(
        "funx_goal_sessions",
        goalSessions
    );
}


function updateSessionUI() {

    studySessionsEl.textContent =
        studySessions;

    const goal =
        2;

    const percent =
        Math.min(
            100,
            Math.round(
                goalSessions /
                goal *
                100
            )
        );


    studyGoal.textContent =
        `${Math.min(goalSessions, goal)} / ${goal} جلسة`;


    goalBar.style.width =
        `${percent}%`;


    goalPercent.textContent =
        `${percent}%`;
}


function recordStudySession() {

    studySessions++;

    goalSessions++;

    saveSessionData();

    updateSessionUI();

    updateStreak();
}


completeGoalBtn.addEventListener(
    "click",
    () => {

        recordStudySession();

        showToast(
            "تم تسجيل جلسة مذاكرة ✅"
        );
    }
);


// =====================================================
// STREAK
// =====================================================

function todayKey() {

    const now =
        new Date();

    return now.toISOString()
        .slice(0, 10);
}


function updateStreak() {

    const today =
        todayKey();

    const lastDate =
        localStorage.getItem(
            "funx_last_study_day"
        );


    let streak =
        Number(
            localStorage.getItem(
                "funx_streak"
            )
        ) || 0;


    if (
        lastDate === today
    ) {

        streakEl.textContent =
            streak;

        return;
    }


    if (lastDate) {

        const last =
            new Date(
                `${lastDate}T00:00:00`
            );

        const current =
            new Date(
                `${today}T00:00:00`
            );


        const diff =
            Math.round(
                (
                    current -
                    last
                )
                /
                86400000
            );


        if (diff === 1) {

            streak++;

        } else {

            streak = 1;
        }

    } else {

        streak = 1;
    }


    localStorage.setItem(
        "funx_last_study_day",
        today
    );


    localStorage.setItem(
        "funx_streak",
        streak
    );


    streakEl.textContent =
        streak;
}


function loadStreak() {

    const streak =
        Number(
            localStorage.getItem(
                "funx_streak"
            )
        ) || 0;

    streakEl.textContent =
        streak;
}


// =====================================================
// TIPS
// =====================================================

const tips = [

    "ابدأ بمهمة صغيرة، وستجد أن البدء أصعب من الاستمرار.",

    "قسم المذاكرة إلى جلسات قصيرة بدل محاولة إنهاء كل شيء مرة واحدة.",

    "جهز أدواتك وكتبك قبل بدء المذاكرة حتى لا تضيع وقتك.",

    "راجع درس اليوم في نفس اليوم لتثبيت المعلومات.",

    "اكتب أهم النقاط بعد كل درس في ملخص صغير.",

    "ضع هاتفك بعيدًا أثناء جلسة التركيز.",

    "خصص لكل مادة وقتًا واضحًا في جدولك.",

    "راجع الأخطاء التي وقعت فيها بدل تجاهلها.",

    "ابدأ بالمهمة الأهم عندما تكون طاقتك أفضل.",

    "رتب مكتبك قبل المذاكرة؛ البيئة المرتبة تساعد على التركيز."
];


function showRandomTip() {

    const index =
        Math.floor(
            Math.random() *
            tips.length
        );


    tipBox.textContent =
        tips[index];
}


newTipBtn.addEventListener(
    "click",
    showRandomTip
);


// =====================================================
// THEME
// =====================================================

const savedTheme =
    localStorage.getItem(
        "funx_school_theme"
    );


if (
    savedTheme === "light"
) {

    body.classList.remove(
        "dark"
    );

    body.classList.add(
        "light"
    );

    modeToggle.textContent =
        "🌙";

} else {

    modeToggle.textContent =
        "☀️";
}


modeToggle.addEventListener(
    "click",
    () => {

        body.classList.toggle(
            "dark"
        );

        body.classList.toggle(
            "light"
        );


        const isLight =
            body.classList.contains(
                "light"
            );


        modeToggle.textContent =
            isLight
                ? "🌙"
                : "☀️";


        localStorage.setItem(
            "funx_school_theme",
            isLight
                ? "light"
                : "dark"
        );
    }
);


// =====================================================
// SCHOOL CHECKLIST
// =====================================================

const checklistInputs =
    document.querySelectorAll(
        ".check-item input"
    );


checklistInputs.forEach(
    (input, index) => {

        const key =
            `funx_school_check_${index}`;


        const saved =
            localStorage.getItem(
                key
            );


        input.checked =
            saved === "1";


        input.addEventListener(
            "change",
            () => {

                localStorage.setItem(
                    key,
                    input.checked
                        ? "1"
                        : "0"
                );

            }
        );
    }
);


// =====================================================
// COUNTDOWN
// =====================================================
//
// غيّر هذا التاريخ إلى موعد بداية مدرستك.
// مثال: 2026-09-20
//

const SCHOOL_START_DATE =
    new Date(
        "2026-09-20T00:00:00"
    );


function updateCountdown() {

    const now =
        new Date();

    let difference =
        SCHOOL_START_DATE -
        now;


    const countdownText =
        document.getElementById(
            "countdownText"
        );


    if (
        difference <= 0
    ) {

        document.getElementById(
            "countDays"
        ).textContent = "00";

        document.getElementById(
            "countHours"
        ).textContent = "00";

        document.getElementById(
            "countMinutes"
        ).textContent = "00";

        document.getElementById(
            "countSeconds"
        ).textContent = "00";


        countdownText.textContent =
            "🎒 بدأت الدراسة! بالتوفيق في السنة الجديدة 💪";


        return;
    }


    const days =
        Math.floor(
            difference /
            86400000
        );


    difference %=
        86400000;


    const hours =
        Math.floor(
            difference /
            3600000
        );


    difference %=
        3600000;


    const minutes =
        Math.floor(
            difference /
            60000
        );


    const seconds =
        Math.floor(
            (
                difference %
                60000
            ) /
            1000
        );


    document.getElementById(
        "countDays"
    ).textContent =
        String(days).padStart(
            2,
            "0"
        );


    document.getElementById(
        "countHours"
    ).textContent =
        String(hours).padStart(
            2,
            "0"
        );


    document.getElementById(
        "countMinutes"
    ).textContent =
        String(minutes).padStart(
            2,
            "0"
        );


    document.getElementById(
        "countSeconds"
    ).textContent =
        String(seconds).padStart(
            2,
            "0"
        );


    countdownText.textContent =
        "جهز نفسك من دلوقتي وابدأ السنة الجديدة بقوة 🚀";
}


setInterval(
    updateCountdown,
    1000
);


// =====================================================
// TOAST
// =====================================================

let toastTimer =
    null;


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
// ESCAPE HTML
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
// STARS
// =====================================================

const stars =
    document.getElementById(
        "stars"
    );


for (
    let i = 0;
    i < 85;
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
// INIT
// =====================================================

updateTimer();

renderTasks();

updateSessionUI();

loadStreak();

showRandomTip();

updateCountdown();

