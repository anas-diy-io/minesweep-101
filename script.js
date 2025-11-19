const boardElement = document.getElementById('game-board');
const rows = 10;
const cols = 10;
const mines = 10;

let board = [];

function createBoard() {
    for (let i = 0; i < rows; i++) {
        board[i] = [];
        for (let j = 0; j < cols; j++) {
            board[i][j] = {
                isMine: false,
                isRevealed: false,
                isFlagged: false,
                neighborMines: 0
            };
        }
    }

    // Place mines
    let minesPlaced = 0;
    while (minesPlaced < mines) {
        const row = Math.floor(Math.random() * rows);
        const col = Math.floor(Math.random() * cols);
        if (!board[row][col].isMine) {
            board[row][col].isMine = true;
            minesPlaced++;
        }
    }

    // Calculate neighbor mines
    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
            if (!board[i][j].isMine) {
                let count = 0;
                for (let x = -1; x <= 1; x++) {
                    for (let y = -1; y <= 1; y++) {
                        const newRow = i + x;
                        const newCol = j + y;
                        if (newRow >= 0 && newRow < rows && newCol >= 0 && newCol < cols && board[newRow][newCol].isMine) {
                            count++;
                        }
                    }
                }
                board[i][j].neighborMines = count;
            }
        }
    }
}

function renderBoard() {
    boardElement.innerHTML = '';
    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
            const cell = document.createElement('div');
            cell.classList.add('cell');
            if (board[i][j].isRevealed) {
                cell.classList.add('revealed');
                if (board[i][j].isMine) {
                    cell.classList.add('mine');
                    cell.textContent = '💣';
                } else if (board[i][j].neighborMines > 0) {
                    cell.textContent = board[i][j].neighborMines;
                }
            }
            cell.addEventListener('click', () => revealCell(i, j));
            boardElement.appendChild(cell);
        }
    }
}

function revealCell(row, col) {
    if (row < 0 || row >= rows || col < 0 || col >= cols || board[row][col].isRevealed) {
        return;
    }

    board[row][col].isRevealed = true;

    if (board[row][col].isMine) {
        explode(row, col);
    } else if (board[row][col].neighborMines === 0) {
        for (let x = -1; x <= 1; x++) {
            for (let y = -1; y <= 1; y++) {
                revealCell(row + x, col + y);
            }
        }
    }

    renderBoard();
    checkWin();
}

function explode(row, col) {
    board[row][col].isRevealed = true;
    renderBoard();

    const gameOverScreen = document.createElement('div');
    gameOverScreen.classList.add('game-over-screen');
    document.body.appendChild(gameOverScreen);

    setTimeout(() => {
        gameOverScreen.remove();
        alert('Game Over!');
        revealAll();
    }, 3000);
}

function revealAll() {
    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
            board[i][j].isRevealed = true;
        }
    }
    renderBoard();
}

function checkWin() {
    let revealedCount = 0;
    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
            if (board[i][j].isRevealed) {
                revealedCount++;
            }
        }
    }
    if (revealedCount === rows * cols - mines) {
        alert('You Win!');
        revealAll();
    }
}

createBoard();
renderBoard();
