const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

const character = {
    x: 50,
    y: 230,
    width: 20,
    height: 50,
    color: "red",
    velocityY: 0,
    jumping: false,
}

const gravity = 0.5;
const jumpForce = -10;
const ground = canvs.height - character.height;

function updateCharacter() {
    characther.velocityY += gravity;
    character.y += character.velocityY;

    if (character.y > ground) {
        character.y = ground;
        character.velocityY = 0;
        character.jumping = false;
    }
}


function drawCharacter() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = "red";
    ctx.fillRect(character.x, character.y, character.width, character.height);

    requestAnimationFrame(drawCharacter);
}

function gameLoop() {
    updateCharacter();
    drawCharacter();
    requestAnimationFrame(gameLoop);
}

document.addEventListener("keydown", (event) => {
    if (event.code === "Space" && !character.jumping) {
        character.velocityY = jumpForce;
        character.jumping = true;
    }
});

gameLoop();