// ================== VARIABLES ==================
const boardEl = document.getElementById("board");
const logEl = document.getElementById("log");
const promoEl = document.getElementById("promotion");
const capturedWhiteEl = document.getElementById("capturedWhite");
const capturedBlackEl = document.getElementById("capturedBlack");
const timerEl = document.getElementById("timer");

let turn = "w";
let highlights = [];
let promoSquare = null;
let history = [];
let lastMove = null;
let moveHistory = [];
let analysis = {
  moves: [], // كل حركة
  pieceUsage: {}, // عدد تحركات كل قطعة
  totalTime: 0 // الوقت الكلي
};

let board = [
  ["br","bn","bb","bq","bk","bb","bn","br"],
  ["bp","bp","bp","bp","bp","bp","bp","bp"],
  ["","","","","","","",""],
  ["","","","","","","",""],
  ["","","","","","","",""],
  ["","","","","","","",""],
  ["wp","wp","wp","wp","wp","wp","wp","wp"],
  ["wr","wn","wb","wq","wk","wb","wn","wr"]
];

// ================== DRAW ==================
function draw(){
  boardEl.innerHTML = "";
  for(let r=0;r<8;r++){
    for(let c=0;c<8;c++){
      let sq = document.createElement("div");
      sq.className = "square " + ((r+c)%2?"black":"white");
      sq.dataset.r = r;
      sq.dataset.c = c;

      if(highlights.some(h=>h.r===r && h.c===c)) sq.classList.add("highlight");
      if(lastMove && ((lastMove.fromR===r && lastMove.fromC===c) || (lastMove.toR===r && lastMove.toC===c))){
        sq.classList.add("lastMove");
      }

      if(board[r][c]){
        let piece = board[r][c];

        // === ترقية الجندي تلقائيًا ===
        if(piece === "wp" && r === 0) piece = "wq";
        if(piece === "bp" && r === 7) piece = "bq";

        let img = document.createElement("img");
        img.src = `pieces/${piece}.png`;
        img.draggable = false;
        img.onmouseenter = ()=>img.style.transform="scale(1.1)";
        img.onmouseleave = ()=>img.style.transform="scale(1)";
        sq.appendChild(img);
      }

      boardEl.appendChild(sq);
    }
  }
  logEl.innerHTML = history.join("<br>");
}

// ================== CLICK TO MOVE ==================
let selected = null;
boardEl.addEventListener("click", e=>{
  let sq = e.target.closest(".square");
  if(!sq) return;
  let r = parseInt(sq.dataset.r);
  let c = parseInt(sq.dataset.c);

  if(!selected){
    if(board[r][c] && board[r][c][0]===turn){
      selected={r,c};
      highlights = possibleMoves(r,c);
      draw();
    }
  } else {
    if(highlights.some(h=>h.r===r && h.c===c)){
      makeMove(selected.r,selected.c,r,c);
      afterMove(r,c);
      turn = turn==="w"?"b":"w";
      selected=null;
      highlights=[];
      draw();
      if(turn==="b") setTimeout(aiMove,300);
    } else {
      selected=null;
      highlights=[];
      draw();
    }
  }
});

// ================== MOVE ==================
function makeMove(r1,c1,r2,c2){
  let piece = board[r1][c1];
  let captured = board[r2][c2];

  moveHistory.push({fromR:r1,fromC:c1,toR:r2,toC:c2,piece,captured,turn, time:Date.now()});

  if(captured) addCaptured(captured,captured[0]==="w"?"w":"b");

  board[r2][c2] = piece;
  board[r1][c1] = "";

  if((piece==="wp" && r2===0) || (piece==="bp" && r2===7)){
    promoSquare = {r: r2, c: c2};
    if(turn==="w") promoEl.classList.remove("hidden");
    else board[r2][c2] = piece[0]+"q";
  }

  lastMove = {fromR:r1,fromC:c1,toR:r2,toC:c2};
  history.push(pos(r1,c1)+"-"+pos(r2,c2));
  draw();
}

