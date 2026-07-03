const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");
const overlay = document.getElementById("overlay");
const ground = 280;
const minCanvasWidth = 800;

function resizeCanvas() {
    const width = Math.max(window.innerWidth - 32, minCanvasWidth);
    canvas.width = width;
    canvas.height = 280;
}

resizeCanvas();
window.addEventListener("resize", resizeCanvas);

const character = {
    x: 50,
    y: ground - 50,
    width: 20,
    height: 50,
    color: "red",
    velocityY: 0,
    velocityX: 0,
    jumping: false,
}

const gravity = 0.5;
const jumpForce = -12;
let jumpHeld = false;
let jumpTime = 0;
let isLayingDown = false;
let isGameOver = false;
const maxJumpTime = 15;const baseRunSpeed = 2.4;
const horizontalBoost = 0.22;
const holdToMoveX = 6;
const maxHorizontalVelocity = 3.2;
const obstacles = [];
const minObstacleWidth = 20;
const maxObstacleWidth = 50;
const minObstacleHeight = 25;
const maxObstacleHeight = 60;
const obstacleSpawnGap = 320;
const minObstacleX = 80;
const maxObstacleX = 180;
const minAirObstacleY = 50;
const maxAirObstacleY = 120;
let obstacleSpawnCount = 0;

function spawnObstacle() {
    const isBirdObstacle = obstacleSpawnCount % 4 === 3;
    obstacleSpawnCount++;

    let width = Math.floor(Math.random() * (maxObstacleWidth - minObstacleWidth + 1)) + minObstacleWidth;
    let height = Math.floor(Math.random() * (maxObstacleHeight - minObstacleHeight + 1)) + minObstacleHeight;
    const xOffset = Math.floor(Math.random() * (maxObstacleX - minObstacleX + 1)) + minObstacleX;

    if (isBirdObstacle) {
        width = Math.floor(Math.random() * 16) + 16;
        height = Math.floor(Math.random() * 14) + 18;
    }

    let y;
    if (isBirdObstacle) {
        const previousGroundObstacle = obstacles[obstacles.length - 1];
        const previousTop = previousGroundObstacle ? previousGroundObstacle.y : ground - height;
        const airOffset = Math.min(maxAirObstacleY, Math.max(minAirObstacleY, previousTop - 20));
        y = ground - height - airOffset;
    } else {
        y = ground - height;
    }

    obstacles.push({
        x: canvas.width + xOffset,
        y,
        width,
        height,
        type: isBirdObstacle ? "bird" : "cactus",
        moveSpeed: baseRunSpeed + (isBirdObstacle ? 0.8 : 0),
    });
}

function checkCollision() {
    const characterBox = {
        x: character.x,
        y: character.y,
        width: character.width,
        height: character.height,
    };

    return obstacles.some((obstacle) => {
        const obstacleBox = {
            x: obstacle.x,
            y: obstacle.y,
            width: obstacle.width,
            height: obstacle.height,
        };

        return characterBox.x < obstacleBox.x + obstacleBox.width &&
            characterBox.x + characterBox.width > obstacleBox.x &&
            characterBox.y < obstacleBox.y + obstacleBox.height &&
            characterBox.y + characterBox.height > obstacleBox.y;
    });
}

function updateObstacles() {
    obstacles.forEach((obstacle) => {
        obstacle.x -= obstacle.moveSpeed + character.velocityX;
    });

    for (let i = obstacles.length - 1; i >= 0; i--) {
        if (obstacles[i].x + obstacles[i].width < 0) {
            obstacles.splice(i, 1);
        }
    }

    if (obstacles.length === 0 || obstacles[obstacles.length - 1].x < canvas.width - obstacleSpawnGap) {
        spawnObstacle();
    }
}

function updateCharacter() {
    if (isGameOver) {
        return;
    }

    if (jumpHeld && jumpTime < maxJumpTime) {
        character.velocityY -= 0.3; // extra upward force

        if (jumpTime >= holdToMoveX) {
            character.velocityX = Math.min(maxHorizontalVelocity, character.velocityX + horizontalBoost);
        }

        jumpTime++;
    }

    character.velocityY += gravity;
    character.velocityX *= 0.95;
    character.x += baseRunSpeed + character.velocityX;
    character.y += character.velocityY;

    if (character.x + character.width < 0) {
        character.x = canvas.width;
    } else if (character.x > canvas.width) {
        character.x = -character.width;
    }

    if (character.y + character.height > ground) {
        character.y = ground - character.height;
        character.velocityY = 0;
        character.velocityX = 0;
        character.jumping = false;
    }
}


function drawCharacter() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = "red";
    ctx.fillRect(0, ground - 2, canvas.width, 4);

    ctx.fillStyle = "#7a7a7a";
    obstacles.forEach((obstacle) => {
        ctx.fillRect(obstacle.x, obstacle.y, obstacle.width, obstacle.height);
    });

    ctx.fillStyle = "red";

    if (isLayingDown) {
        ctx.save();
        ctx.translate(character.x + character.width / 2, character.y + character.height - character.width / 2);
        ctx.rotate(Math.PI / 2);
        ctx.fillRect(-character.width / 2, -character.height / 2, character.width, character.height);
        ctx.restore();
    } else {
        ctx.fillRect(character.x, character.y, character.width, character.height);
    }
}

function updateOverlay() {
    overlay.classList.toggle("hidden", !isGameOver);
}

function resetGame() {
    character.x = 50;
    character.y = ground - character.height;
    character.velocityY = 0;
    character.velocityX = 0;
    character.jumping = false;
    jumpHeld = false;
    jumpTime = 0;
    isLayingDown = false;
    isGameOver = false;
    obstacles.length = 0;
    obstacleSpawnCount = 0;
    updateOverlay();
    gameLoop();
}

function gameLoop() {
    updateCharacter();
    updateObstacles();

    if (checkCollision()) {
        isGameOver = true;
    }

    drawCharacter();
    updateOverlay();
    if (!isGameOver) {
        requestAnimationFrame(gameLoop);
    }
}

function isJumpKey(code) {
    return code === "Space" || code === "ArrowUp";
}

document.addEventListener("keydown", (event) => {
    if (isGameOver && event.code === "Enter") {
        event.preventDefault();
        resetGame();
        return;
    }

    if (isGameOver) {
        return;
    }

    if (event.code === "ArrowDown") {
        event.preventDefault();
        isLayingDown = true;
        return;
    }

    if (!isJumpKey(event.code)) {
        return;
    }

    event.preventDefault();
    jumpHeld = true;

    if (!character.jumping) {
        character.jumping = true;
        character.velocityY = jumpForce;
        character.velocityX = 0;
        jumpTime = 0;
    }
});

document.addEventListener("keyup", (event) => {
    if (event.code === "ArrowDown") {
        isLayingDown = false;
        return;
    }

    if (isJumpKey(event.code)) {
        jumpHeld = false;
    }
});

gameLoop();