/* =========================================================
   BEDROCKPACKS - COMPLETE SCRIPT.JS
   CAPTCHA + LOGIN + SEARCH + DOWNLOADS + FEEDBACK + GAME
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {

/* ================= CAPTCHA ================= */

const captchaScreen =
    document.getElementById("captchaScreen");

const captchaBlocks =
    document.querySelectorAll(".captcha-block");

const captchaMessage =
    document.getElementById("captchaMessage");

let correctBlock = 0;


function createCaptcha() {

    if (captchaBlocks.length === 0) {
        console.error("CAPTCHA blocks were not found.");
        return;
    }

    correctBlock =
        Math.floor(
            Math.random() * captchaBlocks.length
        );

    captchaBlocks.forEach((block, index) => {

        block.classList.remove("correct");

        if (index === correctBlock) {
            block.classList.add("correct");
        }

    });

    if (captchaMessage) {
        captchaMessage.textContent =
            "Click the green block";

        captchaMessage.style.color =
            "#aaa";
    }
}


captchaBlocks.forEach((block, index) => {

    block.addEventListener("click", function () {

        if (index === correctBlock) {

            captchaMessage.textContent =
                "✓ Correct!";

            captchaMessage.style.color =
                "#57d163";

            setTimeout(() => {

                captchaScreen.style.display =
                    "none";

                const loginScreen =
                    document.getElementById("loginScreen");

                if (loginScreen) {
                    loginScreen.style.display =
                        "flex";
                }

            }, 500);

        } else {

            captchaMessage.textContent =
                "✕ Wrong block! Try again.";

            captchaMessage.style.color =
                "#ff5555";

            setTimeout(() => {
                createCaptcha();
            }, 600);
        }

    });

});