// ================== PROMOTION ==================
function afterMove(r,c){ if(turn==="w" && promoSquare) draw(); }
function choosePromo(t){ 
  if(!promoSquare) return;
  board[promoSquare.r][promoSquare.c]="w"+t;
  promoSquare=null;
  promoEl.classList.add("hidden");
  draw();
}

// ================== CAPTURE ==================
function addCaptured(piece,color){
  let img=document.createElement("img");
  img.src=`pieces/${piece}.png`;
  if(color==="w") capturedWhiteEl.appendChild(img);
  else capturedBlackEl.appendChild(img);
}

// ================== UNDO ==================
function undoMove(){
  if(moveHistory.length===0) return;
  let m=moveHistory.pop();
  board[m.fromR][m.fromC]=m.piece;
  if(m.captured){
    board[m.toR][m.toC]=m.captured;
    if(m.captured[0]==="w" && capturedWhiteEl.children.length) capturedWhiteEl.removeChild(capturedWhiteEl.lastChild);
    if(m.captured[0]==="b" && capturedBlackEl.children.length) capturedBlackEl.removeChild(capturedBlackEl.lastChild);
  } else board[m.toR][m.toC]="";

  history.pop();
  turn=m.turn;
  lastMove = moveHistory.length?{fromR:moveHistory[moveHistory.length-1].fromR, fromC:moveHistory[moveHistory.length-1].fromC, toR:moveHistory[moveHistory.length-1].toR, toC:moveHistory[moveHistory.length-1].toC}:null;
  draw();
}

document.getElementById("undoBtn").addEventListener("click", ()=>{
  if(moveHistory.length>=2){ undoMove(); undoMove(); } else undoMove();
});

// ================== AI ==================
function aiMove(){
  let best=-1e9,bm=null;
  for(let m of allMoves("b")){
    apply(m);
    let score=minimax(3,-1e9,1e9,false);
    undo(m);
    if(score>best){ best=score; bm=m; }
  }
  if(!bm){ alert("♚ كش مات — انت كسبت"); return; }
  makeMove(bm.fr,bm.fc,bm.tr,bm.tc);
  turn="w";
}

document.getElementById("aiHelperBtn").addEventListener("click", ()=>{
  if(turn!=="w") return;
  let moves=allMoves("w"); if(moves.length===0) return;
  let bestMove=null,bestScore=-1e9;
  for(let m of moves){ apply(m); let score=minimax(2,-1e9,1e9,false); undo(m);
    if(score>bestScore){ bestScore=score; bestMove=m; } }
  if(bestMove){ makeMove(bestMove.fr,bestMove.fc,bestMove.tr,bestMove.tc); turn="b"; setTimeout(aiMove,300); }
});

// ================== MINIMAX ==================
function minimax(depth,alpha,beta,max){
  if(depth===0) return evaluate();
  let color=max?"b":"w"; let best=max?-1e9:1e9;
  for(let m of allMoves(color)){ apply(m); let val=minimax(depth-1,alpha,beta,!max); undo(m);
    if(max){ best=Math.max(best,val); alpha=Math.max(alpha,val); } else { best=Math.min(best,val); beta=Math.min(beta,val); }
    if(beta<=alpha) break; }
  return best;
}

function evaluate(){
  const val={p:10,n:30,b:30,r:50,q:90,k:900}; let s=0;
  for(let r=0;r<8;r++) for(let c=0;c<8;c++){
    if(board[r][c]){ let v=val[board[r][c][1]]; s+=board[r][c][0]==="b"?v:-v; }
  } return s;
}

function allMoves(color){
  let moves=[];
  for(let r=0;r<8;r++) for(let c=0;c<8;c++) if(board[r][c] && board[r][c][0]===color) for(let r2=0;r2<8;r2++) for(let c2=0;c2<8;c2++) if(legal(r,c,r2,c2)) moves.push({fr:r,fc:c,tr:r2,tc:c2,piece:board[r][c],captured:board[r2][c2]});
  return moves;
}

function apply(m){ board[m.tr][m.tc]=m.piece; board[m.fr][m.fc]=""; }
function undo(m){ board[m.fr][m.fc]=m.piece; board[m.tr][m.tc]=m.captured; }

