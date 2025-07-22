const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const gridSize = 20;
const tileCount = canvas.width / gridSize;

let snake = [{x: 10, y: 10}];
let direction = {x: 0, y: 0};
let food = {x: 5, y: 5};
let gameOver = false;
let score = 0;
let speed = 150;
let gameLoopId = null;

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Draw snake
  ctx.fillStyle = 'lime';
  snake.forEach(part => {
    ctx.fillRect(part.x * gridSize, part.y * gridSize, gridSize, gridSize);
  });

  // Draw food
  ctx.fillStyle = 'red';
  ctx.fillRect(food.x * gridSize, food.y * gridSize, gridSize, gridSize);

  // Draw score
  ctx.fillStyle = 'white';
  ctx.font = '18px Arial';
  ctx.fillText('Score: ' + score, 10, 20);

  if (gameOver) {
    ctx.fillStyle = 'white';
    ctx.font = '30px Arial';
    ctx.fillText('Game Over!', 100, 200);
    drawRestartButton();
  }
}

function drawRestartButton() {
  ctx.fillStyle = '#333';
  ctx.fillRect(120, 240, 160, 50);
  ctx.strokeStyle = '#fff';
  ctx.strokeRect(120, 240, 160, 50);
  ctx.fillStyle = '#fff';
  ctx.font = '24px Arial';
  ctx.fillText('재시작', 170, 275);
}

function update() {
  if (gameOver) return;

  // 움직이지 않을 때는 update 생략
  if (direction.x === 0 && direction.y === 0) return;

  // Move snake
  const head = {x: snake[0].x + direction.x, y: snake[0].y + direction.y};

  // Check collision with wall
  if (head.x < 0 || head.x >= tileCount || head.y < 0 || head.y >= tileCount) {
    gameOver = true;
    return;
  }

  // Check collision with self
  if (snake.some(part => part.x === head.x && part.y === head.y)) {
    gameOver = true;
    return;
  }

  snake.unshift(head);

  // Eat food
  if (head.x === food.x && head.y === food.y) {
    placeFood();
    score += 1;
  } else {
    snake.pop();
  }
}

function placeFood() {
  let newFood;
  while (true) {
    newFood = {
      x: Math.floor(Math.random() * tileCount),
      y: Math.floor(Math.random() * tileCount)
    };
    if (!snake.some(part => part.x === newFood.x && part.y === newFood.y)) break;
  }
  food = newFood;
}

document.addEventListener('keydown', e => {
  if (gameOver) return;
  switch (e.key) {
    case 'ArrowUp':
      if (direction.y === 1) break;
      direction = {x: 0, y: -1};
      break;
    case 'ArrowDown':
      if (direction.y === -1) break;
      direction = {x: 0, y: 1};
      break;
    case 'ArrowLeft':
      if (direction.x === 1) break;
      direction = {x: -1, y: 0};
      break;
    case 'ArrowRight':
      if (direction.x === -1) break;
      direction = {x: 1, y: 0};
      break;
  }
});

canvas.addEventListener('click', function(e) {
  if (!gameOver) return;
  // 버튼 영역 클릭 시 재시작
  const rect = canvas.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;
  if (x >= 120 && x <= 280 && y >= 240 && y <= 290) {
    restartGame();
  }
});

function restartGame() {
  snake = [{x: 10, y: 10}];
  direction = {x: 0, y: 0};
  food = {x: 5, y: 5};
  gameOver = false;
  score = 0;
}

function gameLoop() {
  update();
  draw();
  gameLoopId = setTimeout(gameLoop, speed);
}

gameLoop();
