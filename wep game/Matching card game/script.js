const emojis = ["🍎","🍌","🍇","🍉","🍒","🥑","🥕","🥦","🍔","🍕","🍟","🍩",
"🍪","🍫","🍿","🥤","⚽","🏀","🏈","🎾","🎲","🎯","🎹","🎸","🎺",
"🚗","✈️","🚀","🚲","🛵","🏰","🌋","🌙","⭐","☀️","🌈","❄️",
"🐶","🐱","🐭","🐹","🐰","🦊","🐻","🐼","🐸","🐵","🐧","🐦","🐤","🐴"];

let firstCard=null, secondCard=null, lock=false, matches=0;

const startBtn = document.getElementById("startBtn");
startBtn.addEventListener("click", startGame);

function startGame(){
  const game=document.getElementById("game");
  game.innerHTML="";
  let level=document.getElementById("level").value;
  let pairs=parseInt(level);
  let selected=emojis.sort(()=>0.5-Math.random()).slice(0,pairs);
  let cards=[...selected,...selected].sort(()=>0.5-Math.random());
  
  if(pairs<=6) game.style.gridTemplateColumns="repeat(4, 80px)";
  else if(pairs<=12) game.style.gridTemplateColumns="repeat(6, 80px)";
  else game.style.gridTemplateColumns="repeat(8, 80px)";
  
  matches=0; firstCard=secondCard=null; lock=false;
  
  cards.forEach(emoji=>{
    const card=document.createElement("div");
    card.classList.add("card");
    card.dataset.emoji=emoji;
    card.addEventListener("click", flipCard);
    game.appendChild(card);
  });
}

function flipCard(){
  if(lock||this===firstCard) return;
  this.textContent=this.dataset.emoji;
  this.classList.add("flipped");
  
  if(!firstCard){
    firstCard=this;
  } else {
    secondCard=this;
    lock=true;
    if(firstCard.dataset.emoji===secondCard.dataset.emoji){
      setTimeout(()=>{
        firstCard.classList.add("hidden");
        secondCard.classList.add("hidden");
        resetTurn();
        matches++;
        let total=document.getElementById("level").value;
        if(matches==total){
          setTimeout(()=>alert("🎉 مبروك! أنهيت اللعبة"),500);
        }
      },500);
    } else {
      setTimeout(()=>{
        firstCard.textContent="";
        secondCard.textContent="";
        firstCard.classList.remove("flipped");
        secondCard.classList.remove("flipped");
        resetTurn();
      },800);
    }
  }
}

function resetTurn(){
  [firstCard,secondCard,lock]=[null,null,false];
}
