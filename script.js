document.addEventListener("DOMContentLoaded", () => {
  // ---------- CAPTCHA ----------
  const captchaScreen=document.getElementById("captchaScreen");
  const loginScreen=document.getElementById("loginScreen");
  const blocks=[...document.querySelectorAll(".captcha-block")];
  const captchaMessage=document.getElementById("captchaMessage");
  let correct=0;

  function newCaptcha(){
    correct=Math.floor(Math.random()*blocks.length);
    blocks.forEach((b,i)=>b.classList.toggle("correct",i===correct));
    captchaMessage.textContent="Click the green block";
    captchaMessage.style.color="#aaa";
  }
  newCaptcha();
  blocks.forEach((b,i)=>b.addEventListener("click",e=>{
    e.preventDefault();
    if(i===correct){
      captchaMessage.textContent="✓ Verification successful!";
      captchaMessage.style.color="#57d163";
      setTimeout(()=>{captchaScreen.style.display="none";loginScreen.style.display="flex"},500);
    }else{
      captchaMessage.textContent="✕ Wrong block! Try again.";
      captchaMessage.style.color="#ff5555";
      setTimeout(newCaptcha,250);
    }
  }));

  // ---------- OFFLINE LOGIN ----------
  const username=document.getElementById("username");
  const password=document.getElementById("password");
  const loginButton=document.getElementById("loginButton");
  const createButton=document.getElementById("createButton");
  const loginMessage=document.getElementById("loginMessage");
  let accounts=JSON.parse(localStorage.getItem("bedrockAccounts")||"{}");

  function msg(t,ok=false){loginMessage.textContent=t;loginMessage.style.color=ok?"#57d163":"#ff5555"}

  createButton.addEventListener("click",e=>{
    e.preventDefault();
    const n=username.value.trim(),p=password.value;
    if(!n||!p)return msg("Enter a username and password.");
    if(accounts[n])return msg("Username already exists.");
    accounts[n]={password:p};
    localStorage.setItem("bedrockAccounts",JSON.stringify(accounts));
    localStorage.setItem("bedrockUser",n);
    msg("✓ Account created!",true);
    setTimeout(()=>loginScreen.style.display="none",600);
  });

  loginButton.addEventListener("click",e=>{
    e.preventDefault();
    const n=username.value.trim(),p=password.value;
    if(!n||!p)return msg("Enter a username and password.");
    if(accounts[n]&&accounts[n].password===p){
      localStorage.setItem("bedrockUser",n);
      msg("✓ Welcome, "+n+"!",true);
      setTimeout(()=>loginScreen.style.display="none",600);
    }else msg("Incorrect username or password.");
  });

  password.addEventListener("keydown",e=>{
    if(e.key==="Enter"){e.preventDefault();loginButton.click()}
  });

  // ---------- SEARCH ----------
  const search=document.getElementById("search");
  function searchItems(){
    const q=(search?.value||"").toLowerCase().trim();
    document.querySelectorAll(".card").forEach(c=>{
      c.style.display=c.textContent.toLowerCase().includes(q)?"":"none";
    });
  }
  window.searchItems=searchItems;
  if(search)search.addEventListener("input",searchItems);

  // ---------- DOWNLOAD ----------
  window.download=function(file){
    const a=document.createElement("a");
    a.href="packs/"+encodeURIComponent(file);
    a.download=file;
    document.body.appendChild(a);
    a.click();
    a.remove();
  };

  // ---------- FEEDBACK ----------
  const feedbackForm=document.getElementById("feedbackForm");
  if(feedbackForm){
    feedbackForm.addEventListener("submit",e=>{
      e.preventDefault();
      const result=document.getElementById("feedbackResult");
      result.textContent="✓ Thanks for your feedback!";
      feedbackForm.reset();
    });
  }

  // ---------- SIMPLE GAME ----------
  const canvas=document.getElementById("gameCanvas");
  if(canvas){
    const ctx=canvas.getContext("2d");
    const resize=()=>{canvas.width=canvas.clientWidth*devicePixelRatio;canvas.height=500*devicePixelRatio;ctx.setTransform(devicePixelRatio,0,0,devicePixelRatio,0,0)};
    resize();addEventListener("resize",resize);
    const p={x:120,y:100,vx:0,vy:0,onGround:false};
    const keys={};
    addEventListener("keydown",e=>keys[e.key.toLowerCase()]=true);
    addEventListener("keyup",e=>keys[e.key.toLowerCase()]=false);
    function loop(){
      p.vx=(keys.a||keys.arrowleft)?-4:(keys.d||keys.arrowright)?4:0;
      if((keys.w||keys[" "]||keys.arrowup)&&p.onGround){p.vy=-11;p.onGround=false}
      p.vy+=.55;p.x+=p.vx;p.y+=p.vy;
      if(p.y>420){p.y=420;p.vy=0;p.onGround=true}
      ctx.clearRect(0,0,canvas.clientWidth,500);
      ctx.fillStyle="#70c8ff";ctx.fillRect(0,0,canvas.clientWidth,500);
      ctx.fillStyle="#45a049";ctx.fillRect(0,460,canvas.clientWidth,40);
      ctx.fillStyle="#704525";for(let x=0;x<canvas.clientWidth;x+=40)ctx.fillRect(x,470,40,30);
      ctx.fillStyle="#35a853";ctx.fillRect(p.x,p.y,28,40);
      ctx.fillStyle="#f2c29b";ctx.fillRect(p.x+4,p.y+4,20,18);
      requestAnimationFrame(loop);
    }
    loop();
  }
});
