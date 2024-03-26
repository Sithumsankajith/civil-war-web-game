const gameArea = document.querySelector(".game-area")
const playBtn = document.querySelector("#playBtn")

// Characters
// cap
const capAmerica = document.querySelector(".cap-america")
const capLegR = document.querySelector(".c-leg-R")
const capLegL = document.querySelector(".c-leg-L")
const capArmR = document.querySelector(".c-arm-R")
const capArmL = document.querySelector(".c-arm-L")

// ironman
const ironman = document.querySelector(".ironman")
const ironLegR = document.querySelector(".i-leg-R")
const ironLegL = document.querySelector(".i-leg-L")
const ironArmR = document.querySelector(".i-arm-R")
const ironArmL = document.querySelector(".i-arm-L")

let ironmanInteral;
let ironmanCanJump = true

// ELEMENTS AXIS
let elementL
let elementR
let elementT

// WEAPONS BARS
let capWeaponBar = document.querySelector("#cap-weapon-bar")
let ironmanWeaponBar = document.querySelector("#ironman-weapon-bar")

// HEALTH BARS
let capHealth = document.querySelector("#cap-health")
let ironmanHealth = document.querySelector("#ironman-health")

// DAMAGE
const projectilesDamage = 20
const punchDamage = 2 // punch damage should alway be smaller than the projectile damage other wise it will cause some issues 

// audios
const gameMusic = new Audio("audio/GameMusic.m4a");
const gameOver = new Audio("audio/GameOver.m4a")
const laserShockAud = new Audio("audio/LaserShock.wav")
const collideAud = new Audio("audio/Collide.m4a")

const capWinsAud = new Audio("audio/CapWins.m4a")
const capPunchAud = new Audio("audio/CapPunch.m4a")
const capShootAud = new Audio("audio/CapShoot.m4a")

const ironmanWinsAud = new Audio("audio/IronmanWins.m4a")
const ironmanTgLockedAud = new Audio("audio/IronmanTgLocked.m4a")
const ironmanShootAud = new Audio("audio/IronmanShoot.m4a")
const ironmanPunchAud = new Audio("audio/ironmanPunch.m4a")
const ironmanWarningAud = new Audio("audio/IronmanWarning.m4a")

// CREATE ANY ELEMENT AXIS
function createElementAxis(character) {
    elementL = parseInt(window.getComputedStyle(character, null).getPropertyValue("left"));
    elementR = parseInt(window.getComputedStyle(character, null).getPropertyValue("right"));
    elementT = parseInt(window.getComputedStyle(character, null).getPropertyValue("top"));
}

let isGameRunning = false
let gameTimeout

// start The Game
function startTheGame() {
    if (gameTimeout) clearTimeout(gameTimeout);

    isGameRunning = true
    gameMusic.loop = true
    gameMusic.play()


    if (isGameRunning === true) {
        window.addEventListener('keydown', handleKeydown, false)
        window.addEventListener('keypress', handleKeypress, false)
        window.addEventListener('keyup', handleKeyup, false)

        addAITOIronman()
    }

    // Filling Progress
    fillProgress("shield", capWeaponBar.value);
    fillProgress("beam", ironmanWeaponBar.value);
    playBtn.classList.add("hide")
}


// Handle Functions For Character
function handleKeydown(e) {
    if (e.key === "a" || e.key === "d") playerMove(capAmerica, capLegR, capLegL, capArmR, "c-leg-R-move", "c-leg-L-move", 'c-arm-R-move', e.key)
}

function handleKeypress(e) {
    if (e.key === "w") playerJump(capAmerica, capLegR, capLegL, capArmR, capArmL, 'cap-america-jump', "c-leg-R-jump", "c-leg-L-jump")
}

function handleKeyup(e) {
    if (e.key === "z") playerPunch(capAmerica, capArmL, null, "c-arm-L-punch", null)
    else if (e.key === "x" && capWeaponBar.value === 100) playerShoot(capAmerica, capArmR, capArmL, 'cap-shoot', 'c-arm-R-shoot', "c-arm-L-shoot")
}

// Ironman Bot AI
let ironmanInterval;

