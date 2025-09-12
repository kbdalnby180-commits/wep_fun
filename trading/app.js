// app.js — extended with UI features, leaderboard, achievements, news ticker, theme, coins
(() => {
  const state = {
    balance: 1000,
    price: 1.08234,
    prices: [],
    candles: [],
    running: true,
    vol: 4,
    ma: false,
    useCandles: false,
    mode: 'edu', // 'edu' or 'play'
    pnl: 0,
    wins: 0,
    losses: 0,
    currentAsset: 'EURUSD',
    chartType: 'line'
  };

  // DOM
  const id=(s)=>document.getElementById(s);
  const chart = id('chart'); const ctx = chart.getContext('2d');
  const priceNow = id('priceNow'); const balanceEl = id('balance');
  const buyBtn = id('buyBtn'); const sellBtn = id('sellBtn');
  const durationSel = id('duration'); const payoutSel = id('payout');
  const historyEl = id('history'); const statusEl = id('status');
  const updateIntervalSel = id('updateInterval'); const maxPointsSel = id('maxPoints');
  const maToggle = id('maToggle'); const candleToggle = id('candleToggle');
  const tfLabel = id('tfLabel'); const assetSelect = id('assetSelect'); const chartType = id('chartType');
  const themeToggle = id('themeToggle'); const refillBtn = id('refillBtn');
  const winsEl = id('wins'); const lossesEl = id('losses'); const pnlEl = id('pnl');
  const leaderboardEl = id('leaderboard'); const achieveList = id('achieveList');
  const badgesEl = id('badges'); const readmeShort = id('readmeShort'); const newsTicker = id('newsTicker');
  const tradeTimer = id('tradeTimer'); const resultToast = id('resultToast');
  const exportCsv = id('exportCsv'); const resetBtn = id('resetBtn');
  const modeBtn = id('modeBtn'); const liteBtn = id('liteBtn'); const customAmount = id('customAmount');

  // responsive canvas
  function resize(){
    chart.width = chart.clientWidth * (window.devicePixelRatio || 1);
    chart.height = chart.clientHeight * (window.devicePixelRatio || 1);
    ctx.setTransform(window.devicePixelRatio || 1,0,0,window.devicePixelRatio || 1,0,0);
  }
  window.addEventListener('resize', resize); resize();

  // init
  state.price = 1.08234 + Math.random()*0.01;
  let maxPoints = Number(maxPointsSel.value) || 100;
  let updateInterval = Number(updateIntervalSel.value) || 2000;
  for(let i=0;i<maxPoints;i++) stepSim();

  // news ticker data (fake)
  const newsPool = [
    "إعلان اقتصادي: بيانات التضخم تنتظر النشر غدا.",
    "BTC يتحرك بقوة بعد إعلان تبني مؤسسي.",
    "EUR/USD يتأثر بتصريحات البنك المركزي.",
    "أسهم التكنولوجيا تحقق ارتفاعًا حادًا.",
    "توقعات: تقلبات مرتقبة في الأسواق."
  ];
  let newsIdx = 0;
  function tickNews(){
    newsTicker.innerText = "أخبار: " + newsPool[newsIdx % newsPool.length];
    newsIdx++;
  }
  setInterval(tickNews, 5000); tickNews();

  // market loop
  let lastTick = Date.now();
  function loop(){
    const now = Date.now();
    if(state.running && now - lastTick > updateInterval){
      stepSim(); lastTick = now;
    }
    draw(); requestAnimationFrame(loop);
  }
  requestAnimationFrame(loop);

  function stepSim(){
    const v = (state.vol/3);
    state.price = Math.max( (state.currentAsset==='BTCUSD'?1000:0.5), state.price + (Math.random()-0.5)*v*0.001 );
    if(Math.random()<0.01) state.price += (Math.random()>0.5?1:-1)*(0.005+Math.random()*0.01);
    state.prices.push(state.price);
    if(state.prices.length > maxPoints) state.prices.shift();
    buildCandles();
    updateUI();
  }

  function buildCandles(){
    const pts = 4;
    const arr = state.prices;
    const c = [];
    for(let i=0;i<arr.length;i+=pts){
      const s = arr.slice(i,i+pts);
      if(s.length<1) continue;
      const open = s[0], close = s[s.length-1], high=Math.max(...s), low=Math.min(...s);
      c.push({open,high,low,close});
    }
    state.candles = c.slice(-80);
  }

  // draw
  function draw(){
    const w = chart.width / (window.devicePixelRatio||1);
    const h = chart.height / (window.devicePixelRatio||1);
    ctx.clearRect(0,0,w,h);
    // grid
    ctx.strokeStyle = 'rgba(255,255,255,0.03)'; ctx.lineWidth=1;
    for(let i=1;i<=4;i++){ ctx.beginPath(); ctx.moveTo(0,(i/5)*h); ctx.lineTo(w,(i/5)*h); ctx.stroke(); }

    const series = (chartType.value==='candles' && state.candles.length) ? state.candles.map(x=>x.close) : state.prices;
    if(series.length<2) return;
    const max = Math.max(...series), min = Math.min(...series);
    // candles
    if(chartType.value==='candles' && state.candles.length){
      const cw = Math.max(2, (w/state.candles.length)*0.6);
      state.candles.forEach((c,i)=>{
        const x = i*(w/state.candles.length)+4;
        const openY = h - ((c.open-min)/(max-min))*h;
        const closeY = h - ((c.close-min)/(max-min))*h;
        const highY = h - ((c.high-min)/(max-min))*h;
        const lowY = h - ((c.low-min)/(max-min))*h;
        ctx.beginPath(); ctx.strokeStyle='rgba(255,255,255,0.06)'; ctx.moveTo(x+cw/2,highY); ctx.lineTo(x+cw/2,lowY); ctx.stroke();
        ctx.fillStyle = c.close>=c.open ? 'rgba(0,209,138,0.95)' : 'rgba(255,107,107,0.95)';
        ctx.fillRect(x, Math.min(openY,closeY), cw, Math.max(2, Math.abs(closeY-openY)));
      });
    } else {
      // area / line
      ctx.beginPath(); ctx.lineWidth=2;
      if(chartType.value==='area'){ ctx.lineTo(w,h); }
      series.forEach((p,i)=>{ const x = i*(w/(series.length-1)); const y = h - ((p-min)/(max-min))*h; if(i===0) ctx.moveTo(x,y); else ctx.lineTo(x,y); });
      ctx.strokeStyle = '#00d18a'; ctx.stroke();
      if(chartType.value==='area'){
        ctx.lineTo(w,h); ctx.lineTo(0,h); ctx.fillStyle='rgba(0,209,138,0.06)'; ctx.fill();
      }
    }

    // MA
    if(maToggle.checked){
      const arr = chartType.value==='candles' ? state.candles.map(c=>c.close) : state.prices;
      const n=8; const ma=[];
      for(let i=0;i<arr.length;i++){ const sl=arr.slice(Math.max(0,i-n+1),i+1); ma.push(sl.reduce((a,b)=>a+b,0)/sl.length); }
      ctx.beginPath(); ctx.lineWidth=1.2; ctx.strokeStyle='#ffd166';
      ma.forEach((p,i)=>{ const x = i*(w/(ma.length-1)); const y = h - ((p-min)/(max-min))*h; if(i===0) ctx.moveTo(x,y); else ctx.lineTo(x,y); }); ctx.stroke();
    }

    // draw last price marker
    const last = series[series.length-1];
    const lastX = (series.length-1)*(w/(series.length-1));
    const lastY = h - ((last-min)/(max-min))*h;
    ctx.beginPath(); ctx.fillStyle='#022'; ctx.strokeStyle='#00d18a'; ctx.lineWidth=2;
    ctx.arc(lastX, lastY, 6,0,Math.PI*2); ctx.fill(); ctx.stroke();
  }

  // trades
  function placeTrade(type, amount, duration){
    amount = Number(amount); duration = Number(duration); const payout = Number(payoutSel.value);
    if(!amount || amount<=0){ alert('ادخل مبلغ صحيح'); return; }
    if(state.balance < amount){ alert('الرصيد غير كافٍ'); return; }
    const entry = state.price;
    state.balance = Number((state.balance - amount).toFixed(4));
    saveState(); updateUI();
    const trade = {id:Date.now(),type,amount,entry,duration,start:Date.now(),resolved:false,payout};
    pushHistory(trade); updateHistoryUI();
    // timer UI
    startTradeTimer(trade.duration);
    setTimeout(()=>resolveTrade(trade), trade.duration*1000 + 300);
  }

  function resolveTrade(tr){
    const final = state.price;
    let profit = 0;
    if(tr.type==='buy'){
      if(final>tr.entry) profit = tr.amount * tr.payout * ((final - tr.entry)/tr.entry);
      else profit = -tr.amount;
    } else {
      if(final<tr.entry) profit = tr.amount * tr.payout * ((tr.entry - final)/tr.entry);
      else profit = -tr.amount;
    }
    profit = Number(profit.toFixed(4));
    tr.resolved=true; tr.final=final; tr.profit=profit; updateHistoryEntry(tr);
    if(profit>0){ state.balance = Number((state.balance + tr.amount + profit).toFixed(4)); state.wins++; state.pnl += profit; showResultToast(true, profit); awardAchievements('win',tr); }
    else { state.losses++; state.pnl += profit; showResultToast(false, profit); }
    saveState(); updateUI(); updateHistoryUI(); saveLeaderboardIfTop();
    if(state.mode==='edu'){ giveEduTip(tr, profit); }
  }

  // history / storage
  function pushHistory(t){ const arr = JSON.parse(localStorage.getItem('fx_trades')||'[]'); arr.unshift(t); localStorage.setItem('fx_trades', JSON.stringify(arr.slice(0,500))); }
  function updateHistoryUI(){ const arr = JSON.parse(localStorage.getItem('fx_trades')||'[]'); historyEl.innerHTML=''; arr.forEach(t=>{ const el=document.createElement('div'); el.className='trade-item'; const left=`<div><strong>${t.type}</strong> ${t.amount}$ <div class="small">dur:${t.duration}s</div></div>`; const right=`<div>${t.resolved? (t.profit>0?'<span style="color:#4ade80">+'+t.profit+'</span>':'<span style="color:#ff7b7b">'+t.profit+'</span>') : '<span class="small">مستقبل</span>'}</div>`; el.innerHTML = left + right; historyEl.appendChild(el); }); }

  function updateHistoryEntry(tr){
    const arr = JSON.parse(localStorage.getItem('fx_trades')||'[]');
    const i = arr.findIndex(x=>x.id===tr.id); if(i>=0){ arr[i]=tr; localStorage.setItem('fx_trades', JSON.stringify(arr.slice(0,500))); }
  }

  // leaderboard
  function saveLeaderboardIfTop(){
    const lb = JSON.parse(localStorage.getItem('fx_leaderboard')||'[]'); lb.push({date:Date.now(),balance:state.balance}); lb.sort((a,b)=>b.balance-a.balance); localStorage.setItem('fx_leaderboard', JSON.stringify(lb.slice(0,50))); renderLeaderboard();
  }
  function renderLeaderboard(){ const lb=JSON.parse(localStorage.getItem('fx_leaderboard')||'[]'); leaderboardEl.innerHTML=''; lb.slice(0,8).forEach((p,i)=>{ const el=document.createElement('div'); el.className='trade-item'; el.innerHTML = `<div>#${i+1}</div><div>${p.balance.toFixed(2)}$</div>`; leaderboardEl.appendChild(el); }); }

  // achievements
  const achieved = JSON.parse(localStorage.getItem('fx_ach')||'{}');
  function awardAchievements(type,tr){
    // simple: 10 wins overall -> badge, single big profit -> badge
    if(type==='win'){
      const wins = (localStorage.getItem('fx_wins')|0) + 1; localStorage.setItem('fx_wins', wins);
      if(wins===10 && !achieved.tenwins){ achieved.tenwins=true; pushBadge('10 صفقات رابحة'); }
      if(tr.profit >= tr.amount * 2 && !achieved.bigprofit){ achieved.bigprofit=true; pushBadge('ربح كبير'); }
    }
    localStorage.setItem('fx_ach', JSON.stringify(achieved)); renderAchievements();
  }
  function pushBadge(text){ const b = document.createElement('div'); b.className='badge'; b.innerText = text; badgesEl.appendChild(b); }

  function renderAchievements(){ achieveList.innerHTML=''; Object.keys(achieved).forEach(k=>{ const el=document.createElement('div'); el.className='badge'; el.innerText = achieved[k]===true ? k : ''; achieveList.appendChild(el); }); }

  // UI helpers
  function updateUI(){ balanceEl.innerText = state.balance.toFixed(4); priceNow.innerText = state.price.toFixed(5); winsEl.innerText = state.wins; lossesEl.innerText = state.losses; pnlEl.innerText = state.pnl.toFixed(2); tfLabel.innerText = durationSel.value==='60'?'1m':durationSel.value+'s'; renderLeaderboard(); renderAchievements(); updateHistoryUI(); }
  function saveState(){ localStorage.setItem('fx_state', JSON.stringify({balance:state.balance,wins:state.wins,losses:state.losses,pnl:state.pnl})); }
  function loadState(){ try{ const s=JSON.parse(localStorage.getItem('fx_state')||'{}'); if(s.balance) state.balance=s.balance; if(s.wins) state.wins=s.wins; if(s.losses) state.losses=s.losses; if(s.pnl) state.pnl=s.pnl; }catch(e){} }
  loadState(); updateUI();

  // trade timer UI
  let timerInterval=null;
  function startTradeTimer(secs){
    clearInterval(timerInterval);
    tradeTimer.classList.remove('hidden');
    let remain = secs;
    tradeTimer.innerText = `${remain}s`;
    timerInterval = setInterval(()=>{ remain--; if(remain<=0){ clearInterval(timerInterval); tradeTimer.classList.add('hidden'); } else tradeTimer.innerText = `${remain}s`; },1000);
  }

  // result toast & animations
  function showResultToast(win, profit){
    resultToast.classList.remove('hidden'); resultToast.innerText = win ? `ربح +${profit}$` : `خسارة ${profit}$`;
    resultToast.style.background = win ? 'linear-gradient(90deg,#022,#00d18a)' : 'linear-gradient(90deg,#220,#ff6b6b)';
    setTimeout(()=> resultToast.classList.add('hidden'),2500);
    if(win) triggerConfetti(); else triggerShake();
  }

  // confetti simple
  const confettiCanvas = document.createElement('canvas'); confettiCanvas.className='confetti-canvas'; document.querySelector('.chart-wrap').appendChild(confettiCanvas);
  const cctx = confettiCanvas.getContext('2d'); function resizeConfetti(){ confettiCanvas.width = confettiCanvas.clientWidth * (window.devicePixelRatio||1); confettiCanvas.height = confettiCanvas.clientHeight * (window.devicePixelRatio||1); } window.addEventListener('resize', resizeConfetti); resizeConfetti();
  let confettiPieces=[]; function triggerConfetti(){
    confettiPieces = []; for(let i=0;i<60;i++){ confettiPieces.push({x:Math.random()*confettiCanvas.width,y:-Math.random()*400 + Math.random()*-50, vx:(Math.random()-0.5)*6, vy: Math.random()*6+2, color: `hsl(${Math.random()*360} 90% 60%)`, r: Math.random()*6+2}) }
    let t=0; const anim = ()=>{ t++; cctx.clearRect(0,0,confettiCanvas.width,confettiCanvas.height); confettiPieces.forEach(p=>{ p.x += p.vx; p.y += p.vy; p.vy += 0.12; cctx.fillStyle = p.color; cctx.beginPath(); cctx.ellipse(p.x,p.y,p.r,p.r*0.6,0,0,Math.PI*2); cctx.fill(); }); if(t<120) requestAnimationFrame(anim); else cctx.clearRect(0,0,confettiCanvas.width,confettiCanvas.height); }; requestAnimationFrame(anim);
  }
  function triggerShake(){ const el = document.querySelector('.chart-wrap'); el.classList.add('shake'); setTimeout(()=>el.classList.remove('shake'),600); }

  // tips for edu
  function giveEduTip(tr,profit){ const tips = [ "جرب تحليل الاتجاه قبل الدخول.", "لا تراهن بكل الرصيد.", "افحص الإطار الزمني قبل الصفقة.", "ضع وقف خسارة افتراضي." ]; const tip = tips[Math.floor(Math.random()*tips.length)]; statusEl.innerText = `${profit>0? 'ربحت '+profit : 'خسرت '+Math.abs(profit)} — نصيحة: ${tip}`; }

  // simple achievements render from saved
  renderLeaderboard(); renderAchievements(); updateHistoryUI();

  // actions wiring
  buyBtn.addEventListener('click', ()=> placeTrade('buy', getAmount(), durationSel.value));
  sellBtn.addEventListener('click', ()=> placeTrade('sell', getAmount(), durationSel.value));
  document.querySelectorAll('.preset-amounts button').forEach(b=> b.addEventListener('click', ()=>{ document.querySelectorAll('.preset-amounts button').forEach(x=>x.classList.remove('active')); b.classList.add('active'); customAmount.value=''; }));
  customAmount.addEventListener('input', ()=> document.querySelectorAll('.preset-amounts button').forEach(x=>x.classList.remove('active')));
  assetSelect.addEventListener('change', ()=>{ state.currentAsset = assetSelect.value; id('assetName').innerText = assetSelect.options[assetSelect.selectedIndex].text; });
  chartType.addEventListener('change', ()=>{ state.chartType = chartType.value; });
  updateIntervalSel.addEventListener('change', ()=> updateInterval = Number(updateIntervalSel.value));
  maxPointsSel.addEventListener('change', ()=> maxPoints = Number(maxPointsSel.value));
  maToggle.addEventListener('change', ()=>{}); candleToggle.addEventListener('change', ()=>{});
  exportCsv.addEventListener('click', ()=>{ const arr=JSON.parse(localStorage.getItem('fx_trades')||'[]'); if(!arr.length){ alert('لا يوجد سجل'); return;} const rows=[['id','type','amount','entry','final','profit','start','duration']]; arr.forEach(r=> rows.push([r.id,r.type,r.amount,r.entry,r.final||'',r.profit||'',r.start,r.duration])); const csv=rows.map(r=>r.map(c=>`"${String(c).replace(/"/g,'""')}"`).join(',')).join('\\n'); const blob=new Blob([csv],{type:'text/csv'}); const url=URL.createObjectURL(blob); const a=document.createElement('a'); a.href=url; a.download='fx_trades.csv'; a.click(); URL.revokeObjectURL(url); });
  resetBtn.addEventListener('click', ()=>{ if(confirm('إعادة تعيين؟')){ localStorage.removeItem('fx_trades'); localStorage.removeItem('fx_leaderboard'); localStorage.removeItem('fx_ach'); state.balance=1000; state.wins=0; state.losses=0; state.pnl=0; saveState(); updateUI(); updateHistoryUI(); }});
  modeBtn.addEventListener('click', ()=>{ state.mode = state.mode==='edu'?'play':'edu'; id('status').innerText = state.mode==='edu'?'وضع تعليمي — ستحصل على نصائح بعد كل صفقة.':'وضع لعب — لا نصائح'; });
  liteBtn.addEventListener('click', ()=>{ if(updateInterval>2500){ updateInterval=1000; maxPoints=100; updateIntervalSel.value='1000'; maxPointsSel.value='100'; } else { updateInterval=3000; maxPoints=50; updateIntervalSel.value='3000'; maxPointsSel.value='50'; }});
  themeToggle.addEventListener('click', ()=>{ document.documentElement.classList.toggle('theme-light'); themeToggle.innerText = document.documentElement.classList.contains('theme-light')? '☀️' : '🌙'; });
  refillBtn.addEventListener('click', ()=>{ if(confirm('إعادة تعبئة الرصيد إلى 10000؟')){ state.balance = 10000; saveState(); updateUI(); } });

  function getAmount(){ const a = document.querySelector('.preset-amounts button.active'); if(a) return Number(a.dataset.amt); const v = Number(customAmount.value); return v || 1; }

  // persistence
  function saveState(){ localStorage.setItem('fx_state', JSON.stringify({balance:state.balance,wins:state.wins,losses:state.losses,pnl:state.pnl})); }
  function loadState(){ try{ const s=JSON.parse(localStorage.getItem('fx_state')||'{}'); if(s.balance) state.balance=s.balance; if(s.wins) state.wins=s.wins; if(s.losses) state.losses=s.losses; if(s.pnl) state.pnl=s.pnl; }catch(e){} }
  loadState(); updateUI();

  // small helpers
  function updateUI(){ balanceEl.innerText = state.balance.toFixed(4); priceNow.innerText = state.price.toFixed(5); winsEl.innerText = state.wins; lossesEl.innerText = state.losses; pnlEl.innerText = state.pnl.toFixed(2); tfLabel.innerText = durationSel.value==='60'?'1m':durationSel.value+'s'; }
  function pushLocal(arrKey, val, max=500){ const arr=JSON.parse(localStorage.getItem(arrKey)||'[]'); arr.unshift(val); localStorage.setItem(arrKey, JSON.stringify(arr.slice(0,max))); }
  function triggerConfetti(){ /* provided above via triggerConfetti in original */ }

  // README short
  readmeShort.innerText = `محاكي تعليمي أوفلاين: اختر المبلغ، اضغط شراء أو بيع، انتظر انتهاء المدة لرؤية النتيجة. يمكنك تصدير السجل أو إعادة تعبئة الرصيد.`;

})();
