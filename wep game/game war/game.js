const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const player = {
    x: canvas.width/2 - 25,
    y: canvas.height - 120,
    width: 50,
    height: 50,
    color: "lime",
    speed: 6,
    hp: 5,
    cooldown: 0
};

let bullets = [];
let enemies = [];
let explosions = [];
let score = 0;
let level = 1;
let gameOver = false;

function spawnEnemy() {
    const type = Math.random();
    let enemy;
    if(type<0.5){
        enemy = { x: Math.random()*(canvas.width-30), y:-40, width:30, height:30, color:"red", speed:2+level*0.2, hp:1 };
    } else if(type<0.8){
        enemy = { x: Math.random()*(canvas.width-60), y:-60, width:60, height:40, color:"darkred", speed:1.5+level*0.2, hp:3 };
    } else {
        enemy = { x: Math.random()*(canvas.width-40), y:-50, width:40, height:40, color:"orange", speed:3+level*0.3, hp:2 };
    }
    enemies.push(enemy);
}

function shoot(x, y, friendly=true){
    bullets.push({
        x:x,
        y:y,
        width:6,
        height:15,
        color:friendly?"yellow":"red",
        speed:friendly?7:-4,
        friendly:friendly
    });
}

function explode(x,y){ explosions.push({x,y,radius:0}); }

function updateHPBar(){
    document.getElementById("hpFill").style.width = (player.hp/5*100)+"%";
}

function update(){
    if(gameOver) return;
    ctx.clearRect(0,0,canvas.width,canvas.height);

    ctx.fillStyle = player.color;
    ctx.fillRect(player.x,player.y,player.width,player.height);

    bullets.forEach((b,i)=>{
        b.y -= b.speed;
        ctx.fillStyle = b.color;
        ctx.fillRect(b.x,b.y,b.width,b.height);
        if(b.y<0 || b.y>canvas.height) bullets.splice(i,1);
    });

    enemies.forEach((e,ei)=>{
        e.y += e.speed;
        ctx.fillStyle = e.color;
        ctx.fillRect(e.x,e.y,e.width,e.height);

        bullets.forEach((b,bi)=>{
            if(b.friendly &&
               b.x < e.x+e.width &&
               b.x+b.width>e.x &&
               b.y<e.y+e.height &&
               b.y+b.height>e.y){
                e.hp--;
                bullets.splice(bi,1);
                if(e.hp<=0){
                    explode(e.x+e.width/2,e.y+e.height/2);
                    enemies.splice(ei,1);
                    score+=100;
                    if(score % 1000 ===0) level++;
                }
            }
        });

        if(player.x<e.x+e.width &&
           player.x+player.width>e.x &&
           player.y<e.y+e.height &&
           player.y+player.height>e.y){
               player.hp--;
               enemies.splice(ei,1);
               updateHPBar();
               if(player.hp<=0){
                   gameOver = true;
                   setTimeout(()=>alert("Game Over! نقاطك: "+score),100);
               }
        }

        if(e.y>canvas.height) enemies.splice(ei,1);
    });

    explosions.forEach((exp,i)=>{
        exp.radius+=2;
        ctx.beginPath();
        ctx.arc(exp.x,exp.y,exp.radius,0,Math.PI*2);
        ctx.fillStyle="orange";
        ctx.fill();
        if(exp.radius>30) explosions.splice(i,1);
    });

    ctx.fillStyle="white";
    ctx.font="20px Arial";
    ctx.fillText("Score: "+score,20,30);
    ctx.fillText("Level: "+level,20,60);

    requestAnimationFrame(update);
}

document.addEventListener("keydown",e=>{
    if(e.key==="ArrowLeft" && player.x>0) player.x-=player.speed;
    if(e.key==="ArrowRight" && player.x+player.width<canvas.width) player.x+=player.speed;
    if(e.key===" " && player.cooldown<=0){
        shoot(player.x+player.width/2,player.y,true);
        player.cooldown = 15;
    }
});
setInterval(()=>{if(player.cooldown>0) player.cooldown--;},16);

let touchX = null;
canvas.addEventListener("touchstart",e=>{ touchX = e.touches[0].clientX; });
canvas.addEventListener("touchmove",e=>{
    const dx = e.touches[0].clientX - touchX;
    player.x += dx;
    if(player.x<0) player.x=0;
    if(player.x+player.width>canvas.width) player.x=canvas.width-player.width;
    touchX = e.touches[0].clientX;
});
canvas.addEventListener("touchend",e=>{ shoot(player.x+player.width/2,player.y,true); });

setInterval(spawnEnemy,1500);
update();
