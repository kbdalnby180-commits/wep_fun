// إنشاء النجوم
for(let i=0;i<100;i++){
    const star=document.createElement('div');
    star.className='star';
    star.style.top=Math.random()*100+'%';
    star.style.left=Math.random()*100+'%';
    star.style.width=star.style.height=Math.random()*2+1+'px';
    document.body.appendChild(star);
}

// الأسئلة
const questions = [
    { question: "ما هو أكبر حيوان بري على وجه الأرض؟", answers: ["الفيل", "الزرافة", "التمساح", "الدب"], correct: 0, level: 1 },
    { question: "ما هو أسرع حيوان على الأرض؟", answers: ["الفرس", "الفهد", "النمر", "الذئب"], correct: 1, level: 1 },
    { question: "ما هو أطول نهر في العالم؟", answers: ["الأمازون", "النيل", "اليانغتسي", "الميسيسيبي"], correct: 1, level: 1 },
    { question: "ما هو الكوكب الأقرب للشمس؟", answers: ["المريخ", "الزهرة", "عطارد", "الأرض"], correct: 2, level: 1 },
    { question: "ما هو لون دم الإنسان؟", answers: ["أحمر", "أزرق", "أخضر", "أصفر"], correct: 0, level: 1 }
];

let currentQuestionIndex = 0;
let score = localStorage.getItem('score') ? parseInt(localStorage.getItem('score')) : 0;
let timeLeft = 10;
let timerInterval;

const scoreEl = document.getElementById("score");
const timerEl = document.getElementById("timer");

scoreEl.innerText = "النقاط: " + score;

function loadQuestion() {
    const question = questions[currentQuestionIndex];
    document.getElementById("question").innerText = question.question;
    const answers = document.querySelectorAll(".answers button");
    answers.forEach((button, index) => { button.innerText = question.answers[index]; });
    resetTimer();
}

function showNotification(text){
    const notify=document.getElementById('notify');
    notify.innerText=text;
    notify.style.display='block';
    setTimeout(()=>notify.style.display='none',3000);
}

function playEffectSound(id){
    const sound = document.getElementById(id);
    sound.currentTime = 0;
    sound.play();
}

function checkAnswer(selectedIndex){
    playEffectSound('clickSound');
    const question=questions[currentQuestionIndex];
    if(selectedIndex===question.correct){
        score += question.level * 1000;
        showNotification("إجابة صحيحة! +" + question.level*1000 + " نقطة");
        playEffectSound('correctSound');
    } else {
        showNotification("إجابة خاطئة!");
        playEffectSound('wrongSound');
    }
    localStorage.setItem('score',score);
    currentQuestionIndex++;
   if(currentQuestionIndex < questions.length){
    loadQuestion();
} else {
    //showNotification("لقد أكملت اللعبة! نقاطك النهائية: " + score);
    endGame(); // استدعاء الواجهة الجديدة
}

    scoreEl.innerText = "النقاط: " + score;
}

// مؤقت لكل سؤال
function resetTimer() {
    clearInterval(timerInterval);
    timeLeft = 10;
    timerEl.innerText = "الوقت: " + timeLeft;
    timerInterval = setInterval(()=>{
        timeLeft--;
        timerEl.innerText = "الوقت: " + timeLeft;
        if(timeLeft<=0){
            checkAnswer(-1); // إجابة خاطئة تلقائيًا
        }
    },1000);
}

loadQuestion();

// الصوت الخلفي
const bgMusic = document.getElementById('bgMusic');
bgMusic.volume = 0.2; 
bgMusic.play().catch(() => { 
    document.addEventListener('click', () => bgMusic.play(), { once: true }); 
});

// زر الوضع الليلي/النهاري
document.getElementById('toggleTheme').addEventListener('click',()=>{
    document.body.classList.toggle('light');
    document.querySelector('header').classList.toggle('light');
    document.querySelector('.question-container').classList.toggle('light');
    const btn = document.getElementById('toggleTheme');
    btn.textContent = document.body.classList.contains('light') ? '🌞 وضع النهار' : '🌙 وضع الليل';
});

function endGame() {
    clearInterval(timerInterval); // إيقاف المؤقت
    const finalUI = document.getElementById('gameOverUI');
    const finalScoreText = document.getElementById('finalScore');
    finalScoreText.innerText = "نقاطك النهائية: " + score;
    finalUI.classList.add('show');

    // إخفاء صندوق الأسئلة
    document.querySelector('.question-container').style.display = 'none';
    playEffectSound('gameOverSound');
}

// زر إعادة اللعب
document.getElementById('restartBtn').addEventListener('click', () => {
    score = 0;
    localStorage.setItem('score', score);
    document.getElementById("score").innerText = "النقاط: " + score;
    currentQuestionIndex = 0;
    loadQuestion();
    document.querySelector('.question-container').style.display = 'block';

    // إخفاء واجهة النهاية
    document.getElementById('gameOverUI').classList.remove('show');
});
