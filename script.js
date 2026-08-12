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

// ===============================
// BEDROCKPACKS BLOCK WORLD
// ===============================

const canvas = document.getElementById("gameCanvas");

if (canvas) {
    const ctx = canvas.getContext("2d");

    const TILE = 40;
    const WORLD_WIDTH = 100;
    const WORLD_HEIGHT = 15;

    let health = 100;
    let blocksBroken = 0;

    const keys = {
        left: false,
        right: false,
        jump: false
    };

    const player = {
        x: 200,
        y: 100,
        width: 28,
        height: 38,
        vx: 0,
        vy: 0,
        grounded: false
    };

    // Create world
    const world = [];

    for (let y = 0; y < WORLD_HEIGHT; y++) {
        world[y] = [];

        for (let x = 0; x < WORLD_WIDTH; x++) {

            if (y === 9) {
                world[y][x] = "grass";
            }
            else if (y > 9) {
                world[y][x] = "dirt";
            }
            else {
                world[y][x] = null;
            }
        }
    }

    // Trees
    function createTree(x) {

        world[8][x] = "wood";
        world[7][x] = "wood";
        world[6][x] = "wood";

        for (let dx = -2; dx <= 2; dx++) {
            for (let dy = -1; dy <= 1; dy++) {

                const tx = x + dx;
                const ty = 6 + dy;

                if (
                    tx >= 0 &&
                    tx < WORLD_WIDTH &&
                    ty >= 0 &&
                    ty < WORLD_HEIGHT
                ) {
                    world[ty][tx] = "leaves";
                }
            }
        }
    }

    createTree(10);
    createTree(25);
    createTree(45);
    createTree(70);

    // Keyboard
    document.addEventListener("keydown", function (event) {

        if (
            event.key === "a" ||
            event.key === "A" ||
            event.key === "ArrowLeft"
        ) {
            keys.left = true;
        }

        if (
            event.key === "d" ||
            event.key === "D" ||
            event.key === "ArrowRight"
        ) {
            keys.right = true;
        }

        if (
            event.key === "w" ||
            event.key === "W" ||
            event.key === "ArrowUp" ||
            event.key === " "
        ) {
            event.preventDefault();
            keys.jump = true;
        }
    });

    document.addEventListener("keyup", function (event) {

        if (
            event.key === "a" ||
            event.key === "A" ||
            event.key === "ArrowLeft"
        ) {
            keys.left = false;
        }

        if (
            event.key === "d" ||
            event.key === "D" ||
            event.key === "ArrowRight"
        ) {
            keys.right = false;
        }

        if (
            event.key === "w" ||
            event.key === "W" ||
            event.key === "ArrowUp" ||
            event.key === " "
        ) {
            keys.jump = false;
        }
    });

    // Canvas size
    function resizeGame() {

        const rect = canvas.getBoundingClientRect();

        canvas.width = rect.width;
        canvas.height = rect.height;

    }

    resizeGame();

    window.addEventListener("resize", resizeGame);

    // Collision
    function isSolid(x, y) {

        if (
            x < 0 ||
            x >= WORLD_WIDTH ||
            y < 0 ||
            y >= WORLD_HEIGHT
        ) {
            return true;
        }

        return world[y][x] !== null;
    }

    function playerCollision(x, y) {

        const left = Math.floor(x / TILE);
        const right =
            Math.floor((x + player.width - 1) / TILE);

        const top = Math.floor(y / TILE);
        const bottom =
            Math.floor((y + player.height - 1) / TILE);

        return (
            isSolid(left, top) ||
            isSolid(right, top) ||
            isSolid(left, bottom) ||
            isSolid(right, bottom)
        );
    }

    // Break block
    canvas.addEventListener("click", function (event) {

        const rect = canvas.getBoundingClientRect();

        const mouseX =
            event.clientX - rect.left;

        const mouseY =
            event.clientY - rect.top;

        const cameraX =
            Math.max(
                0,
                Math.min(
                    WORLD_WIDTH * TILE - canvas.width,
                    player.x - canvas.width / 2
                )
            );

        const blockX =
            Math.floor((mouseX + cameraX) / TILE);

        const blockY =
            Math.floor(mouseY / TILE);

        if (
            blockX >= 0 &&
            blockX < WORLD_WIDTH &&
            blockY >= 0 &&
            blockY < WORLD_HEIGHT &&
            world[blockY][blockX] !== null
        ) {

            world[blockY][blockX] = null;

            blocksBroken++;

            const blockCounter =
                document.getElementById("gameBlocks");

            if (blockCounter) {
                blockCounter.textContent =
                    blocksBroken;
            }
        }
    });

    // Update game
    function updateGame() {

        player.vx = 0;

        if (keys.left) {
            player.vx = -4;
        }

        if (keys.right) {
            player.vx = 4;
        }

        // Jump
        if (
            keys.jump &&
            player.grounded
        ) {

            player.vy = -11;
            player.grounded = false;
        }

        // Gravity
        player.vy += 0.55;

        if (player.vy > 14) {
            player.vy = 14;
        }

        // Horizontal movement
        const newX =
            player.x + player.vx;

        if (
            !playerCollision(
                newX,
                player.y
            )
        ) {
            player.x = newX;
        }

        // Vertical movement
        const newY =
            player.y + player.vy;

        if (
            !playerCollision(
                player.x,
                newY
            )
        ) {

            player.y = newY;
            player.grounded = false;

        }
        else {

            if (player.vy > 0) {

                player.y =
                    Math.floor(
                        (player.y + player.height) /
                        TILE
                    ) * TILE -
                    player.height;

                player.grounded = true;
            }

            player.vy = 0;
        }

        // World boundaries
        player.x = Math.max(
            0,
            Math.min(
                WORLD_WIDTH * TILE -
                player.width,
                player.x
            )
        );

        // Falling
        if (player.y > WORLD_HEIGHT * TILE) {

            health -= 10;

            const healthText =
                document.getElementById("gameHealth");

            if (healthText) {
                healthText.textContent = health;
            }

            player.x = 200;
            player.y = 100;
            player.vy = 0;

            if (health <= 0) {

                health = 100;

                if (healthText) {
                    healthText.textContent =
                        health;
                }
            }
        }
    }

    // Draw game
    function drawGame() {

        const width = canvas.width;
        const height = canvas.height;

        // Sky
        const sky =
            ctx.createLinearGradient(
                0,
                0,
                0,
                height
            );

        sky.addColorStop(0, "#70c8ff");
        sky.addColorStop(1, "#d8f4ff");

        ctx.fillStyle = sky;
        ctx.fillRect(
            0,
            0,
            width,
            height
        );

        // Camera
        const cameraX =
            Math.max(
                0,
                Math.min(
                    WORLD_WIDTH * TILE -
                    width,
                    player.x -
                    width / 2
                )
            );

        // Blocks
        for (let y = 0; y < WORLD_HEIGHT; y++) {

            for (let x = 0; x < WORLD_WIDTH; x++) {

                const block =
                    world[y][x];

                if (!block) {
                    continue;
                }

                const screenX =
                    x * TILE - cameraX;

                const screenY =
                    y * TILE;

                if (block === "grass") {

                    ctx.fillStyle =
                        "#704525";

                    ctx.fillRect(
                        screenX,
                        screenY,
                        TILE,
                        TILE
                    );

                    ctx.fillStyle =
                        "#45a049";

                    ctx.fillRect(
                        screenX,
                        screenY,
                        TILE,
                        8
                    );
                }

                if (block === "dirt") {

                    ctx.fillStyle =
                        "#704525";

                    ctx.fillRect(
                        screenX,
                        screenY,
                        TILE,
                        TILE
                    );
                }

                if (block === "wood") {

                    ctx.fillStyle =
                        "#8b5a2b";

                    ctx.fillRect(
                        screenX,
                        screenY,
                        TILE,
                        TILE
                    );
                }

                if (block === "leaves") {

                    ctx.fillStyle =
                        "#278b3d";

                    ctx.fillRect(
                        screenX,
                        screenY,
                        TILE,
                        TILE
                    );
                }

                ctx.strokeStyle =
                    "rgba(0,0,0,0.15)";

                ctx.strokeRect(
                    screenX,
                    screenY,
                    TILE,
                    TILE
                );
            }
        }

        // Player
        const playerX =
            player.x - cameraX;

        ctx.fillStyle =
            "#35a853";

        ctx.fillRect(
            playerX,
            player.y,
            player.width,
            player.height
        );

        // Head
        ctx.fillStyle =
            "#f2c29b";

        ctx.fillRect(
            playerX + 4,
            player.y + 4,
            20,
            18
        );

        // Eyes
        ctx.fillStyle =
            "#111";

        ctx.fillRect(
            playerX + 8,
            player.y + 10,
            4,
            4
        );

        ctx.fillRect(
            playerX + 17,
            player.y + 10,
            4,
            4
        );
    }

    // Game loop
    function gameLoop() {

        updateGame();

        drawGame();

        requestAnimationFrame(
            gameLoop
        );
    }

    gameLoop();
}