function addAITOIronman() {
    function generateRandomAction() {
        const randomNumber = Math.floor(Math.random() * 6) + 1;

        if (randomNumber === 1 || randomNumber === 2 || randomNumber === 6)
            playerMove(ironman, null, null, null, "i-leg-R-move", null, null, randomNumber);
        else if (randomNumber === 3 && ironmanCanJump === true)
            playerJump(ironman, null, null, null, null, 'ironman-jump', null, null);
        else if (randomNumber === 4)
            playerPunch(ironman, ironArmL, ironArmR, "i-arm-L-punch", 'i-arm-R-punch');
        else if (randomNumber === 5 && ironmanWeaponBar.value === 100)
            playerShoot(ironman, ironArmL, ironArmR, null, 'i-arm-R-shoot', "i-arm-L-shoot");

        // Call generateRandomAction again after 700ms
        ironmanInterval = setTimeout(generateRandomAction, 500);
    }


    // Start generating random actions
    generateRandomAction();
}

function stopAITOIronman() {
    clearTimeout(ironmanInterval);
}

// player move
function playerMove(player, playerRLeg, playerLLeg, playerARight, playerRLegAnimeClass, playerLLegAnimeClass, playerARightAnimeClass, key) {
    createElementAxis(player)

    if (player.className.includes('cap-america')) {
        playerRLeg.classList.add(playerRLegAnimeClass)
        playerLLeg.classList.add(playerLLegAnimeClass)
        playerARight.classList.add(playerARightAnimeClass)

        if (key === 'a') {
            if (elementL - 50 < 5) elementL = 5
            else player.style.left = elementL - 50 + "px";
        }

        else {
            let capL = elementL

            createElementAxis(ironman)
            let ironmanL = elementL

            if ((capL - ironmanL) > -106) capL = elementL - 100;
            player.style.left = capL + 50 + "px";
        }

        addAndRemoveEvent("keydown", handleKeydown, "remove")

        setTimeout(() => resetPlayers(player, playerRLeg, playerLLeg, playerARight, null, null, playerRLegAnimeClass,
            playerLLegAnimeClass, playerARightAnimeClass, null, 'move'), 100);
    }

    // ironman 
    else if (player.className.includes('ironman')) {
        if (key === 1 || key === 6) {
            let ironmanL = elementL

            createElementAxis(capAmerica)
            let capL = elementL

            if ((ironmanL - capL) < 103) ironmanL = elementL + 100
            player.style.left = ironmanL - 50 + "px";
        }

        else {
            if (elementL + 50 > window.innerWidth - 100) player.style.left = elementL + "px";
            else player.style.left = elementL + 50 + "px";
        }
    }
}


// player jump
function playerJump(player, playerRLeg, playerLLeg, playerARight, playerALeft, playerAnimeClass, playerRLegAnimeClass, playerLLegAnimeClass) {
    player.classList.add(playerAnimeClass)

    if (player.className.includes('cap-america')) {
        playerRLeg.classList.add(playerRLegAnimeClass)
        playerLLeg.classList.add(playerLLegAnimeClass)

        addAndRemoveEvent("keypress", handleKeypress, "remove")

        setTimeout(() =>
            resetPlayers(player, playerRLeg, playerLLeg, playerARight, playerALeft, playerAnimeClass, playerRLegAnimeClass,
                playerLLegAnimeClass, null, null, 'jump'), 650);
    }

    else if (player.className.includes('ironman')) {
        ironmanCanJump = false

        setTimeout(() => resetPlayers(player, null, null, null, null, playerAnimeClass, null, null, null, null, 'jump'), 1000);
    }
}

//  player Punch
function playerPunch(player, playerALeft, playerARight, playerALeftAnimeClass, playerARightAnimeClass) {
    playerALeft.classList.add(playerALeftAnimeClass)
    createPlayerPunch(player)

    if (player.className.includes('cap-america')) {
        capPunchAud.play()
        addAndRemoveEvent("keyup", handleKeyup, "remove")

        setTimeout(() => resetPlayers(player, null, null, null, playerALeft, null, null,
            null, null, playerALeftAnimeClass, 'punch'
        ), 100);
    }

    else if (player.className.includes('ironman')) {
        ironmanPunchAud.play()
        playerARight.classList.add(playerARightAnimeClass)

        setTimeout(() => resetPlayers(player, null, null, playerARight, playerALeft, null, null,
            null, playerARightAnimeClass, playerALeftAnimeClass, 'punch'
        ), 400);
    }
}

