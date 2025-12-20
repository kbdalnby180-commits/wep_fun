const killer = "2"; // القاتل الحقيقي
const solveBtn = document.getElementById('solveBtn');
const result = document.getElementById('result');
const choice = document.getElementById('choice');

// تحقق إذا تم حل القضية مسبقًا
if(localStorage.getItem('case01_done')){
    solveBtn.disabled = true;
    result.textContent = "تم اتخاذ القرار مسبقًا. القضية مغلقة.";
    result.style.color = "#aaa";
    result.style.textShadow = "none";
}

function solve(){
    const selected = choice.value;

    if(!selected){
        result.textContent = "اختر مشتبه قبل الإغلاق";
        result.style.color = "#ff0";
        result.style.textShadow = "0 0 5px #ff0";
        return;
    }

    // إغلاق القضية وتخزين الحالة
    localStorage.setItem('case01_done','1');
    solveBtn.disabled = true;

    if(selected === killer){
        result.textContent = "✔ تحليل عبقري… أغلقت القضية";
        result.style.color = "#0f0";
        result.style.textShadow = "0 0 10px #0f0, 0 0 20px #0f0";
    } else {
        result.textContent = "✖ خطأ نهائي… القاتل أفلت";
        result.style.color = "#f55";
        result.style.textShadow = "0 0 10px #f55, 0 0 20px #f55";
    }
}
