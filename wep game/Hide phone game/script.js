let scores=[];
let seconds=300;
let timerInterval;
let breakInterval;
let playerNames=[];
let playersCount=3;

function generatePlayers(){
 playersCount=document.getElementById("playersCount").value;
 let inputs="";
 for(let i=1;i<=playersCount;i++){
   inputs+=`<input type="text" id="p${i}" placeholder="اسم اللاعب ${i}"><br>`;
 }
 document.getElementById("playersInputs").innerHTML=inputs;
}

function startGame(){
 playersCount=document.getElementById("playersCount").value;
 seconds=parseInt(document.getElementById("timerMinutes").value);
 playerNames=[];
 scores=[];
 
 for(let i=1;i<=playersCount;i++){
   let name=document.getElementById("p"+i)?.value||("لاعب "+i);
   playerNames.push(name);
   scores.push(0);
 }
 
 document.getElementById("scoreTable").innerHTML="";
 playerNames.forEach((n,i)=>{
   document.getElementById("scoreTable").innerHTML+=
     `<tr><td id="name${i}">${n}</td><td id="score${i}">0</td></tr>`;
 });
 
 let btns="";
 playerNames.forEach((n,i)=>{
   btns+=`<button class="btn" onclick="stopTime(${i})">📱 ${n}</button>`;
 });
 document.getElementById("buttonsArea").innerHTML=btns;
 
 document.getElementById("setup").style.display="none";
 document.getElementById("gameArea").style.display="block";
 
 startTimer();
}

function startTimer(){
 clearInterval(timerInterval);
 timerInterval=setInterval(()=>{
   let m=Math.floor(seconds/60);
   let s=seconds%60;
   document.getElementById("timer").textContent=
     (m<10?"0"+m:m)+":"+(s<10?"0"+s:s);
   if(seconds<=0){
     clearInterval(timerInterval);
     alert("⏰ انتهى الوقت!");
   }
   seconds--;
 },1000);
}

function stopTime(player){
 clearInterval(timerInterval);
 scores[player]++;
 document.getElementById("score"+player).textContent=scores[player];
 alert(`🎉 ${playerNames[player]} لقى الهاتف!`);
 
 // عرض عداد الجولة
 startBreak();
}

function startBreak(){
 document.getElementById("roundBreak").style.display="block";
 let breakTime=15;
 document.getElementById("breakCircle").textContent=breakTime;
 clearInterval(breakInterval);
 breakInterval=setInterval(()=>{
   breakTime--;
   document.getElementById("breakCircle").textContent=breakTime;
   if(breakTime<=0){
     clearInterval(breakInterval);
     document.getElementById("roundBreak").style.display="none";
     // إعادة ضبط الوقت
     seconds=parseInt(document.getElementById("timerMinutes").value);
     startTimer();
   }
 },1000);
}

function toggleTheme(){
 document.body.classList.toggle("night");
}