// Creating Punch Effect
function createPlayerPunch(player) {
    createElementAxis(player)
    let punch = document.createElement("div")
    gameArea.appendChild(punch)

    if (player.className.includes('cap-america')) {
        punch.classList.add("cap-punch")
        punch.style.left = elementL + 40 + "px"
        punch.style.top = elementT + 10 + "px"
        detectCollision(punch, ironman, punchDamage)
    }

    else {
        punch.classList.add("ironman-punch")
        punch.style.left = elementL - 10 + "px"
        punch.style.top = elementT + 25 + "px"
        detectCollision(punch, capAmerica, punchDamage)
    }

    setTimeout(() => gameArea.removeChild(punch), 100);
}


// Player Shoot
function playerShoot(player, playerARight, playerALeft, playerAnimeClass, playerARightAnimeClass, playerALeftAnimeClass) {
    playerARight.classList.add(playerARightAnimeClass)
    playerALeft.classList.add(playerALeftAnimeClass)
    createProjectiles(player)

    if (player.className.includes('cap-america')) {
        capShootAud.play()
        player.classList.add(playerAnimeClass)
        capWeaponBar.value = 0
        fillProgress("shield", capWeaponBar.value);

        addAndRemoveEvent("keyup", handleKeyup, "remove")

        setTimeout(() => resetPlayers(player, null, null, playerARight, playerALeft, playerAnimeClass, null,
            null, playerARightAnimeClass, playerALeftAnimeClass, 'punch'
        ), 300);
    }

    else if (player.className.includes('ironman')) {
        ironmanShootAud.play()
        ironmanWeaponBar.value = 0
        fillProgress("beam", ironmanWeaponBar.value);

        setTimeout(() => resetPlayers(player, null, null, playerARight, playerALeft, null, null,
            null, playerARightAnimeClass, playerALeftAnimeClass, 'punch'
        ), 500);
    }
}


// Creating Projectiles
function createProjectiles(player) {
    createElementAxis(player);

    let projectile = document.createElement("div");
    projectile.className = "c-projectiles flex-center"
    gameArea.appendChild(projectile);

    let direction = player.className.includes('cap-america') ? 1 : -1;
    let startPosition = direction === 1 ? elementL + 40 : elementL - 10;
    let topPosition = direction === 1 ? elementT + 10 : elementT + 10;


    if (player.className.includes('cap-america')) {
        projectile.id = "cap-projectile"
        projectile.innerHTML = `<div class="shield"></div>`
        moveProjectile(projectile, ironman)
    }
    else {
        projectile.id = "ironman-projectile";
        projectile.innerHTML = `<div class="beam"></div>`
        moveProjectile(projectile, capAmerica)
    }

    projectile.style.left = startPosition + "px";
    projectile.style.top = topPosition + "px";

    // Moving Projectiles
    function moveProjectile(projectile, player) {
        startPosition += direction * 15;
        let gameAreaWidth = gameArea.clientWidth || gameArea.offsetWidth;

        if ((direction === 1 && startPosition < gameAreaWidth + 100) || (direction === -1 && startPosition > -100)) {
            projectile.style.left = startPosition + "px";
            requestAnimationFrame(() => moveProjectile(projectile, player));
            detectCollision(projectile, player, projectilesDamage)

            let capProj = document.querySelector("#cap-projectile")
            let ironmanProj = document.querySelector("#ironman-projectile")

            if (capProj && ironmanProj) detectCollision(capProj, ironmanProj, null)
        }
    }
}

// Filling Player Progress
function fillProgress(forProj, value) {
    if (isGameRunning === true) {
        if (forProj === "shield" && value <= 100) {
            capWeaponBar.value = value;
            setTimeout(() => fillProgress(forProj, value + 10), 1000);
        }

        else if (forProj === "beam" && value <= 100) {
            ironmanWeaponBar.value = value;
            if (ironmanWeaponBar.value >= 100) {
                ironmanTgLockedAud.loop = true
                ironmanTgLockedAud.play()
            }

            else stopTargetLocked()

            setTimeout(() => fillProgress(forProj, value + 20), 1000);
        }
    }
}


