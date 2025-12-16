const killer="2"; // القاتل الحقيقي
if(localStorage.getItem('case01_done')){
 document.getElementById('solveBtn').disabled=true;
 document.getElementById('result').textContent="تم اتخاذ القرار مسبقًا. القضية مغلقة.";
}
function solve(){
 const c=document.getElementById('choice').value;
 const r=document.getElementById('result');
 if(!c){r.textContent="اختر مشتبه قبل الإغلاق";return}
 localStorage.setItem('case01_done','1');
 document.getElementById('solveBtn').disabled=true;
 if(c===killer){r.textContent="✔ تحليل عبقري… أغلقت القضية";r.style.color="#0f0"}
 else{r.textContent="✖ خطأ نهائي… القاتل أفلت";r.style.color="#f55"}
}