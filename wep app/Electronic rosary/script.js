const DEFAULT_AZKAR = [
  "سُبْحَانَ اللهِ","الْحَمْدُ للهِ","اللَّهُ أَكْبَرُ","لا حَوْلَ وَلا قُوَّةَ إِلا بِاللَّهِ","أَسْتَغْفِرُ اللَّهَ",
  "اللَّهُمَّ صَلِّ وَسَلِّمْ عَلَى نَبِيِّنَا مُحَمَّد","لا إله إلا الله","سُبْحَانَ اللهِ وَبِحَمْدِهِ","اللهم ارحمنا","اللهم اغفر لنا",
  "اللهم أعنّي على ذكرك وشكرك وحسن عبادتك","يا حيّ يا قيوم برحمة منك أستغيث","اللهم أصلح لي ديني","اللهم بارك لنا في أوقاتنا","اللهم ارزقني الصبر",
  "اللهم اجعلني من الشاكرين","اللهم اجعلني من التوّابين","اللهم ارزقني الهداية","اللهم اهدِ قلبي","اللهم طهر قلبي","اللهم ثبتني على الطاعة",
  "اللهم اجعل عملي خالصاً لوجهك","اللهم اجعل لي من كل هم فرجاً","اللهم اجعل لي في قلبي نوراً","اللهم اسألك العفو والعافية","استغفر الله واتوب اليه",
  "يا رب ارحم ضعف قلبي","اللهم ارحم موتانا","اللهم اجعلنا من عبادك المقبولين"
];

const STORAGE_KEY = 'tasbih_azkar_v2';
let state = {
  count:0,total:0,target:null,azkar:DEFAULT_AZKAR.slice(),currentIndex:0,autoChange:false,autoAfter:33,beadsPerRow:11
};

try{
  const saved = localStorage.getItem(STORAGE_KEY);
  if(saved){ Object.assign(state, JSON.parse(saved)); if(!Array.isArray(state.azkar) || state.azkar.length===0){state.azkar=DEFAULT_AZKAR.slice();state.currentIndex=0;} }
}catch(e){console.warn('خطأ عند تحميل الحفظ:',e);}

const countEl = document.getElementById('count');
const totalEl = document.getElementById('total');
const beadsWrap = document.getElementById('beadsWrap');
const targetInfo = document.getElementById('targetInfo');
const currentZekrEl = document.getElementById('currentZekr');
const azkarListEl = document.getElementById('azkarList');

function saveState(){ try{ localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); }catch(e){} }
function render(){
  countEl.textContent = state.count;
  totalEl.textContent = state.total;
  currentZekrEl.textContent = (state.azkar && state.azkar.length>0)?state.azkar[((state.currentIndex%state.azkar.length)+state.azkar.length)%state.azkar.length]:'— لا يوجد أذكار —';
  targetInfo.textContent = (state.target && state.target>0)?`الهدف: ${state.target} — تبقى ${Math.max(0,state.target-state.count)} تسبيحات`:'لم يتم تحديد هدف';
  renderBeads(); renderAzkarList(); saveState();
}

function renderBeads(){
  beadsWrap.innerHTML=''; const perRow=state.beadsPerRow||11; const activeIndex=state.count%perRow; const rows=3;
  for(let r=0;r<rows;r++){for(let i=0;i<perRow;i++){const div=document.createElement('div');div.className='bead'; if(r===0&&i===activeIndex)div.classList.add('active'); beadsWrap.appendChild(div);}}
}

function renderAzkarList(){
  azkarListEl.innerHTML='';
  state.azkar.forEach((z,idx)=>{
    const item=document.createElement('div'); item.className='azkar-item';
    const left=document.createElement('div'); left.textContent=z;
    const right=document.createElement('div'); right.style.display='flex'; right.style.gap='6px';
    const btn=document.createElement('button'); btn.textContent='اختيار'; btn.className='btn ghost'; btn.onclick=()=>{state.currentIndex=idx; render();}
    const del=document.createElement('button'); del.textContent='حذف'; del.className='btn ghost'; del.onclick=()=>{if(!confirm('هل تريد حذف هذا الذكر؟'))return; state.azkar.splice(idx,1); if(state.currentIndex>=state.azkar.length)state.currentIndex=0; render();}
    right.appendChild(btn); right.appendChild(del); item.appendChild(left); item.appendChild(right); azkarListEl.appendChild(item);
  });
  if(state.azkar.length===0){azkarListEl.innerHTML='<div class="small" style="padding:6px">قائمة الأذكار فارغة — أضف أذكارًا جديدة.</div>';}
}

