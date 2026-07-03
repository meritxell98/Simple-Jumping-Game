const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

const character = {
    x: 50,
    y: 230,
    width: 20,
    height: 50,
    color: "red",
    velocityY: 0,
    velocityX: 0,
    jumping: false,
}

const gravity = 0.5;
const jumpForce = -10;
const ground = canvas.height - character.height;
let jumpHeld = false;
let jumpTime = 0;
let isLayingDown = false;
const maxJumpTime = 15;const baseRunSpeed = 2.4;
const horizontalBoost = 0.22;
const holdToMoveX = 6;
const maxHorizontalVelocity = 3.2;

function updateCharacter() {

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

    if (character.y > ground) {
        character.y = ground;
        character.velocityY = 0;
        character.velocityX = 0;
        character.jumping = false;
    }
}


function drawCharacter() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

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

function gameLoop() {
    updateCharacter();
    drawCharacter();
    requestAnimationFrame(gameLoop);
}

function isJumpKey(code) {
    return code === "Space" || code === "ArrowUp";
}

document.addEventListener("keydown", (event) => {
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