const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const box = 20;
let snake = [{ x: 9 * box, y: 9 * box }];
let direction = '';
let food = spawnFood();
let score = 0;

document.addEventListener("keydown", changeDirection);
const gameInterval = setInterval(game, 150); // Slower interval

function changeDirection(event) {
    if (event.keyCode == 37 && direction != "RIGHT") {
        direction = "LEFT";
    }
    else if (event.keyCode == 38 && direction != "DOWN") {
        direction = "UP";
    }
    else if (event.keyCode == 39 && direction != "LEFT") {
        direction = "RIGHT";
    }
    else if (event.keyCode == 40 && direction != "UP") {
        direction = "DOWN";
    }
}

function spawnFood() {
    let newFood;
    do {
        newFood = {
            x: Math.floor(Math.random() * (canvas.width / box)) * box,
            y: Math.floor(Math.random() * (canvas.height / box)) * box
        };
    } while (snake.some(segment => segment.x === newFood.x && segment.y === newFood.y));
    return newFood;
}

function game() {
    if (isGameOver()) {
        clearInterval(gameInterval);
        alert("Game over!! Score: " + score);
        document.location.reload();
    }
    else {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        drawSnake();
        drawFood();
        moveSnake();
        drawScore();
    }
}

function drawSnake() {
    snake.forEach((segment, index) => {
        ctx.fillStyle = index == 0 ? "green" : "lightgreen";

        // Draw circle instead of rectangle
        ctx.beginPath();
        ctx.arc(segment.x + box / 2, segment.y + box / 2, box / 2, 0, 2 * Math.PI);
        ctx.fill();
        ctx.strokeStyle = "darkgreen";
        ctx.stroke();
    });
}


function drawFood() {
    ctx.fillStyle = "red";

    // Draw a smaller circle for the food
    const radius = box / 2; // Adjust the radius for a smaller size
    ctx.beginPath();
    ctx.arc(food.x + box / 2, food.y + box / 2, radius, 0, 2 * Math.PI);
    ctx.fill();
    ctx.strokeStyle = "darkred";
    ctx.stroke();
}


function moveSnake() {
    const head = { x: snake[0].x, y: snake[0].y };

    if (direction == "LEFT") head.x -= box;
    if (direction == "UP") head.y -= box;
    if (direction == "RIGHT") head.x += box;
    if (direction == "DOWN") head.y += box;

    if (head.x == food.x && head.y == food.y) {
        score++;
        food = spawnFood(); // Respawn food at a new location
    } else {
        snake.pop();
    }
    snake.unshift(head);
}

function drawScore() {
    ctx.fillStyle = "white";
    ctx.font = "20px Arial";
    ctx.fillText("Score: " + score, box, box);
}

function isGameOver() {
    const head = snake[0];
    if (
        head.x < 0 || head.x >= canvas.width ||
        head.y < 0 || head.y >= canvas.height ||
        snake.slice(1).some(segment => segment.x == head.x && segment.y == head.y)
    ) {
        return true;
    }
    return false;
}
