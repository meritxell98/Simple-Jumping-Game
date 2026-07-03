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

function drawCharacter() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = "red";
    ctx.fillRect(character.x, character.y, character.width, character.height);

    requestAnimationFrame(drawCharacter);
}

drawCharacter();