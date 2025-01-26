const menu = document.getElementById('menu');
const onePlayerButton = document.getElementById('one-player');
const twoPlayerButton = document.getElementById('two-player');
const gameContainer = document.querySelector('.game-container');
const cells = document.querySelectorAll('[data-cell]');
const board = document.getElementById('board');
const restartButton = document.getElementById('restart');
const backToMenuButton = document.getElementById('back-to-menu');
const line = document.getElementById('line');
const turnIndicator = document.getElementById('turn-indicator');
let isXTurn = true;
let isOnePlayer = false;
let isComputerTurn = false;

const winningCombinations = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];

function updateTurnIndicator() {
  if (isOnePlayer) {
    turnIndicator.textContent = isXTurn ? "Your Turn" : "Opponent's Turn";
  } else {
    turnIndicator.textContent = isXTurn ? "X's Turn" : "O's Turn";
  }
}

function drawWinningLine(combination) {
  const firstCell = cells[combination[0]];
  const lastCell = cells[combination[2]];

  const firstRect = firstCell.getBoundingClientRect();
  const lastRect = lastCell.getBoundingClientRect();

  const boardRect = board.getBoundingClientRect();

  const x1 = firstRect.left + firstRect.width / 2 - boardRect.left;
  const y1 = firstRect.top + firstRect.height / 2 - boardRect.top;
  const x2 = lastRect.left + lastRect.width / 2 - boardRect.left;
  const y2 = lastRect.top + lastRect.height / 2 - boardRect.top;

  const length = Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
  const angle = Math.atan2(y2 - y1, x2 - x1) * (180 / Math.PI);

  line.style.width = `${length}px`;
  line.style.transform = `translate(${x1}px, ${y1}px) rotate(${angle}deg)`;
  line.style.transition = 'width 0.5s ease-in-out';
  line.style.opacity = '1';
}

function handleClick(e) {
  if (isOnePlayer && isComputerTurn) return;

  const cell = e.target;

  if (cell.classList.contains('x') || cell.classList.contains('o')) return;

  const currentClass = isXTurn ? 'x' : 'o';
  cell.classList.add(currentClass);

  const winningCombination = winningCombinations.find(combination =>
    combination.every(index => cells[index].classList.contains(currentClass))
  );

  if (winningCombination) {
    drawWinningLine(winningCombination);
    setTimeout(() => alert(`${isOnePlayer ? (isXTurn ? "You Win!" : "Opponent Wins!") : (isXTurn ? "X Wins!" : "O Wins!")}`), 500);
    cells.forEach(cell => cell.removeEventListener('click', handleClick));
    turnIndicator.style.display = 'none';
    return;
  }

  isXTurn = !isXTurn;
  updateTurnIndicator();

  if (isOnePlayer && !isXTurn) {
    isComputerTurn = true;
    setTimeout(() => {
      computerMove();
      isXTurn = true;
      isComputerTurn = false;
      updateTurnIndicator();
    }, 1000);
  }
}

function computerMove() {
  const availableCells = Array.from(cells).filter(cell =>
    !cell.classList.contains('x') && !cell.classList.contains('o')
  );

  if (availableCells.length > 0) {
    const randomCell = availableCells[Math.floor(Math.random() * availableCells.length)];
    randomCell.classList.add('o');

    const winningCombination = winningCombinations.find(combination =>
      combination.every(index => cells[index].classList.contains('o'))
    );

    if (winningCombination) {
      drawWinningLine(winningCombination);
      setTimeout(() => alert('Opponent Wins!'), 500);
      cells.forEach(cell => cell.removeEventListener('click', handleClick));
      turnIndicator.style.display = 'none';
    }
  }
}

function startGame(onePlayerMode) {
  isOnePlayer = onePlayerMode;
  menu.style.display = 'none';
  gameContainer.style.display = 'flex';
  turnIndicator.style.display = 'block';
  updateTurnIndicator();
  restartGame();
}

function restartGame() {
  cells.forEach(cell => {
    cell.classList.remove('x', 'o');
    cell.removeEventListener('click', handleClick);
    cell.addEventListener('click', handleClick, { once: true });
  });

  line.style.width = '0';
  line.style.opacity = '0';
  isXTurn = true;

  turnIndicator.style.display = 'block';
  updateTurnIndicator();
}

function backToMenu() {
  gameContainer.style.display = 'none';
  menu.style.display = 'flex';

  line.style.width = '0';
  line.style.opacity = '0';

  turnIndicator.style.display = 'none';

  cells.forEach(cell => {
    cell.classList.remove('x', 'o');
    cell.removeEventListener('click', handleClick);
  });

  isXTurn = true;
}

document.addEventListener('mousemove', (e) => {
  turnIndicator.style.left = `${e.pageX + 20}px`;
  turnIndicator.style.top = `${e.pageY - 20}px`;
});

onePlayerButton.addEventListener('click', () => startGame(true));
twoPlayerButton.addEventListener('click', () => startGame(false));
restartButton.addEventListener('click', restartGame);
backToMenuButton.addEventListener('click', backToMenu);
