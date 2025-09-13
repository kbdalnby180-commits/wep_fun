const board = document.getElementById("board");
const statusEl = document.getElementById("status");
const restartBtn = document.getElementById("restart");
const menu = document.getElementById("menu");
let cells = [];
let gameOver = false;
let mode = "bot"; // افتراضي ضد روبوت
let currentPlayer = "X";

function startGame(selectedMode){
  mode = selectedMode;
  menu.style.display = "none";
  board.style.display = "grid";
  restartBtn.style.display = "inline-block";
  statusEl.textContent = "ابدأ اللعب!";
  initBoard();
}

function initBoard(){
  board.innerHTML = "";
  cells = [];
  gameOver = false;
  currentPlayer = "X";
  for (let i=0; i<9; i++){
    let cell = document.createElement("div");
    cell.classList.add("cell");
    cell.addEventListener("click", ()=>playerMove(i));
    board.appendChild(cell);
    cells.push(cell);
  }
}

function playerMove(i){
  if (cells[i].textContent || gameOver) return;
  cells[i].textContent = currentPlayer;

  if (checkWin(currentPlayer)) {
    statusEl.textContent = (currentPlayer==="X"?"🎉 اللاعب X كسب!":"🎉 اللاعب O كسب!");
    gameOver = true;
    return;
  }
  if (isDraw()) {
    statusEl.textContent = "🤝 تعادل!";
    gameOver = true;
    return;
  }

  if (mode==="human") {
    currentPlayer = currentPlayer==="X" ? "O" : "X";
    statusEl.textContent = "الدور على " + currentPlayer;
  } else {
    if (currentPlayer==="X") {
      setTimeout(botMove, 500);
    }
  }
}

/* الروبوت الذكي باستخدام Minimax */
function botMove(){
  let bestScore = -Infinity;
  let move;
  for (let i=0; i<9; i++){
    if (!cells[i].textContent){
      cells[i].textContent = "O";
      let score = minimax(cells, 0, false);
      cells[i].textContent = "";
      if (score > bestScore){
        bestScore = score;
        move = i;
      }
    }
  }
  cells[move].textContent = "O";

  if (checkWin("O")) {statusEl.textContent="🤖 الروبوت كسب!"; gameOver=true; return;}
  if (isDraw()) {statusEl.textContent="🤝 تعادل!"; gameOver=true; return;}
}

function minimax(boardState, depth, isMaximizing){
  if (checkWin("O")) return 10 - depth;
  if (checkWin("X")) return depth - 10;
  if (isDraw()) return 0;

  if (isMaximizing){
    let bestScore = -Infinity;
    for (let i=0; i<9; i++){
      if (!boardState[i].textContent){
        boardState[i].textContent = "O";
        let score = minimax(boardState, depth+1, false);
        boardState[i].textContent = "";
        bestScore = Math.max(score, bestScore);
      }
    }
    return bestScore;
  } else {
    let bestScore = Infinity;
    for (let i=0; i<9; i++){
      if (!boardState[i].textContent){
        boardState[i].textContent = "X";
        let score = minimax(boardState, depth+1, true);
        boardState[i].textContent = "";
        bestScore = Math.min(score, bestScore);
      }
    }
    return bestScore;
  }
}

function checkWin(player){
  const wins = [
    [0,1,2],[3,4,5],[6,7,8],
    [0,3,6],[1,4,7],[2,5,8],
    [0,4,8],[2,4,6]
  ];
  return wins.some(comb => comb.every(idx => cells[idx].textContent===player));
}

function isDraw(){
  return cells.every(c=>c.textContent);
}

function restart(){
  initBoard();
  statusEl.textContent="ابدأ اللعب!";
}
