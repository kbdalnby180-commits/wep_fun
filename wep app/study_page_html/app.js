const app = document.getElementById('app');
const timerDisplay = document.getElementById('timerDisplay');
const startBtn = document.getElementById('startBtn');
const pauseBtn = document.getElementById('pauseBtn');
const resetBtn = document.getElementById('resetBtn');

const taskInput = document.getElementById('taskInput');
const addTaskBtn = document.getElementById('addTaskBtn');
const tasksList = document.getElementById('tasksList');

const pdfInput = document.getElementById('pdfInput');
const pdfList = document.getElementById('pdfList');
const pdfCard = document.getElementById('pdfCard');
const pdfViewerWrapper = document.getElementById('pdfViewerWrapper');
const pdfViewer = document.getElementById('pdfViewer');

const themeToggle = document.getElementById('themeToggle');
const adviceText = document.getElementById('adviceText');

let seconds = 0;
let timerInterval = null;
let running = false;

function format(sec){
  const m = Math.floor(sec/60);
  const s = sec%60;
  return m+':'+String(s).padStart(2,'0');
}

function startTimer(){
  if(running) return;
  running = true;
  timerInterval = setInterval(()=>{ seconds++; timerDisplay.textContent = format(seconds); },1000);
}
function pauseTimer(){
  running = false;
  if(timerInterval) clearInterval(timerInterval);
  timerInterval = null;
}
function resetTimer(){
  pauseTimer();
  seconds = 0;
  timerDisplay.textContent = format(seconds);
}

startBtn.addEventListener('click', startTimer);
pauseBtn.addEventListener('click', pauseTimer);
resetBtn.addEventListener('click', resetTimer);

// Tasks
const TASKS_KEY = 'study_tasks_v1';
let tasks = JSON.parse(localStorage.getItem(TASKS_KEY) || '[]');

function saveTasks(){ localStorage.setItem(TASKS_KEY, JSON.stringify(tasks)); }

function renderTasks(){
  tasksList.innerHTML = '';
  tasks.forEach((t, i) => {
    const li = document.createElement('li');
    li.textContent = t.text;
    if(t.done) li.classList.add('completed');
    li.addEventListener('click', () => {
      tasks[i].done = !tasks[i].done;
      saveTasks();
      renderTasks();
    });
    const meta = document.createElement('div');
    meta.style.opacity=0.6;
    meta.style.fontSize='0.85rem';
    meta.textContent = t.time || '';
    li.appendChild(meta);
    tasksList.appendChild(li);
  });
}
renderTasks();

addTaskBtn.addEventListener('click', ()=>{
  const v = taskInput.value.trim();
  if(!v) return;
  const now = new Date().toLocaleTimeString('ar-EG');
  tasks.push({ text: v, done:false, time: now });
  saveTasks();
  taskInput.value='';
  renderTasks();
});

// PDF handling
const pdfFiles = []; // حفظ الملفات في مصفوفة لعرضها لاحقًا

function handleFiles(file){
  if(!file) return;
  pdfFiles.push(file);

  const li = document.createElement('li');
  li.textContent = file.name;
  li.title = file.name;
  li.addEventListener('click', ()=>{
    if(pdfViewerWrapper.classList.contains('hidden')){
      pdfViewerWrapper.classList.remove('hidden');
      const url = URL.createObjectURL(file);
      pdfViewer.src = url;
    } else {
      pdfViewerWrapper.classList.add('hidden');
      pdfViewer.src = '';
    }
  });
  pdfList.prepend(li);
}

pdfInput.addEventListener('change', (e)=>{
  const files = Array.from(e.target.files);
  files.forEach(f=>handleFiles(f));
  pdfInput.value='';
});

pdfCard.addEventListener('dragover', (e)=>{
  e.preventDefault();
  pdfCard.classList.add('dragover');
});
pdfCard.addEventListener('dragleave', ()=>{
  pdfCard.classList.remove('dragover');
});
pdfCard.addEventListener('drop', (e)=>{
  e.preventDefault();
  pdfCard.classList.remove('dragover');
  const files = Array.from(e.dataTransfer.files);
  files.forEach(f=>handleFiles(f));
});

// Theme toggle (background only)
const THEME_KEY = 'study_theme_v1';
let theme = localStorage.getItem(THEME_KEY) || 'dark';

function applyTheme(t){
  if(t==='light'){
    document.documentElement.style.setProperty('--bg', getComputedStyle(document.documentElement).getPropertyValue('--bg-light'));
    themeToggle.textContent = '☀️';
  } else {
    document.documentElement.style.setProperty('--bg', getComputedStyle(document.documentElement).getPropertyValue('--bg-dark'));
    themeToggle.textContent = '🌙';
  }
  localStorage.setItem(THEME_KEY, t);
}

themeToggle.addEventListener('click', ()=>{
  theme = theme==='dark'?'light':'dark';
  applyTheme(theme);
});
applyTheme(theme);

// Advice
fetch('data.json').then(r=>r.json()).then(data=>{
  const idx = Math.floor(Math.random()*data.advice.length);
  adviceText.textContent = data.advice[idx];
}).catch(()=>{ adviceText.textContent = 'ركّز على هدفك وخليك مستمر.' });