function pos(r,c){ return String.fromCharCode(97+c)+(8-r); }

// ================== MOVES & LEGAL ==================
function possibleMoves(r,c){ let m=[]; for(let r2=0;r2<8;r2++) for(let c2=0;c2<8;c2++) if(legal(r,c,r2,c2)) m.push({r:r2,c:c2}); return m; }
function legal(r1,c1,r2,c2){ if(!canMove(r1,c1,r2,c2)) return false;
  let save=board[r2][c2]; board[r2][c2]=board[r1][c1]; board[r1][c1]=""; let inCheck=kingCheck(board[r2][c2][0]); board[r1][c1]=board[r2][c2]; board[r2][c2]=save; return !inCheck; }

function canMove(r1,c1,r2,c2){
  const piece=board[r1][c1]; if(!piece) return false;
  if(board[r2][c2] && board[r2][c2][0]===piece[0]) return false;
  let dr=r2-r1, dc=c2-c1, type=piece[1], dir=piece[0]==="w"?-1:1;
  if(type==="p"){ if(dc===0 && dr===dir && !board[r2][c2]) return true; if(Math.abs(dc)===1 && dr===dir && board[r2][c2]) return true; return false; }
  if(type==="r" && (dr===0||dc===0)) return clear(r1,c1,r2,c2);
  if(type==="b" && Math.abs(dr)===Math.abs(dc)) return clear(r1,c1,r2,c2);
  if(type==="q" && (dr===0||dc===0||Math.abs(dr)===Math.abs(dc))) return clear(r1,c1,r2,c2);
  if(type==="n" && ((Math.abs(dr)===2&&Math.abs(dc)===1)||(Math.abs(dr)===1&&Math.abs(dc)===2))) return true;
  if(type==="k" && Math.abs(dr)<=1 && Math.abs(dc)<=1) return true;
  return false;
}

function clear(r1,c1,r2,c2){ let dr=Math.sign(r2-r1), dc=Math.sign(c2-c1), r=r1+dr, c=c1+dc; while(r!==r2 || c!==c2){ if(board[r][c]) return false; r+=dr;c+=dc;} return true; }

// ================== KING CHECK ==================
function kingCheck(color){
  let kr,kc,inCheck=false;
  for(let r=0;r<8;r++) for(let c=0;c<8;c++) if(board[r][c]===color+"k"){ kr=r; kc=c; break; }
  for(let r=0;r<8;r++) for(let c=0;c<8;c++) if(board[r][c] && board[r][c][0]!==color) if(canMove(r,c,kr,kc)) inCheck=true;
  boardEl.querySelectorAll(".square").forEach(sq=>{ sq.classList.remove("in-check"); sq.classList.remove("blink"); });
  if(inCheck){ const sq=boardEl.querySelector(`.square[data-r='${kr}'][data-c='${kc}']`); if(sq){ sq.classList.add("in-check"); sq.classList.add("blink"); }}
  return inCheck;
}

// ================== TIMER ==================
let totalSeconds=0;
setInterval(()=>{
  totalSeconds++;
  let min=Math.floor(totalSeconds/60);
  let sec=totalSeconds%60;
  timerEl.textContent=`الوقت: ${String(min).padStart(2,'0')}:${String(sec).padStart(2,'0')}`;
},1000);




// إنشاء البيانات الأولية للرسم البياني
let pieceCount = {}; // عدد الحركات لكل قطعة
const ctx = document.getElementById('gameStats').getContext('2d');
const chart = new Chart(ctx, {
  type: 'bar',
  data: {
    labels: [], // أسماء القطع
    datasets: [{
      label: 'عدد التحركات لكل قطعة',
      data: [],
      backgroundColor: 'rgba(75, 192, 192, 0.7)'
    }]
  },
  options: {
    responsive:true,
    scales: {
      y: { beginAtZero: true }
    }
  }
});

