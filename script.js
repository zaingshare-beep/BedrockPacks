document.addEventListener("DOMContentLoaded",function(){
const captchaScreen=document.getElementById("captchaScreen"),blocks=document.querySelectorAll(".captcha-block"),msg=document.getElementById("captchaMessage");let correct=0;
function newCaptcha(){correct=Math.floor(Math.random()*blocks.length);blocks.forEach(b=>b.classList.remove("correct"));blocks[correct].classList.add("correct");msg.textContent="Click the green block";msg.style.color="#aeb5c2"}
blocks.forEach((b,i)=>b.addEventListener("click",()=>{if(i===correct){msg.textContent="✓ Verification successful!";msg.style.color="#57d163";setTimeout(()=>{captchaScreen.style.display="none";document.getElementById("loginScreen").style.display="flex"},500)}else{msg.textContent="✕ Wrong block! Try again.";msg.style.color="#ff5555";setTimeout(newCaptcha,600)}}));newCaptcha();

const loginScreen=document.getElementById("loginScreen"),user=document.getElementById("username"),pass=document.getElementById("password"),loginBtn=document.getElementById("loginButton"),createBtn=document.getElementById("createButton"),loginMsg=document.getElementById("loginMessage");
let accounts={};try{accounts=JSON.parse(localStorage.getItem("bedrockAccounts")||"{}")}catch(e){}
function message(t,ok=false){loginMsg.textContent=t;loginMsg.style.color=ok?"#57d163":"#ff5555"}
function create(){let u=user.value.trim(),p=pass.value;if(!u||!p)return message("Please enter a username and password.");if(u.length<3)return message("Username must be at least 3 characters.");if(p.length<4)return message("Password must be at least 4 characters.");if(accounts[u])return message("That username already exists.");accounts[u]={password:p};localStorage.setItem("bedrockAccounts",JSON.stringify(accounts));localStorage.setItem("bedrockUser",u);message("✓ Account created successfully!",true);setTimeout(()=>loginScreen.style.display="none",700)}
function login(){let u=user.value.trim(),p=pass.value;if(!u||!p)return message("Please enter a username and password.");if(accounts[u]&&accounts[u].password===p){localStorage.setItem("bedrockUser",u);message("✓ Login successful! Welcome "+u+"!",true);setTimeout(()=>loginScreen.style.display="none",700)}else message("Incorrect username or password.")}
loginBtn.addEventListener("click",login);createBtn.addEventListener("click",create);pass.addEventListener("keydown",e=>{if(e.key==="Enter")login()});
if(localStorage.getItem("bedrockUser")){captchaScreen.style.display="none";loginScreen.style.display="none"}

const search=document.getElementById("search");
window.searchItems=function(){let q=search.value.toLowerCase();document.querySelectorAll(".card").forEach(c=>c.style.display=c.textContent.toLowerCase().includes(q)?"":"none")};
search.addEventListener("input",window.searchItems);

const files={"Fantasy Add-on":"packs/fantasy-addon.mcpack","RTX Pack":"packs/rtx-pack.mcpack","SkyBlock":"packs/skyblock.mcpack","Fantasy Pack":"packs/fantasy-addon.mcpack"};
window.download=function(name){let a=document.createElement("a");a.href=files[name];a.download=files[name].split("/").pop();document.body.appendChild(a);a.click();a.remove()};

const canvas=document.getElementById("gameCanvas");if(!canvas)return;const ctx=canvas.getContext("2d"),T=40,W=120,H=20,world=[];
for(let y=0;y<H;y++){world[y]=[];for(let x=0;x<W;x++)world[y][x]=y===11?"grass":y>11?"dirt":null}
function tree(x){for(let y=8;y<=10;y++)world[y][x]="wood";for(let dx=-2;dx<=2;dx++)for(let dy=-2;dy<=0;dy++){let xx=x+dx,yy=8+dy;if(xx>=0&&xx<W&&yy>=0&&yy<H)world[yy][xx]="leaves"}}[10,25,45,70,95].forEach(tree);
const p={x:300,y:100,width:28,height:38,vx:0,vy:0,ground:false},keys={left:false,right:false,jump:false,break:false};let jump=false,broken=0,last=0;
function key(k,v){keys[k]=v;if(k==="jump"&&v)jump=true}
addEventListener("keydown",e=>{let k=e.key.toLowerCase();if(k==="a"||k==="arrowleft")key("left",1);if(k==="d"||k==="arrowright")key("right",1);if(k==="w"||k==="arrowup"||k===" "){e.preventDefault();key("jump",1)}if(k==="e")key("break",1)});
addEventListener("keyup",e=>{let k=e.key.toLowerCase();if(k==="a"||k==="arrowleft")key("left",0);if(k==="d"||k==="arrowright")key("right",0);if(k==="w"||k==="arrowup"||k===" ")key("jump",0);if(k==="e")key("break",0)});
document.querySelectorAll("[data-game-key]").forEach(b=>{let k=b.dataset.gameKey;b.addEventListener("pointerdown",e=>{e.preventDefault();key(k,1)});["pointerup","pointercancel","pointerleave"].forEach(ev=>b.addEventListener(ev,()=>key(k,0)))});
function resize(){let r=canvas.getBoundingClientRect(),d=Math.min(devicePixelRatio||1,2);canvas.width=r.width*d;canvas.height=r.height*d;ctx.setTransform(d,0,0,d,0,0)}resize();addEventListener("resize",resize);
function solid(x,y){if(x<0||x>=W||y<0||y>=H)return true;return world[y][x]!==null}
function collide(x,y){let l=Math.floor(x/T),r=Math.floor((x+p.width-1)/T),t=Math.floor(y/T),b=Math.floor((y+p.height-1)/T);return solid(l,t)||solid(r,t)||solid(l,b)||solid(r,b)}
function breakBlock(){let n=performance.now();if(n-last<180)return;last=n;let dir=p.vx<0?-1:1,x=Math.floor((p.x+(dir>0?p.width+8:-8))/T),y=Math.floor((p.y+p.height/2)/T);if(x>=0&&x<W&&y>=0&&y<H&&world[y][x]){world[y][x]=null;broken++;document.getElementById("gameBlocks").textContent=broken}}
canvas.addEventListener("pointerdown",e=>{let r=canvas.getBoundingClientRect(),cam=Math.max(0,Math.min(W*T-r.width,p.x-r.width/2)),x=Math.floor((e.clientX-r.left+cam)/T),y=Math.floor((e.clientY-r.top)/T);if(x>=0&&x<W&&y>=0&&y<H&&world[y][x]){world[y][x]=null;broken++;document.getElementById("gameBlocks").textContent=broken}});
function update(){p.vx=keys.left?-4:keys.right?4:0;if(jump&&p.ground){p.vy=-11;p.ground=false}jump=false;p.vy=Math.min(p.vy+.55,14);let nx=p.x+p.vx;if(!collide(nx,p.y))p.x=nx;let ny=p.y+p.vy;if(!collide(p.x,ny)){p.y=ny;p.ground=false}else{if(p.vy>0){p.y=Math.floor((p.y+p.height)/T)*T-p.height;p.ground=true}p.vy=0}p.x=Math.max(0,Math.min(W*T-p.width,p.x));if(keys.break){breakBlock();keys.break=false}}
function draw(){let w=canvas.clientWidth,h=canvas.clientHeight,g=ctx.createLinearGradient(0,0,0,h);g.addColorStop(0,"#70c8ff");g.addColorStop(1,"#d8f4ff");ctx.fillStyle=g;ctx.fillRect(0,0,w,h);let cam=Math.max(0,Math.min(W*T-w,p.x-w/2));
for(let y=0;y<H;y++)for(let x=0;x<W;x++){let type=world[y][x];if(!type)continue;let sx=x*T-cam,sy=y*T;if(type==="grass"){ctx.fillStyle="#704525";ctx.fillRect(sx,sy,T,T);ctx.fillStyle="#45a049";ctx.fillRect(sx,sy,T,8)}else if(type==="dirt"){ctx.fillStyle="#704525";ctx.fillRect(sx,sy,T,T)}else if(type==="wood"){ctx.fillStyle="#8b5a2b";ctx.fillRect(sx,sy,T,T)}else{ctx.fillStyle="#278b3d";ctx.fillRect(sx,sy,T,T)}}
ctx.fillStyle="#35a853";ctx.fillRect(p.x-cam,p.y,p.width,p.height);ctx.fillStyle="#f2c29b";ctx.fillRect(p.x-cam+4,p.y+4,20,18);ctx.fillStyle="#111";ctx.fillRect(p.x-cam+8,p.y+10,4,4);ctx.fillRect(p.x-cam+17,p.y+10,4,4)}
function loop(){update();draw();requestAnimationFrame(loop)}loop();
});