createCaptcha();
  /* =======================================================
     LOGIN / ACCOUNT SYSTEM
     ======================================================= */

  const username =
    document.getElementById("username");

  const password =
    document.getElementById("password");

  const loginButton =
    document.getElementById("loginButton");

  const createButton =
    document.getElementById("createButton");

  const loginMessage =
    document.getElementById("loginMessage");

  let accounts = {};

  try {

    accounts = JSON.parse(
      localStorage.getItem("bedrockAccounts") || "{}"
    );

  } catch (error) {

    accounts = {};

  }


  function showLoginMessage(message, success = false) {

    if (!loginMessage) {
      return;
    }

    loginMessage.textContent = message;

    loginMessage.style.color =
      success ? "#57d163" : "#ff5555";
  }


  function createAccount(event) {

    if (event) {
      event.preventDefault();
    }

    const name =
      username ? username.value.trim() : "";

    const pass =
      password ? password.value : "";


    if (!name || !pass) {

      showLoginMessage(
        "Enter a username and password."
      );

      return;
    }


    if (accounts[name]) {

      showLoginMessage(
        "Username already exists."
      );

      return;
    }


    accounts[name] = {
      password: pass
    };


    localStorage.setItem(
      "bedrockAccounts",
      JSON.stringify(accounts)
    );


    localStorage.setItem(
      "bedrockUser",
      name
    );


    showLoginMessage(
      "✓ Account created!",
      true
    );


    setTimeout(() => {

      if (loginScreen) {
        loginScreen.style.display = "none";
      }

    }, 500);

  }


  function login(event) {

    if (event) {
      event.preventDefault();
    }

    const name =
      username ? username.value.trim() : "";

    const pass =
      password ? password.value : "";


    if (!name || !pass) {

      showLoginMessage(
        "Enter a username and password."
      );

      return;
    }


    if (
      accounts[name] &&
      accounts[name].password === pass
    ) {

      localStorage.setItem(
        "bedrockUser",
        name
      );


      showLoginMessage(
        "✓ Welcome, " + name + "!",
        true
      );


      setTimeout(() => {

        if (loginScreen) {
          loginScreen.style.display = "none";
        }

      }, 500);


    } else {

      showLoginMessage(
        "Incorrect username or password."
      );

    }

  }


  if (loginButton) {

    loginButton.addEventListener(
      "click",
      login
    );

  }


  if (createButton) {

    createButton.addEventListener(
      "click",
      createAccount
    );

  }


  if (password) {

    password.addEventListener(
      "keydown",
      event => {

        if (event.key === "Enter") {

          login(event);

        }

      }
    );

  }


  /*
     If the user already logged in before,
     don't show CAPTCHA/login again.
  */

  if (
    localStorage.getItem("bedrockUser")
  ) {

    if (captchaScreen) {
      captchaScreen.style.display = "none";
    }

    if (loginScreen) {
      loginScreen.style.display = "none";
    }

  }


  /* =======================================================
     SEARCH
     ======================================================= */

  window.searchItems = function () {

    const searchBox =
      document.getElementById("search");

    if (!searchBox) {
      return;
    }


    const query =
      searchBox.value
        .trim()
        .toLowerCase();


    const cards =
      document.querySelectorAll(".card");


    cards.forEach(card => {

      const text =
        card.textContent.toLowerCase();


      if (text.includes(query)) {

        card.style.display = "";

      } else {

        card.style.display = "none";

      }

    });

  };


  const search =
    document.getElementById("search");


  if (search) {

    search.addEventListener(
      "input",
      window.searchItems
    );

  }


  /* =======================================================
     DOWNLOAD SYSTEM
     ======================================================= */

  /*
     IMPORTANT:

     Your GitHub repository should look like:

     packs/
       fantasy-addon.mcpack
       rtx-pack.mcpack
       skyblock.mcpack
  */


  const packFiles = {

    "Fantasy Add-on":
      "packs/fantasy-addon.mcpack",

    "RTX Pack":
      "packs/rtx-pack.mcpack",

    "SkyBlock":
      "packs/skyblock.mcpack",

    "Fantasy Pack":
      "packs/fantasy-addon.mcpack"

  };


  window.download = function (file) {

    let path = file;


    /*
       If the filename isn't already a path,
       put it inside the packs folder.
    */

    if (!path.includes("/")) {

      if (packFiles[file]) {

        path = packFiles[file];

      } else {

        path = "packs/" + file;

      }

    }


    const link =
      document.createElement("a");


    link.href = path;

    link.download =
      path.split("/").pop();


    document.body.appendChild(link);

    link.click();

    document.body.removeChild(link);

  };


  /* =======================================================
     FEEDBACK
     ======================================================= */

  /*
     The feedback form should contain:

     action="https://formsubmit.co/zain.gshare@gmail.com"
     method="POST"

     This allows GitHub Pages to send the form
     through FormSubmit.

     JavaScript does NOT prevent the form from
     submitting, so the email service can receive it.
  */


  const feedbackForm =
    document.getElementById("feedbackForm");


  if (feedbackForm) {

    feedbackForm.addEventListener(
      "submit",
      event => {

        /*
           Let the browser submit the form normally.

           DO NOT use:
           event.preventDefault();

           because that would stop the email.
        */

      }
    );

  }


  /* =======================================================
     GAME
     ======================================================= */

  const canvas =
    document.getElementById("gameCanvas");


  /*
     If there isn't a game canvas,
     stop the game code.
  */

  if (!canvas) {
    return;
  }


  const ctx =
    canvas.getContext("2d");


  const TILE = 40;

  const WORLD_WIDTH = 120;

  const WORLD_HEIGHT = 20;


  /* =======================================================
     WORLD
     ======================================================= */

  const world =
    Array.from(
      { length: WORLD_HEIGHT },
      (_, y) =>

        Array.from(
          { length: WORLD_WIDTH },
          () => {

            if (y >= 11) {

              if (y === 11) {
                return "grass";
              }

              return "dirt";

            }

            return null;

          }
        )

    );


  /* =======================================================
     TREES
     ======================================================= */

  function createTree(x) {

    for (let y = 8; y <= 10; y++) {

      if (
        x >= 0 &&
        x < WORLD_WIDTH
      ) {

        world[y][x] = "wood";

      }

    }


    for (
      let dx = -2;
      dx <= 2;
      dx++
    ) {

      for (
        let dy = -2;
        dy <= 0;
        dy++
      ) {

        const treeX =
          x + dx;

        const treeY =
          8 + dy;


        if (
          treeX >= 0 &&
          treeX < WORLD_WIDTH &&
          treeY >= 0 &&
          treeY < WORLD_HEIGHT
        ) {

          world[treeY][treeX] =
            "leaves";

        }

      }

    }

  }


  [
    10,
    25,
    45,
    70,
    95
  ].forEach(createTree);


  /* =======================================================
     PLAYER
     ======================================================= */

  const player = {

    x: 300,

    y: 100,

    width: 28,

    height: 38,

    velocityX: 0,

    velocityY: 0,

    grounded: false

  };


  /* =======================================================
     CONTROLS
     ======================================================= */

  const keys = {

    left: false,

    right: false,

    jump: false,

    break: false

  };


  let jumpQueued = false;

  let blocksBroken = 0;

  let lastBreakTime = 0;


  function setGameKey(key, value) {

    keys[key] = value;


    if (
      key === "jump" &&
      value === true
    ) {

      jumpQueued = true;

    }

  }


  /* =======================================================
     PC KEYBOARD
     ======================================================= */

  window.addEventListener(
    "keydown",
    event => {

      const key =
        event.key.toLowerCase();


      if (
        key === "a" ||
        key === "arrowleft"
      ) {

        setGameKey(
          "left",
          true
        );

      }


      if (
        key === "d" ||
        key === "arrowright"
      ) {

        setGameKey(
          "right",
          true
        );

      }


      if (
        key === "w" ||
        key === "arrowup" ||
        key === " "
      ) {

        event.preventDefault();

        setGameKey(
          "jump",
          true
        );

      }


      if (key === "e") {

        setGameKey(
          "break",
          true
        );

      }

    }
  );


  /* =======================================================
     PC KEYBOARD RELEASE
     ======================================================= */

  window.addEventListener(
    "keyup",
    event => {

      const key =
        event.key.toLowerCase();


      if (
        key === "a" ||
        key === "arrowleft"
      ) {

        setGameKey(
          "left",
          false
        );

      }


      if (
        key === "d" ||
        key === "arrowright"
      ) {

        setGameKey(
          "right",
          false
        );

      }


      if (
        key === "w" ||
        key === "arrowup" ||
        key === " "
      ) {

        setGameKey(
          "jump",
          false
        );

      }


      if (key === "e") {

        setGameKey(
          "break",
          false
        );

      }

    }
  );


  /* =======================================================
     MOBILE BUTTONS
     ======================================================= */

  const mobileButtons =
    document.querySelectorAll(
      "[data-game-key]"
    );


  mobileButtons.forEach(button => {

    const key =
      button.dataset.gameKey;


    function press(event) {

      event.preventDefault();

      setGameKey(
        key,
        true
      );

    }


    function release(event) {

      event.preventDefault();

      setGameKey(
        key,
        false
      );

    }


    button.addEventListener(
      "pointerdown",
      press
    );


    button.addEventListener(
      "pointerup",
      release
    );


    button.addEventListener(
      "pointercancel",
      release
    );


    button.addEventListener(
      "pointerleave",
      release
    );

  });


  /* =======================================================
     CANVAS RESIZE
     ======================================================= */

  function resizeCanvas() {

    const rect =
      canvas.getBoundingClientRect();


    const width =
      Math.max(
        320,
        Math.floor(rect.width)
      );


    const height =
      Math.max(
        300,
        Math.min(
          500,
          Math.floor(width * 0.58)
        )
      );


    canvas.style.height =
      height + "px";


    const devicePixelRatio =
      Math.min(
        window.devicePixelRatio || 1,
        2
      );


    canvas.width =
      Math.floor(
        width * devicePixelRatio
      );


    canvas.height =
      Math.floor(
        height * devicePixelRatio
      );


    ctx.setTransform(
      devicePixelRatio,
      0,
      0,
      devicePixelRatio,
      0,
      0
    );

  }


  resizeCanvas();


  window.addEventListener(
    "resize",
    resizeCanvas
  );


  window.addEventListener(
    "orientationchange",
    () => {

      setTimeout(
        resizeCanvas,
        100
      );

    }
  );


  /* =======================================================
     BLOCK COLLISION
     ======================================================= */

  function isSolid(
    tileX,
    tileY
  ) {

    if (
      tileX < 0 ||
      tileX >= WORLD_WIDTH ||
      tileY < 0 ||
      tileY >= WORLD_HEIGHT
    ) {

      return true;

    }


    return (
      world[tileY][tileX] !== null
    );

  }


  function playerCollides(
    x,
    y
  ) {

    const left =
      Math.floor(
        x / TILE
      );


    const right =
      Math.floor(
        (x + player.width - 1) /
        TILE
      );


    const top =
      Math.floor(
        y / TILE
      );


    const bottom =
      Math.floor(
        (y + player.height - 1) /
        TILE
      );


    return (

      isSolid(left, top) ||

      isSolid(right, top) ||

      isSolid(left, bottom) ||

      isSolid(right, bottom)

    );

  }


  /* =======================================================
     BREAK BLOCK WITH TOUCH / MOUSE
     ======================================================= */

  function breakBlockAt(
    screenX,
    screenY
  ) {

    const rect =
      canvas.getBoundingClientRect();


    const camera =
      Math.max(
        0,
        Math.min(
          WORLD_WIDTH * TILE -
          rect.width,

          player.x -
          rect.width / 2
        )
      );


    const tileX =
      Math.floor(
        (screenX + camera) /
        TILE
      );


    const tileY =
      Math.floor(
        screenY /
        TILE
      );


    if (

      tileX >= 0 &&

      tileX < WORLD_WIDTH &&

      tileY >= 0 &&

      tileY < WORLD_HEIGHT &&

      world[tileY][tileX]

    ) {

      world[tileY][tileX] =
        null;


      blocksBroken++;


      const counter =
        document.getElementById(
          "gameBlocks"
        );


      if (counter) {

        counter.textContent =
          blocksBroken;

      }


      return true;

    }


    return false;

  }


  /* =======================================================
     MOUSE + TOUCH CANVAS
     ======================================================= */

  canvas.addEventListener(
    "pointerdown",
    event => {

      event.preventDefault();


      const rect =
        canvas.getBoundingClientRect();


      const x =
        event.clientX -
        rect.left;


      const y =
        event.clientY -
        rect.top;


      breakBlockAt(
        x,
        y
      );

    }
  );


  /* =======================================================
     BREAK BLOCK IN FRONT OF PLAYER
     ======================================================= */

  function breakBlockInFront() {

    const now =
      performance.now();


    if (
      now - lastBreakTime <
      180
    ) {

      return;

    }


    lastBreakTime =
      now;


    const direction =
      player.velocityX >= 0
        ? 1
        : -1;


    const tileX =
      Math.floor(
        (
          player.x +
          (
            direction > 0
              ? player.width + 8
              : -8
          )
        ) / TILE
      );


    const tileY =
      Math.floor(
        (
          player.y +
          player.height / 2
        ) / TILE
      );


    if (

      tileX >= 0 &&

      tileX < WORLD_WIDTH &&

      tileY >= 0 &&

      tileY < WORLD_HEIGHT &&

      world[tileY][tileX]

    ) {

      world[tileY][tileX] =
        null;


      blocksBroken++;


      const counter =
        document.getElementById(
          "gameBlocks"
        );


      if (counter) {

        counter.textContent =
          blocksBroken;

      }

    }

  }


  /* =======================================================
     GAME UPDATE
     ======================================================= */

  function updateGame() {

    /*
       Movement
    */

    if (keys.left) {

      player.velocityX = -4;

    } else if (keys.right) {

      player.velocityX = 4;

    } else {

      player.velocityX = 0;

    }


    /*
       Jump
    */

    if (
      jumpQueued &&
      player.grounded
    ) {

      player.velocityY =
        -11;


      player.grounded =
        false;

    }


    jumpQueued = false;


    /*
       Gravity
    */

    player.velocityY += 0.55;


    if (
      player.velocityY > 14
    ) {

      player.velocityY =
        14;

    }


    /*
       Horizontal collision
    */

    const newX =
      player.x +
      player.velocityX;


    if (
      !playerCollides(
        newX,
        player.y
      )
    ) {

      player.x =
        newX;

    }


    /*
       Vertical collision
    */

    const newY =
      player.y +
      player.velocityY;


    if (
      !playerCollides(
        player.x,
        newY
      )
    ) {

      player.y =
        newY;


      player.grounded =
        false;

    } else {

      if (
        player.velocityY > 0
      ) {

        player.y =
          Math.floor(
            (
              player.y +
              player.height
            ) / TILE
          ) * TILE -
          player.height;


        player.grounded =
          true;

      }


      player.velocityY =
        0;

    }


    /*
       World boundaries
    */

    player.x =
      Math.max(
        0,

        Math.min(
          WORLD_WIDTH * TILE -
          player.width,

          player.x
        )
      );


    /*
       Break button
    */

    if (keys.break) {

      breakBlockInFront();

      keys.break =
        false;

    }

  }


  /* =======================================================
     DRAW BLOCKS
     ======================================================= */

  function drawBlock(
    type,
    x,
    y,
    camera
  ) {

    const screenX =
      x * TILE -
      camera;


    const screenY =
      y * TILE;


    if (
      screenX < -TILE ||
      screenX > canvas.clientWidth
    ) {

      return;

    }


    if (
      type === "grass"
    ) {

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


    else if (
      type === "dirt"
    ) {

      ctx.fillStyle =
        "#704525";

      ctx.fillRect(
        screenX,
        screenY,
        TILE,
        TILE
      );

    }


    else if (
      type === "wood"
    ) {

      ctx.fillStyle =
        "#8b5a2b";

      ctx.fillRect(
        screenX,
        screenY,
        TILE,
        TILE
      );


      ctx.fillStyle =
        "#5c3518";

      ctx.fillRect(
        screenX + 15,
        screenY,
        8,
        TILE
      );

    }


    else if (
      type === "leaves"
    ) {

      ctx.fillStyle =
        "#278b3d";

      ctx.fillRect(
        screenX,
        screenY,
        TILE,
        TILE
      );

    }


    /*
       Block border
    */

    ctx.strokeStyle =
      "rgba(0,0,0,0.12)";


    ctx.strokeRect(
      screenX,
      screenY,
      TILE,
      TILE
    );

  }


  /* =======================================================
     DRAW GAME
     ======================================================= */

  function drawGame() {

    const width =
      canvas.clientWidth;


    const height =
      canvas.clientHeight;


    /*
       Sky
    */

    const sky =
      ctx.createLinearGradient(
        0,
        0,
        0,
        height
      );


    sky.addColorStop(
      0,
      "#70c8ff"
    );


    sky.addColorStop(
      1,
      "#d8f4ff"
    );


    ctx.fillStyle =
      sky;


    ctx.fillRect(
      0,
      0,
      width,
      height
    );


    /*
       Camera
    */

    const camera =
      Math.max(
        0,

        Math.min(
          WORLD_WIDTH * TILE -
          width,

          player.x -
          width / 2
        )
      );


    /*
       Draw world
    */

    for (
      let y = 0;
      y < WORLD_HEIGHT;
      y++
    ) {

      for (
        let x = 0;
        x < WORLD_WIDTH;
        x++
      ) {

        const block =
          world[y][x];


        if (block) {

          drawBlock(
            block,
            x,
            y,
            camera
          );

        }

      }

    }


    /*
       Player
    */

    const playerX =
      player.x -
      camera;


    ctx.fillStyle =
      "#35a853";


    ctx.fillRect(
      playerX,
      player.y,
      player.width,
      player.height
    );


    /*
       Player face
    */

    ctx.fillStyle =
      "#f2c29b";


    ctx.fillRect(
      playerX + 4,
      player.y + 4,
      20,
      18
    );


    /*
       Eyes
    */

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


  /* =======================================================
     GAME LOOP
     ======================================================= */

  function gameLoop() {

    updateGame();

    drawGame();

    requestAnimationFrame(
      gameLoop
    );

  }


  gameLoop();

});