function stopTargetLocked() {
    ironmanTgLockedAud.currentTime = 0
    ironmanTgLockedAud.pause()
}

// detect collison
function detectCollision(elem1, elem2, damage) {
    const rect1 = elem1.getBoundingClientRect();
    const rect2 = elem2.getBoundingClientRect();

    // Check for collision
    if (rect1.right > rect2.left &&
        rect1.left < rect2.right &&
        rect1.bottom > rect2.top &&
        rect1.top < rect2.bottom) {

        if (elem2.id === "cap-america") collisonImpact(elem2, damage, laserShockAud, elem1, capHealth, "You Lose")
        else if (elem2.id === "ironman") collisonImpact(elem2, damage, collideAud, elem1, ironmanHealth, "You Win")

        else if (damage === null) {
            collideAud.play()
            gameArea.removeChild(elem1);
            gameArea.removeChild(elem2);
        }
    }

    // remove projectiles if off screen
    else if (elem1.className.includes('c-projectiles')) {
        if (rect1.right < 0 || rect1.left > window.innerWidth) gameArea.removeChild(elem1);
    }
}

function collisonImpact(character, damage, damageAud, obj, characterHealth, whoWins) {
    if (damage > punchDamage) {
        damageAud.play()
        gameArea.removeChild(obj);
    }

    characterHealth.value -= damage

    character.classList.add("characters-hit")
    setTimeout(() => character.classList.remove("characters-hit"), 100);

    // who wins
    if (characterHealth.value === 0) resetGame(whoWins)
}


// player reset
function resetPlayers(player, playerRLeg, playerLLeg, playerARight, playerALeft, playerAnimeClass,
    playerRLegAnimeClass, playerLLegAnimeClass, playerARightAnimeClass, playerALeftAnimeClass, anime) {

    if (anime === 'move') addAndRemoveEvent("keydown", handleKeydown, "add")
    if (anime === 'jump') {
        if (player.className.includes('cap-america')) addAndRemoveEvent("keypress", handleKeypress, "add")
        else if (player.className.includes('ironman')) ironmanCanJump = true
    }

    if (anime === 'punch') addAndRemoveEvent("keyup", handleKeyup, "add")

    if (playerAnimeClass) player.classList.remove(playerAnimeClass)
    if (playerRLeg) playerRLeg.classList.remove(playerRLegAnimeClass)
    if (playerLLeg) playerLLeg.classList.remove(playerLLegAnimeClass)
    if (playerARight) playerARight.classList.remove(playerARightAnimeClass)
    if (playerALeft) playerALeft.classList.remove(playerALeftAnimeClass)
}

// REMOVE AND ADD EVENTS
function addAndRemoveEvent(listner, funcName, charCMD) {
    if (charCMD === "remove") window.removeEventListener(listner, funcName, false)
    else if (charCMD === "add" && isGameRunning === true) window.addEventListener(listner, funcName, false)
}

// Reset Game
function resetGame(data) {
    stopTargetLocked()
    // stoping game logixs
    isGameRunning = false
    gameMusic.pause()
    gameMusic.currentTime = 0

    gameOver.play()

    // stop player/character
    stopAITOIronman()
    addAndRemoveEvent('keydown', handleKeydown, "remove")
    addAndRemoveEvent('keypress', handleKeypress, "remove")
    addAndRemoveEvent('keyup', handleKeyup, "remove")

    // stop weapon bars
    capWeaponBar.value = 0
    ironmanWeaponBar.value = 0

    if (data === "You Win") {
        ironman.classList.add("hide")
        capWinsAud.play()
    }

    else {
        capAmerica.classList.add("hide")
        ironmanWinsAud.play()
    }

    // restart whole game after 2 seconds
    gameTimeout = setTimeout(() => {
        playBtn.classList.remove("hide")
        capAmerica.classList.remove("hide")
        ironman.classList.remove("hide")
        capHealth.value = 100
        ironmanHealth.value = 100

        capAmerica.style.left = "5px"
        ironman.style.left = "calc(100% - 100px)"
    }, 2500);
}