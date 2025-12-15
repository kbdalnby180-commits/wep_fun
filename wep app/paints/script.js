// إعداد النجوم
for(let i=0;i<100;i++){
    const star=document.createElement('div');
    star.className='star';
    star.style.top=Math.random()*100+'%';
    star.style.left=Math.random()*100+'%';
    star.style.width=star.style.height=Math.random()*2+1+'px';
    document.body.appendChild(star);
}

// عرض الصورة المرفوعة
const selectedImage=document.getElementById('selectedImage');
const fullscreenBtn=document.getElementById('fullscreenBtn');

document.getElementById('imageUpload').addEventListener('change', function(){
    const file=this.files[0];
    if(file){
        const reader=new FileReader();
        reader.onload=function(e){
            selectedImage.src=e.target.result;
            selectedImage.style.display="block";
            fullscreenBtn.style.display="block";
        }
        reader.readAsDataURL(file);
    }
});

// عرض الصورة فول سكرين
fullscreenBtn.addEventListener('click', ()=>{
    if(selectedImage.requestFullscreen){
        selectedImage.requestFullscreen();
    } else if(selectedImage.webkitRequestFullscreen){
        selectedImage.webkitRequestFullscreen();
    } else if(selectedImage.msRequestFullscreen){
        selectedImage.msRequestFullscreen();
    }
});

// وضع نهاري / ليلي
let isDay=true;
const celestial=document.getElementById('celestial');

function updateBackground(){
    if(isDay){
        document.body.classList.remove('night');
        document.body.style.background="linear-gradient(180deg,#87CEEB,#FFD700)";
        celestial.style.background="radial-gradient(circle,#FFD700,#FFA500)";
        celestial.style.boxShadow="0 0 50px #FFD700";
        document.querySelectorAll('.star').forEach(s=>s.style.opacity=0);
    } else {
        document.body.classList.add('night');
        document.body.style.background="#000";
        celestial.style.background="radial-gradient(circle,#fff,#ccc)";
        celestial.style.boxShadow="0 0 30px #fff";
        document.querySelectorAll('.star').forEach(s=>s.style.opacity=Math.random());
    }
}

document.getElementById('dayNightBtn').addEventListener('click',()=>{
    isDay=!isDay;
    updateBackground();
});

updateBackground();
