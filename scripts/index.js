const cells = document.querySelectorAll('[data-cell]');
const board = document.getElementById('board');
const restartButton = document.getElementById('restart');
const line = document.getElementById('line');
let isXTurn = true;

const winningCombinations = [
  [0, 1, 2], 
  [3, 4, 5], 
  [6, 7, 8], 
  [0, 3, 6], 
  [1, 4, 7], 
  [2, 5, 8], 
  [0, 4, 8],
  [2, 4, 6]
];

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
  const cell = e.target;
  const currentClass = isXTurn ? 'x' : 'o';

  cell.classList.add(currentClass);

  const winningCombination = winningCombinations.find(combination =>
    combination.every(index => cells[index].classList.contains(currentClass))
  );

  if (winningCombination) {
    drawWinningLine(winningCombination);
    setTimeout(() => alert(`${isXTurn ? 'X' : 'O'} wins!`), 500);
    cells.forEach(cell => cell.removeEventListener('click', handleClick));
    return;
  }

  isXTurn = !isXTurn;
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
}

cells.forEach(cell => {
  cell.addEventListener('click', handleClick, { once: true });
});

restartButton.addEventListener('click', restartGame);
