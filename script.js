/* =========================================================
   BEDROCKPACKS - COMPLETE SCRIPT.JS
   CAPTCHA
   LOGIN
   SEARCH
   DOWNLOADS
   FEEDBACK
   GAME
   MOBILE CONTROLS
   ========================================================= */

document.addEventListener("DOMContentLoaded", function () {

    /* =====================================================
       CAPTCHA
       ===================================================== */

    const captchaScreen =
        document.getElementById("captchaScreen");

    const captchaBlocks =
        document.querySelectorAll(".captcha-block");

    const captchaMessage =
        document.getElementById("captchaMessage");

    let correctBlock = 0;


    function createCaptcha() {

        if (captchaBlocks.length === 0) {
            console.error("CAPTCHA blocks not found.");
            return;
        }

        correctBlock =
            Math.floor(
                Math.random() * captchaBlocks.length
            );

        captchaBlocks.forEach(function (block) {

            block.classList.remove("correct");

        });

        captchaBlocks[correctBlock]
            .classList.add("correct");

        if (captchaMessage) {

            captchaMessage.textContent =
                "Click the green block";

            captchaMessage.style.color =
                "#aeb5c2";
        }
    }


    captchaBlocks.forEach(function (block, index) {

        block.addEventListener("click", function () {

            if (index === correctBlock) {

                captchaMessage.textContent =
                    "✓ Verification successful!";

                captchaMessage.style.color =
                    "#57d163";


                setTimeout(function () {

                    captchaScreen.style.display =
                        "none";


                    const loginScreen =
                        document.getElementById(
                            "loginScreen"
                        );


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


                setTimeout(function () {

                    createCaptcha();

                }, 600);

            }

        });

    });


    createCaptcha();


    /* =====================================================
       LOGIN
       ===================================================== */

    const loginScreen =
        document.getElementById("loginScreen");

    const usernameInput =
        document.getElementById("username");

    const passwordInput =
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
            localStorage.getItem(
                "bedrockAccounts"
            ) || "{}"
        );

    } catch (error) {

        accounts = {};

    }


    function showLoginMessage(
        message,
        success
    ) {

        if (!loginMessage) {
            return;
        }

        loginMessage.textContent =
            message;


        if (success) {

            loginMessage.style.color =
                "#57d163";

        } else {

            loginMessage.style.color =
                "#ff5555";
        }

    }


    function createAccount(event) {

        if (event) {
            event.preventDefault();
        }


        const username =
            usernameInput.value.trim();

        const password =
            passwordInput.value;


        if (
            username === "" ||
            password === ""
        ) {

            showLoginMessage(
                "Please enter a username and password."
            );

            return;
        }


        if (username.length < 3) {

            showLoginMessage(
                "Username must be at least 3 characters."
            );

            return;
        }


        if (password.length < 4) {

            showLoginMessage(
                "Password must be at least 4 characters."
            );

            return;
        }


        if (accounts[username]) {

            showLoginMessage(
                "That username already exists."
            );

            return;
        }


        accounts[username] = {
            password: password
        };


        localStorage.setItem(
            "bedrockAccounts",
            JSON.stringify(accounts)
        );


        localStorage.setItem(
            "bedrockUser",
            username
        );


        showLoginMessage(
            "✓ Account created successfully!",
            true
        );


        setTimeout(function () {

            loginScreen.style.display =
                "none";

        }, 700);

    }


    function login(event) {

        if (event) {
            event.preventDefault();
        }


        const username =
            usernameInput.value.trim();

        const password =
            passwordInput.value;


        if (
            username === "" ||
            password === ""
        ) {

            showLoginMessage(
                "Please enter a username and password."
            );

            return;
        }


        if (
            accounts[username] &&
            accounts[username].password === password
        ) {

            localStorage.setItem(
                "bedrockUser",
                username
            );


            showLoginMessage(
                "✓ Login successful! Welcome " +
                username +
                "!",
                true
            );


            setTimeout(function () {

                loginScreen.style.display =
                    "none";

            }, 700);


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


    if (passwordInput) {

        passwordInput.addEventListener(
            "keydown",
            function (event) {

                if (event.key === "Enter") {

                    login(event);

                }

            }
        );

    }


    /* =====================================================
       KEEP USER LOGGED IN
       ===================================================== */

    const savedUser =
        localStorage.getItem(
            "bedrockUser"
        );


    if (savedUser) {

        if (captchaScreen) {

            captchaScreen.style.display =
                "none";

        }


        if (loginScreen) {

            loginScreen.style.display =
                "none";

        }

    }


    /* =====================================================
       SEARCH
       ===================================================== */

    const searchInput =
        document.getElementById("search");


    function searchItems() {

        if (!searchInput) {
            return;
        }


        const searchText =
            searchInput.value
                .trim()
                .toLowerCase();


        const cards =
            document.querySelectorAll(".card");


        cards.forEach(function (card) {

            const cardText =
                card.textContent
                    .toLowerCase();


            if (
                cardText.includes(searchText)
            ) {

                card.style.display =
                    "";

            } else {

                card.style.display =
                    "none";

            }

        });

    }


    window.searchItems =
        searchItems;


    if (searchInput) {

        searchInput.addEventListener(
            "input",
            searchItems
        );

    }


    /* =====================================================
       DOWNLOADS
       ===================================================== */

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


    window.download =
        function (packName) {

            let filePath =
                packFiles[packName];


            if (!filePath) {

                filePath =
                    "packs/" +
                    packName;

            }


            const link =
                document.createElement("a");


            link.href =
                filePath;


            link.download =
                filePath
                    .split("/")
                    .pop();


            document.body.appendChild(
                link
            );


            link.click();


            document.body.removeChild(
                link
            );

        };


    /* =====================================================
       GAME
       ===================================================== */

    const canvas =
        document.getElementById(
            "gameCanvas"
        );


    if (!canvas) {
        return;
    }


    const ctx =
        canvas.getContext("2d");


    const TILE_SIZE = 40;

    const WORLD_WIDTH = 120;

    const WORLD_HEIGHT = 20;


    /* =====================================================
       WORLD
       ===================================================== */

    const world = [];


    for (
        let y = 0;
        y < WORLD_HEIGHT;
        y++
    ) {

        world[y] = [];


        for (
            let x = 0;
            x < WORLD_WIDTH;
            x++
        ) {

            if (y === 11) {

                world[y][x] =
                    "grass";

            } else if (y > 11) {

                world[y][x] =
                    "dirt";

            } else {

                world[y][x] =
                    null;

            }

        }

    }


    /* =====================================================
       TREES
       ===================================================== */

    function createTree(x) {

        for (
            let y = 8;
            y <= 10;
            y++
        ) {

            if (
                x >= 0 &&
                x < WORLD_WIDTH
            ) {

                world[y][x] =
                    "wood";

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


    /* =====================================================
       PLAYER
       ===================================================== */

    const player = {

        x: 300,

        y: 100,

        width: 28,

        height: 38,

        velocityX: 0,

        velocityY: 0,

        grounded: false

    };


    /* =====================================================
       CONTROLS
       ===================================================== */

    const keys = {

        left: false,

        right: false,

        jump: false,

        break: false

    };


    let jumpQueued = false;

    let blocksBroken = 0;

    let lastBreakTime = 0;


    function setGameKey(
        key,
        value
    ) {

        keys[key] =
            value;


        if (
            key === "jump" &&
            value === true
        ) {

            jumpQueued =
                true;

        }

    }


    /* =====================================================
       KEYBOARD
       ===================================================== */

    window.addEventListener(
        "keydown",
        function (event) {

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


    window.addEventListener(
        "keyup",
        function (event) {

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


    /* =====================================================
       MOBILE CONTROLS
       ===================================================== */

    const mobileButtons =
        document.querySelectorAll(
            "[data-game-key]"
        );


    mobileButtons.forEach(
        function (button) {

            const key =
                button.dataset.gameKey;


            button.addEventListener(
                "pointerdown",
                function (event) {

                    event.preventDefault();

                    setGameKey(
                        key,
                        true
                    );

                }
            );


            button.addEventListener(
                "pointerup",
                function (event) {

                    event.preventDefault();

                    setGameKey(
                        key,
                        false
                    );

                }
            );


            button.addEventListener(
                "pointercancel",
                function () {

                    setGameKey(
                        key,
                        false
                    );

                }
            );


            button.addEventListener(
                "pointerleave",
                function () {

                    setGameKey(
                        key,
                        false
                    );

                }
            );

        }
    );


    /* =====================================================
       CANVAS SIZE
       ===================================================== */

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
                    Math.floor(
                        width * 0.58
                    )
                )
            );


        canvas.style.height =
            height + "px";


        const dpr =
            Math.min(
                window.devicePixelRatio || 1,
                2
            );


        canvas.width =
            Math.floor(
                width * dpr
            );


        canvas.height =
            Math.floor(
                height * dpr
            );


        ctx.setTransform(
            dpr,
            0,
            0,
            dpr,
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
        function () {

            setTimeout(
                resizeCanvas,
                100
            );

        }
    );


    /* =====================================================
       COLLISION
       ===================================================== */

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
                x / TILE_SIZE
            );


        const right =
            Math.floor(
                (
                    x +
                    player.width -
                    1
                ) /
                TILE_SIZE
            );


        const top =
            Math.floor(
                y / TILE_SIZE
            );


        const bottom =
            Math.floor(
                (
                    y +
                    player.height -
                    1
                ) /
                TILE_SIZE
            );


        return (

            isSolid(left, top) ||

            isSolid(right, top) ||

            isSolid(left, bottom) ||

            isSolid(right, bottom)

        );

    }


    /* =====================================================
       BREAK BLOCK
       ===================================================== */

    function breakBlockInFront() {

        const now =
            performance.now();


        if (
            now - lastBreakTime < 180
        ) {

            return;

        }


        lastBreakTime =
            now;


        const direction =
            player.velocityX < 0
                ? -1
                : 1;


        const tileX =
            Math.floor(
                (
                    player.x +
                    (
                        direction > 0
                            ? player.width + 8
                            : -8
                    )
                ) /
                TILE_SIZE
            );


        const tileY =
            Math.floor(
                (
                    player.y +
                    player.height / 2
                ) /
                TILE_SIZE
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


    /* =====================================================
       TOUCH / MOUSE BLOCK BREAKING
       ===================================================== */

    canvas.addEventListener(
        "pointerdown",
        function (event) {

            event.preventDefault();


            const rect =
                canvas.getBoundingClientRect();


            const mouseX =
                event.clientX -
                rect.left;


            const mouseY =
                event.clientY -
                rect.top;


            const camera =
                Math.max(
                    0,
                    Math.min(
                        WORLD_WIDTH * TILE_SIZE -
                        rect.width,

                        player.x -
                        rect.width / 2
                    )
                );


            const tileX =
                Math.floor(
                    (
                        mouseX +
                        camera
                    ) /
                    TILE_SIZE
                );


            const tileY =
                Math.floor(
                    mouseY /
                    TILE_SIZE
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
    );


    /* =====================================================
       UPDATE GAME
       ===================================================== */

    function updateGame() {

        /* Movement */

        if (keys.left) {

            player.velocityX =
                -4;

        } else if (keys.right) {

            player.velocityX =
                4;

        } else {

            player.velocityX =
                0;

        }


        /* Jump */

        if (
            jumpQueued &&
            player.grounded
        ) {

            player.velocityY =
                -11;

            player.grounded =
                false;

        }


        jumpQueued =
            false;


        /* Gravity */

        player.velocityY +=
            0.55;


        if (
            player.velocityY > 14
        ) {

            player.velocityY =
                14;

        }


        /* Horizontal movement */

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


        /* Vertical movement */

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
                        ) /
                        TILE_SIZE
                    ) *
                    TILE_SIZE -
                    player.height;


                player.grounded =
                    true;

            }


            player.velocityY =
                0;

        }


        /* World boundaries */

        player.x =
            Math.max(
                0,

                Math.min(
                    WORLD_WIDTH *
                    TILE_SIZE -
                    player.width,

                    player.x
                )
            );


        /* Break */

        if (keys.break) {

            breakBlockInFront();

            keys.break =
                false;

        }

    }


    /* =====================================================
       DRAW BLOCK
       ===================================================== */

    function drawBlock(
        type,
        x,
        y,
        camera
    ) {

        const screenX =
            x * TILE_SIZE -
            camera;


        const screenY =
            y * TILE_SIZE;


        if (
            screenX < -TILE_SIZE ||
            screenX >
                canvas.clientWidth
        ) {

            return;

        }


        if (type === "grass") {

            ctx.fillStyle =
                "#704525";

            ctx.fillRect(
                screenX,
                screenY,
                TILE_SIZE,
                TILE_SIZE
            );


            ctx.fillStyle =
                "#45a049";

            ctx.fillRect(
                screenX,
                screenY,
                TILE_SIZE,
                8
            );

        }


        else if (type === "dirt") {

            ctx.fillStyle =
                "#704525";

            ctx.fillRect(
                screenX,
                screenY,
                TILE_SIZE,
                TILE_SIZE
            );

        }


        else if (type === "wood") {

            ctx.fillStyle =
                "#8b5a2b";

            ctx.fillRect(
                screenX,
                screenY,
                TILE_SIZE,
                TILE_SIZE
            );


            ctx.fillStyle =
                "#5c3518";

            ctx.fillRect(
                screenX + 15,
                screenY,
                8,
                TILE_SIZE
            );

        }


        else if (type === "leaves") {

            ctx.fillStyle =
                "#278b3d";

            ctx.fillRect(
                screenX,
                screenY,
                TILE_SIZE,
                TILE_SIZE
            );

        }


        ctx.strokeStyle =
            "rgba(0,0,0,0.12)";


        ctx.strokeRect(
            screenX,
            screenY,
            TILE_SIZE,
            TILE_SIZE
        );

    }


    /* =====================================================
       DRAW GAME
       ===================================================== */

    function drawGame() {

        const width =
            canvas.clientWidth;

        const height =
            canvas.clientHeight;


        /* Sky */

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


        /* Camera */

        const camera =
            Math.max(
                0,

                Math.min(
                    WORLD_WIDTH *
                    TILE_SIZE -
                    width,

                    player.x -
                    width / 2
                )
            );


        /* World */

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


        /* Player */

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


        /* Face */

        ctx.fillStyle =
            "#f2c29b";


        ctx.fillRect(
            playerX + 4,
            player.y + 4,
            20,
            18
        );


        /* Eyes */

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


    /* =====================================================
       GAME LOOP
       ===================================================== */

    function gameLoop() {

        updateGame();

        drawGame();

        requestAnimationFrame(
            gameLoop
        );

    }


    gameLoop();

});
