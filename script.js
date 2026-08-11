document.addEventListener("DOMContentLoaded", () => {
  // ---------- Search ----------
  window.searchItems = function(){
    const q = (document.getElementById("search")?.value || "").trim().toLowerCase();
    document.querySelectorAll(".card").forEach(card => {
      card.style.display = card.textContent.toLowerCase().includes(q) ? "" : "none";
    });
  };
  document.getElementById("search")?.addEventListener("input", window.searchItems);

  // ---------- Downloads ----------
  window.download = function(file){
    const a = document.createElement("a");
    a.href = file.startsWith("packs/") ? file : "packs/" + file;
    a.download = a.href.split("/").pop();
    document.body.appendChild(a);
    a.click();
    a.remove();
  };

  // ---------- Feedback ----------
  // The feedback form is submitted normally to FormSubmit so the browser does not
  // intercept it. The recipient is configured in index.html.

  // ---------- Responsive Block Game ----------
  const canvas = document.getElementById("gameCanvas");
  if (!canvas) return;

  const ctx = canvas.getContext("2d");
  const TILE = 40;
  const WORLD_W = 120;
  const WORLD_H = 20;
  const world = Array.from({length:WORLD_H}, (_,y) =>
    Array.from({length:WORLD_W}, () => y >= 11 ? (y === 11 ? "grass" : "dirt") : null)
  );

  function addTree(x){
    for(let y=8;y<=10;y++) world[y][x]="wood";
    for(let dx=-2;dx<=2;dx++) for(let dy=-2;dy<=0;dy++){
      const xx=x+dx, yy=8+dy;
      if(xx>=0 && xx<WORLD_W && yy>=0) world[yy][xx]="leaves";
    }
  }
  [10,25,45,70,95].forEach(addTree);

  const p={x:300,y:100,w:28,h:38,vx:0,vy:0,grounded:false};
  const keys={left:false,right:false,jump:false,break:false};
  let jumpQueued=false, blocks=0, lastBreak=0;

  function resize(){
    const rect=canvas.getBoundingClientRect();
    const w=Math.max(320,Math.floor(rect.width));
    const h=Math.max(300,Math.min(500,Math.floor(w*.58)));
    canvas.style.height=h+"px";
    const dpr=Math.min(window.devicePixelRatio||1,2);
    canvas.width=Math.floor(w*dpr);
    canvas.height=Math.floor(h*dpr);
    ctx.setTransform(dpr,0,0,dpr,0,0);
  }
  resize();
  addEventListener("resize",resize);
  addEventListener("orientationchange",()=>setTimeout(resize,100));

  function setKey(k,v){
    keys[k]=v;
    if(k==="jump" && v) jumpQueued=true;
  }
  addEventListener("keydown",e=>{
    const k=e.key.toLowerCase();
    if(k==="a"||k==="arrowleft") setKey("left",true);
    if(k==="d"||k==="arrowright") setKey("right",true);
    if(k==="w"||k==="arrowup"||k===" ") {e.preventDefault();setKey("jump",true);}
    if(k==="e") setKey("break",true);
  });
  addEventListener("keyup",e=>{
    const k=e.key.toLowerCase();
    if(k==="a"||k==="arrowleft") setKey("left",false);
    if(k==="d"||k==="arrowright") setKey("right",false);
    if(k==="w"||k==="arrowup"||k===" ") setKey("jump",false);
    if(k==="e") setKey("break",false);
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

  function solid(tx,ty){
    if(tx<0||tx>=WORLD_W||ty<0||ty>=WORLD_H) return true;
    return !!world[ty][tx];
  }
  function collide(x,y){
    const l=Math.floor(x/TILE), r=Math.floor((x+p.w-1)/TILE);
    const t=Math.floor(y/TILE), b=Math.floor((y+p.h-1)/TILE);
    return solid(l,t)||solid(r,t)||solid(l,b)||solid(r,b);
  }

  function breakAt(screenX,screenY){
    const rect=canvas.getBoundingClientRect();
    const cam=Math.max(0,Math.min(WORLD_W*TILE-rect.width,p.x-rect.width/2));
    const tx=Math.floor((screenX+cam)/TILE), ty=Math.floor(screenY/TILE);
    if(tx>=0&&tx<WORLD_W&&ty>=0&&ty<WORLD_H&&world[ty][tx]){
      world[ty][tx]=null; blocks++;
      const el=document.getElementById("gameBlocks");
      if(el) el.textContent=blocks;
      return true;
    }
    return false;
  }

  canvas.addEventListener("pointerdown",e=>{
    const r=canvas.getBoundingClientRect();
    breakAt(e.clientX-r.left,e.clientY-r.top);
  });

  function breakFront(){
    const now=performance.now();
    if(now-lastBreak<180) return;
    lastBreak=now;
    const tx=Math.floor((p.x+(p.vx>=0?p.w+8:-8))/TILE);
    const ty=Math.floor((p.y+p.h/2)/TILE);
    if(tx>=0&&tx<WORLD_W&&ty>=0&&ty<WORLD_H&&world[ty][tx]){
      world[ty][tx]=null; blocks++;
      const el=document.getElementById("gameBlocks");
      if(el) el.textContent=blocks;
    }
  }

  function update(){
    p.vx=keys.left?-4:keys.right?4:0;
    if(jumpQueued&&p.grounded){p.vy=-11;p.grounded=false;}
    jumpQueued=false;
    p.vy=Math.min(p.vy+.55,14);

    const nx=p.x+p.vx;
    if(!collide(nx,p.y))p.x=nx;

    const ny=p.y+p.vy;
    if(!collide(p.x,ny)){p.y=ny;p.grounded=false;}
    else{
      if(p.vy>0){p.y=Math.floor((p.y+p.h)/TILE)*TILE-p.h;p.grounded=true;}
      p.vy=0;
    }
    p.x=Math.max(0,Math.min(WORLD_W*TILE-p.w,p.x));
    if(keys.break){breakFront();keys.break=false;}
  }

  function draw(){
    const w=canvas.clientWidth,h=canvas.clientHeight;
    const g=ctx.createLinearGradient(0,0,0,h);
    g.addColorStop(0,"#70c8ff");g.addColorStop(1,"#d8f4ff");
    ctx.fillStyle=g;ctx.fillRect(0,0,w,h);
    const cam=Math.max(0,Math.min(WORLD_W*TILE-w,p.x-w/2));

    for(let y=0;y<WORLD_H;y++) for(let x=0;x<WORLD_W;x++){
      const type=world[y][x]; if(!type)continue;
      const px=x*TILE-cam,py=y*TILE;
      if(px<-TILE||px>w)continue;
      ctx.fillStyle=type==="grass"||type==="dirt"?"#704525":
                    type==="wood"?"#8b5a2b":"#278b3d";
      ctx.fillRect(px,py,TILE,TILE);
      if(type==="grass"){ctx.fillStyle="#45a049";ctx.fillRect(px,py,TILE,8);}
      ctx.strokeStyle="rgba(0,0,0,.12)";ctx.strokeRect(px,py,TILE,TILE);
    }

    const px=p.x-cam;
    ctx.fillStyle="#35a853";ctx.fillRect(px,p.y,p.w,p.h);
    ctx.fillStyle="#f2c29b";ctx.fillRect(px+4,p.y+4,20,18);
    ctx.fillStyle="#111";ctx.fillRect(px+8,p.y+10,4,4);ctx.fillRect(px+17,p.y+10,4,4);
  }

  function loop(){update();draw();requestAnimationFrame(loop);}
  loop();
});