function addOne(n=1){state.count+=n; state.total+=n; if(state.autoChange&&state.autoAfter>0){if(state.count%state.autoAfter===0){changeZekrRandom();}} render(); checkTarget();}
function resetCount(){if(!confirm('هل تريد إعادة ضبط العَدّ إلى صفر؟'))return; state.count=0; state.total=0; render();}
function clearStorage(){if(!confirm('هل تريد مسح الحفظ واستعادة الإعدادات الافتراضية؟'))return; localStorage.removeItem(STORAGE_KEY); state={count:0,total:0,target:null,azkar:DEFAULT_AZKAR.slice(),currentIndex:0,autoChange:false,autoAfter:33,beadsPerRow:11}; render();}
function setTarget(){const val=parseInt(document.getElementById('targetInput').value); if(isNaN(val)||val<=0){alert('ضع رقماً صحيحاً أكبر من صفر');return;} state.target=val; render();}
function checkTarget(){if(state.target && state.count>=state.target){setTimeout(()=>alert(`تهانينا! وصلت للهدف (${state.target})`),200);}}

function changeZekrRandom(){if(!state.azkar || state.azkar.length===0)return; if(state.azkar.length===1){state.currentIndex=0; return;} let newIdx=state.currentIndex; let attempts=0; while(newIdx===state.currentIndex&&attempts<8){newIdx=Math.floor(Math.random()*state.azkar.length); attempts++;} state.currentIndex=newIdx; render();}
function nextZekr(){if(!state.azkar||state.azkar.length===0)return; state.currentIndex=(state.currentIndex+1)%state.azkar.length; render();}
function prevZekr(){if(!state.azkar||state.azkar.length===0)return; state.currentIndex=(state.currentIndex-1+state.azkar.length)%state.azkar.length; render();}

document.getElementById('addZekrBtn').addEventListener('click',()=>{const input=document.getElementById('newZekrInput'); const txt=(input.value||'').trim(); if(!txt){alert('اكتب ذكرًا ثم اضغط إضافة');return;} state.azkar.push(txt); input.value=''; state.currentIndex=state.azkar.length-1; render();});
document.getElementById('resetAzkarBtn').addEventListener('click',()=>{if(!confirm('هل تريد استعادة قائمة الأذكار الافتراضية؟ سيُحذف كل ما أضفته.'))return; state.azkar=DEFAULT_AZKAR.slice(); state.currentIndex=0; render();});

document.getElementById('addBtn').addEventListener('click',()=>addOne(1));
document.getElementById('add33Btn').addEventListener('click',()=>addOne(33));
document.getElementById('resetBtn').addEventListener('click',resetCount);
document.getElementById('clearBtn').addEventListener('click',clearStorage);
document.getElementById('setTargetBtn').addEventListener('click',setTarget);
document.getElementById('changeZekrBtn').addEventListener('click',changeZekrRandom);
document.getElementById('nextZekrBtn').addEventListener('click',nextZekr);
document.getElementById('prevZekrBtn').addEventListener('click',prevZekr);

document.getElementById('autoChange').addEventListener('change',(e)=>{state.autoChange=e.target.checked; saveState();});
document.getElementById('autoAfter').addEventListener('change',(e)=>{const v=parseInt(e.target.value); if(!isNaN(v)&&v>0)state.autoAfter=v; saveState();});

document.getElementById('autoChange').checked=!!state.autoChange;
document.getElementById('autoAfter').value=state.autoAfter||33;
if(state.target) document.getElementById('targetInput').value=state.target;

document.getElementById('beadsWrap').addEventListener('click',()=>addOne(1));
document.addEventListener('keydown',(e)=>{if(e.code==='Space'||e.key===' '){e.preventDefault();addOne(1);} if(e.key==='+') addOne(1);});

render();
