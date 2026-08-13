document.addEventListener("DOMContentLoaded", function () {
"use strict";

/* ================= CAPTCHA ================= */
const captchaScreen = document.getElementById("captchaScreen");
const blocks = document.querySelectorAll(".captcha-block");
const captchaMessage = document.getElementById("captchaMessage");
let correct = -1;

function newCaptcha() {
    correct = Math.floor(Math.random() * blocks.length);
    blocks.forEach(b => {
        b.classList.remove("correct");
        b.style.setProperty("background", "#303744", "important");
    });
    if (blocks[correct]) blocks[correct].style.setProperty("background", "#00ff3c", "important");
    if (captchaMessage) {
        captchaMessage.textContent = "Click the BRIGHT GREEN block";
        captchaMessage.style.color = "#aeb5c2";
    }
}

blocks.forEach((block, index) => {
    block.addEventListener("click", function (e) {
        e.preventDefault();
        if (index === correct) {
            captchaMessage.textContent = "✓ CAPTCHA passed!";
            captchaMessage.style.color = "#57d163";
            setTimeout(() => {
                captchaScreen.style.display = "none";
                const login = document.getElementById("loginScreen");
                if (login) login.style.display = "flex";
            }, 500);
        } else {
            captchaMessage.textContent = "✕ Wrong block! Try again.";
            captchaMessage.style.color = "#ff5555";
            setTimeout(newCaptcha, 600);
        }
    });
});
newCaptcha();

/* ================= LOGIN ================= */
const loginScreen = document.getElementById("loginScreen");
const username = document.getElementById("username");
const password = document.getElementById("password");
const loginButton = document.getElementById("loginButton");
const createButton = document.getElementById("createButton");
const loginMessage = document.getElementById("loginMessage");

let accounts = {};
try { accounts = JSON.parse(localStorage.getItem("bedrockAccounts") || "{}"); } catch(e) {}

function showLogin(text, ok) {
    if (!loginMessage) return;
    loginMessage.textContent = text;
    loginMessage.style.color = ok ? "#57d163" : "#ff5555";
}

function login() {
    const u = username.value.trim(), p = password.value;
    if (!u || !p) return showLogin("Enter username and password.", false);
    if (accounts[u] && accounts[u].password === p) {
        localStorage.setItem("bedrockUser", u);
        showLogin("✓ Login successful!", true);
        setTimeout(() => loginScreen.style.display = "none", 500);
    } else showLogin("Incorrect username or password.", false);
}

function createAccount() {
    const u = username.value.trim(), p = password.value;
    if (!u || !p) return showLogin("Enter username and password.", false);
    if (u.length < 3) return showLogin("Username needs 3+ characters.", false);
    if (p.length < 4) return showLogin("Password needs 4+ characters.", false);
    if (accounts[u]) return showLogin("Username already exists.", false);
    accounts[u] = {password:p};
    localStorage.setItem("bedrockAccounts", JSON.stringify(accounts));
    localStorage.setItem("bedrockUser", u);
    showLogin("✓ Account created!", true);
    setTimeout(() => loginScreen.style.display = "none", 500);
}

if (loginButton) loginButton.addEventListener("click", e => { e.preventDefault(); login(); });
if (createButton) createButton.addEventListener("click", e => { e.preventDefault(); createAccount(); });
if (password) password.addEventListener("keydown", e => { if (e.key === "Enter") login(); });

captchaScreen.style.display = "flex";
if (loginScreen) loginScreen.style.display = "none";

/* ================= SEARCH ================= */
const search = document.getElementById("search");
window.searchItems = function () {
    if (!search) return;
    const q = search.value.toLowerCase();
    document.querySelectorAll(".card").forEach(card => {
        card.style.display = card.textContent.toLowerCase().includes(q) ? "" : "none";
    });
};
if (search) search.addEventListener("input", window.searchItems);

/* ================= DOWNLOADS ================= */
window.download = function(name) {
    const allowed = {
        "Fantasy Add-on.mcaddon": "packs/Fantasy Add-on.mcaddon",
        "SkyBlockMap.mcworld": "packs/SkyBlockMap.mcworld",
        "RTX_Pack.mcaddon": "packs/RTX_Pack.mcaddon"
    };

    const file = allowed[name];

    if (!file) {
        alert("Pack file not configured.");
        return;
    }

    const a = document.createElement("a");
    a.href = file;
    a.download = name;
    document.body.appendChild(a);
    a.click();
    a.remove();
};

/* ================= FEEDBACK ================= */
const feedbackForm = document.getElementById("feedbackForm");
const feedbackResult = document.getElementById("feedbackResult");

if (feedbackForm) {
    feedbackForm.addEventListener("submit", function (e) {
        const name = document.getElementById("feedbackName").value.trim();
        const email = document.getElementById("feedbackEmail").value.trim();
        const rating = document.getElementById("feedbackRating").value;
        const message = document.getElementById("feedbackMessage").value.trim();
        const button = feedbackForm.querySelector("button[type='submit']");

        if (!name || !email || !rating || !message) {
            e.preventDefault();
            feedbackResult.textContent = "Please fill in all fields.";
            feedbackResult.style.color = "#ff5555";
            return;
        }

        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            e.preventDefault();
            feedbackResult.textContent = "Please enter a valid email address.";
            feedbackResult.style.color = "#ff5555";
            return;
        }

        // Submit to FormSubmit inside a hidden iframe, so the website does NOT refresh.
        if (button) { button.disabled = true; button.textContent = "Sending..."; }
        feedbackResult.textContent = "Sending feedback...";
        feedbackResult.style.color = "#aeb5c2";

        setTimeout(function () {
            feedbackResult.textContent = "✓ Feedback submitted! Check your email for FormSubmit activation if this is the first submission.";
            feedbackResult.style.color = "#57d163";
            feedbackForm.reset();
            if (button) { button.disabled = false; button.textContent = "Send Feedback"; }
        }, 1500);
    });
}

/* ================= GAME ================= */
const canvas = document.getElementById("gameCanvas");
if (!canvas) return;
const ctx = canvas.getContext("2d");
const TILE=40, W=120, H=20;
const world=[];

for(let y=0;y<H;y++){
    world[y]=[];
    for(let x=0;x<W;x++) world[y][x]=y===11?"grass":y>11?"dirt":null;
}

function tree(x){
    for(let y=8;y<=10;y++) world[y][x]="wood";
    for(let dx=-2;dx<=2;dx++) for(let dy=-2;dy<=0;dy++){
        const tx=x+dx,ty=8+dy;
        if(tx>=0&&tx<W&&ty>=0&&ty<H) world[ty][tx]="leaves";
    }
}
[10,25,45,70,95].forEach(tree);

const player={x:300,y:100,w:28,h:38,vx:0,vy:0,ground:false};
const keys={left:false,right:false,jump:false};
let jump=false, broken=0, lastBreak=0;

function resize(){
    const r=canvas.getBoundingClientRect();
    const d=Math.min(devicePixelRatio||1,2);
    canvas.width=Math.max(320,r.width*d);
    canvas.height=Math.max(300,r.height*d);
    ctx.setTransform(d,0,0,d,0,0);
}
resize();
window.addEventListener("resize",resize);

function setKey(k,v){ keys[k]=v; if(k==="jump"&&v) jump=true; }

document.addEventListener("keydown",e=>{
    const k=e.key.toLowerCase();
    if(k==="a"||k==="arrowleft") setKey("left",true);
    if(k==="d"||k==="arrowright") setKey("right",true);
    if(k==="w"||k==="arrowup"||k===" ") {e.preventDefault();setKey("jump",true);}
});
document.addEventListener("keyup",e=>{
    const k=e.key.toLowerCase();
    if(k==="a"||k==="arrowleft") setKey("left",false);
    if(k==="d"||k==="arrowright") setKey("right",false);
    if(k==="w"||k==="arrowup"||k===" ") setKey("jump",false);
});

document.querySelectorAll("[data-game-key]").forEach(btn=>{
    const k=btn.dataset.gameKey;
    const down=e=>{e.preventDefault();setKey(k,true);};
    const up=e=>{e.preventDefault();setKey(k,false);};
    btn.addEventListener("pointerdown",down);
    btn.addEventListener("pointerup",up);
    btn.addEventListener("pointercancel",up);
    btn.addEventListener("pointerleave",up);
});

function solid(x,y){
    if(x<0||x>=W||y<0||y>=H) return true;
    return world[y][x]!==null;
}

function collide(x,y){
    const l=Math.floor(x/TILE),r=Math.floor((x+player.w-1)/TILE);
    const t=Math.floor(y/TILE),b=Math.floor((y+player.h-1)/TILE);
    return solid(l,t)||solid(r,t)||solid(l,b)||solid(r,b);
}

function update(){
    player.vx=keys.left?-4:keys.right?4:0;
    if(jump&&player.ground){player.vy=-11;player.ground=false;}
    jump=false;
    player.vy=Math.min(player.vy+0.55,14);

    const nx=player.x+player.vx;
    if(!collide(nx,player.y)) player.x=nx;

    const ny=player.y+player.vy;
    if(!collide(player.x,ny)){
        player.y=ny;player.ground=false;
    }else{
        if(player.vy>0){
            player.y=Math.floor((player.y+player.h)/TILE)*TILE-player.h;
            player.ground=true;
        }
        player.vy=0;
    }
    player.x=Math.max(0,Math.min(W*TILE-player.w,player.x));
}

function breakBlock(mx,my){
    const now=performance.now();
    if(now-lastBreak<150)return;
    lastBreak=now;

    const r=canvas.getBoundingClientRect();
    const cam=Math.max(0,Math.min(W*TILE-canvas.clientWidth,player.x-canvas.clientWidth/2));
    const x=Math.floor((mx-r.left+cam)/TILE);
    const y=Math.floor((my-r.top)/TILE);

    if(x>=0&&x<W&&y>=0&&y<H&&world[y][x]){
        world[y][x]=null;
        broken++;
        const n=document.getElementById("gameBlocks");
        if(n)n.textContent=broken;
    }
}
canvas.addEventListener("pointerdown",e=>{e.preventDefault();breakBlock(e.clientX,e.clientY);});

function draw(){
    const width=canvas.clientWidth,height=canvas.clientHeight;
    ctx.fillStyle="#70c8ff";ctx.fillRect(0,0,width,height);

    const cam=Math.max(0,Math.min(W*TILE-width,player.x-width/2));

    for(let y=0;y<H;y++)for(let x=0;x<W;x++){
        const type=world[y][x];
        if(!type)continue;
        const sx=x*TILE-cam,sy=y*TILE;
        if(type==="grass"){
            ctx.fillStyle="#704525";ctx.fillRect(sx,sy,TILE,TILE);
            ctx.fillStyle="#45a049";ctx.fillRect(sx,sy,TILE,8);
        }else if(type==="dirt"){
            ctx.fillStyle="#704525";ctx.fillRect(sx,sy,TILE,TILE);
        }else if(type==="wood"){
            ctx.fillStyle="#8b5a2b";ctx.fillRect(sx,sy,TILE,TILE);
        }else{
            ctx.fillStyle="#278b3d";ctx.fillRect(sx,sy,TILE,TILE);
        }
    }

    const px=player.x-cam;
    ctx.fillStyle="#35a853";ctx.fillRect(px,player.y,player.w,player.h);
    ctx.fillStyle="#f2c29b";ctx.fillRect(px+4,player.y+4,20,18);
    ctx.fillStyle="#111";ctx.fillRect(px+8,player.y+10,4,4);ctx.fillRect(px+17,player.y+10,4,4);
}

function loop(){update();draw();requestAnimationFrame(loop);}
loop();
});