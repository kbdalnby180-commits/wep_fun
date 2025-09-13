// النجوم
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
document.getElementById("score").innerText = "النقاط: " + score;

function loadQuestion() {
    const question = questions[currentQuestionIndex];
    document.getElementById("question").innerText = question.question;
    const answers = document.querySelectorAll(".answers button");
    answers.forEach((button, index) => { button.innerText = question.answers[index]; });
}

function showNotification(text){
    const notify=document.getElementById('notify');
    notify.innerText=text;
    notify.style.display='block';
    setTimeout(()=>notify.style.display='none',3000);
}

function checkAnswer(selectedIndex){
    const question=questions[currentQuestionIndex];
    if(selectedIndex===question.correct){
        score += question.level * 1000;
        showNotification("إجابة صحيحة! +" + question.level*1000 + " نقطة");
    } else {
        showNotification("إجابة خاطئة!");
    }
    localStorage.setItem('score',score);
    currentQuestionIndex++;
    if(currentQuestionIndex<questions.length){ loadQuestion(); }
    else { showNotification("لقد أكملت اللعبة! نقاطك النهائية: " + score); }
    document.getElementById("score").innerText = "النقاط: " + score;
}

loadQuestion();

// الصوت الخلفي
const bgMusic = document.getElementById('bgMusic');
bgMusic.volume = 0.2; 
bgMusic.play().catch(() => { document.addEventListener('click', () => bgMusic.play(), { once: true }); });

// صوت النقر
function playEffectSound() {
    const click = document.getElementById('clickSound');
    click.currentTime = 0;
    click.play();
}
