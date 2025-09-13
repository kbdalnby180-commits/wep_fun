let timerInterval;

function startTimer(){
 let minutes=document.getElementById("minutes").value;
 if(!minutes){alert("اكتب وقت المذاكرة بالدقايق");return;}
 let seconds=minutes*60;
 clearInterval(timerInterval);
 timerInterval=setInterval(()=>{
   let m=Math.floor(seconds/60);
   let s=seconds%60;
   document.getElementById("timer").textContent=
     (m<10?"0"+m:m)+":"+(s<10?"0"+s:s);
   if(seconds<=0){
     clearInterval(timerInterval);
     alert("انتهت الجلسة! خد استراحة 🎉");
   }
   seconds--;
 },1000);
}

function addTask(){
 let taskText=document.getElementById("taskInput").value;
 if(!taskText) return;
 let li=document.createElement("li");
 li.textContent=taskText;
 li.onclick=()=>li.classList.toggle("done");
 document.getElementById("taskList").appendChild(li);
 document.getElementById("taskInput").value="";
}

// نصائح تحفيزية
const tips=[
 "ذاكر بتركيز 25 دقيقة وخد راحة 5 دقائق.",
 "اكتب ملخص صغير بعد ما تخلص كل درس.",
 "ابدأ بالأصعب أولاً عشان تبقي فاضي للسهلة.",
 "اشرب مياه كتير وانت بتذاكر.",
 "حدد هدف صغير لكل جلسة.",
 "بعد كل إنجاز كافئ نفسك بحاجة تحبها.",
 "اختصر وقتك بعيد عن الموبايل وانت بتذاكر.",
 "ذاكر في مكان هادي ومنظم.",
 "قسم المنهج لأجزاء صغيرة.",
 "ذاكر بصوت عالي يساعدك تفتكر أسرع."
];
document.getElementById("tipBox").textContent=
 tips[Math.floor(Math.random()*tips.length)];

// تبديل الوضع
function toggleMode(){
 document.body.classList.toggle("day");
 document.body.classList.toggle("night");
}