// دالة لتحديث الرسم البياني بعد كل حركة
function updateChart() {
  pieceCount = {};
  moveHistory.forEach(m => {
    pieceCount[m.piece] = (pieceCount[m.piece]||0)+1;
  });

  chart.data.labels = Object.keys(pieceCount);
  chart.data.datasets[0].data = Object.values(pieceCount);
  chart.update();
}

// تعديل makeMove و undoMove
function makeMove(r1, c1, r2, c2){
  let piece = board[r1][c1];
  let captured = board[r2][c2];

  moveHistory.push({fromR:r1, fromC:c1, toR:r2, toC:c2, piece, captured, turn});

  // captured panel
  if(captured){
    if(captured[0]==="w") addCaptured(captured,"w");
    else addCaptured(captured,"b");
  }

  board[r2][c2] = piece;
  board[r1][c1] = "";

  lastMove = {fromR:r1, fromC:c1, toR:r2, toC:c2};

  // الترقية
  if((piece==="wp" && r2===0) || (piece==="bp" && r2===7)){
    promoSquare = {r:r2, c:c2};
    if(turn==="w") promoEl.classList.remove("hidden");
    else board[r2][c2] = piece[0]+"q";
  }

  // سجل الحركة
  history.push(pos(r1,c1)+"-"+pos(r2,c2));
  draw();
  updateChart(); // تحديث الرسم البياني بعد كل حركة
}

function undoMove(){
  if(moveHistory.length === 0) return;

  let m = moveHistory.pop();
  board[m.fromR][m.fromC] = m.piece;

  if(m.captured){
    board[m.toR][m.toC] = m.captured;
    if(m.captured[0]==="w"){
      let imgs = capturedWhiteEl.querySelectorAll("img");
      if(imgs.length) capturedWhiteEl.removeChild(imgs[imgs.length-1]);
    } else {
      let imgs = capturedBlackEl.querySelectorAll("img");
      if(imgs.length) capturedBlackEl.removeChild(imgs[imgs.length-1]);
    }
  } else {
    board[m.toR][m.toC] = "";
  }

  history.pop();
  turn = turn==="w" ? "b" : "w";
  lastMove = moveHistory.length ? {
    fromR: moveHistory[moveHistory.length-1].fromR,
    fromC: moveHistory[moveHistory.length-1].fromC,
    toR: moveHistory[moveHistory.length-1].toR,
    toC: moveHistory[moveHistory.length-1].toC
  } : null;

  draw();
  updateChart(); // تحديث الرسم البياني بعد التراجع
}




const themeSelect = document.getElementById("boardTheme");

themeSelect.addEventListener("change", ()=>{
  const theme = themeSelect.value; // classic, dark, green, blue

  // نحذف كل الثيمات السابقة من الـ container
  const container = document.getElementById("container");
  container.classList.remove("theme-classic","theme-dark","theme-green","theme-blue");

  // نضيف الثيم الجديد
  container.classList.add("theme-" + theme);

  draw(); // إعادة رسم اللوحة مع الألوان الجديدة
});



// تعريف الأصوات
const moveSound = new Audio('sounds/move.mp3');
const captureSound = new Audio('sounds/capture.mp3');
const promoSound = new Audio('sounds/promo.mp3');
const clickSound = new Audio('sounds/click.mp3');

const aiLevelSelect = document.getElementById("aiLevel");



function makeMove(r1,c1,r2,c2){
  let start = Date.now();

  // تنفيذ الحركة كالعادة
  let piece = board[r1][c1];
  let captured = board[r2][c2];
  moveHistory.push({fromR:r1,fromC:c1,toR:r2,toC:c2,piece,captured,turn});

  // تسجيل الحركة في التحليل
  analysis.moves.push({
    piece,
    from: pos(r1,c1),
    to: pos(r2,c2),
    captured,
    turn,
    time: Date.now() - start
  });

  analysis.pieceUsage[piece] = (analysis.pieceUsage[piece]||0)+1;
  analysis.totalTime += Date.now() - start;

  board[r2][c2] = piece;
  board[r1][c1] = "";
  draw();
  updateChart();
}



// ================== INIT ==================
draw();
