document.addEventListener('DOMContentLoaded', () => {
  const tam = 9;
  let level = 40;
  const emptySpaces = () => {
    let empty = 0;
    cells.forEach(cell => {
      if(cell.textContent === ''){
        empty++;
      }
    })
    return empty;
  }

  const cells = document.querySelectorAll('td');

  cells.forEach(cell => {
    // Editable cell
    cell.contentEditable = true;

    // Add a listener to data input
    cell.addEventListener('input', function(event) {
      let text = this.textContent;

      // Remove everithig that isn't a number 1-9 
      text = text.replace(/[^0-9]/g, '');

      if (text.length > 1) {
        text = text.substring(0, 1);
      }

      if (text === '0') {
        text = '';
      }

      // Atualize the content
      this.textContent = text;

      // Put the cursor in the end of text
      const range = document.createRange();
      const sel = window.getSelection();
      
      // verify if cell has a content
      if (this.firstChild) {
        range.setStart(this.firstChild, this.firstChild.length);
        range.collapse(true);
        sel.removeAllRanges();
        sel.addRange(range);
      }
      const isEmpty = emptySpaces();
      if(!isEmpty) {
        check();
      }
    });
  });



  function generateSudoku() {
    const board = Array.from({ length: tam }, () => Array(tam).fill(0));
    solveSudoku(board);
    const originalBoard = board.map(row => [...row]); // Cria uma cópia
    removeNumbers(board, level);
    return { puzzle: board, solution: originalBoard }; // Retorna o quebra-cabeça e a solução
  }

  function solveSudoku(board) {
    for (let row = 0; row < tam; row++) {
      for (let col = 0; col < tam; col++) {
        if (board[row][col] === 0) {
          const numbers = shuffle([1, 2, 3, 4, 5, 6, 7, 8, 9]);
          for (let num of numbers) {
            if (isValid(board, row, col, num)) {
              board[row][col] = num;
              if (solveSudoku(board)) {
                return true;
              } else {
                board[row][col] = 0; // backtrack
              }
            }
          }
          return false;
        }
      }
    }
    return true;
  }

  function isValid(board, row, col, num) {
    // Verifica a linha
    for (let i = 0; i < tam; i++) {
      if (board[row][i] === num) return false;
    }
    // Verifica a coluna
    for (let i = 0; i < tam; i++) {
      if (board[i][col] === num) return false;
    }
    // Verifica a sub-grade 3x3
    const startRow = Math.floor(row / 3) * 3;
    const startCol = Math.floor(col / 3) * 3;
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        if (board[startRow + i][startCol + j] === num) return false;
      }
    }
    return true;
  }

  function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }

  function removeNumbers(board, count) {
    let removedCount = 0;
    while (removedCount < count) {
      const row = Math.floor(Math.random() * tam);
      const col = Math.floor(Math.random() * tam);
      if (board[row][col] !== 0) {
        board[row][col] = 0;
        removedCount++;
      }
    }
  }

  function render(game) {
    for (let row = 0; row < tam; row++) {
      for (let col = 0; col < tam; col++) {
        const cell = cells[tam * row + col];
        const value = game[row][col];
        
        cell.textContent = '';
        cell.removeAttribute('contenteditable');
        cell.classList.remove('fixed-number');

        if (value !== 0) {
          cell.textContent = value;
          cell.classList.add('fixed-number');
          cell.setAttribute('contenteditable', false);
          cell.classList.add('initial');
        } else {
          cell.setAttribute('contenteditable', true);
        }
      }
    }
  }

  // Geração e renderização inicial do jogo
  const { puzzle, solution } = generateSudoku();
  render(puzzle);
  
  function check() {
    let err = 0;
    for(let i = 0; i < tam; i++){
      for(let j = 0; j < tam; j++){
        if(String(solution[i][j]) !== cells[(i*9) + j].textContent){
          // console.log(`${String(solution[i][j])} !== ${cells[(i*9) + j].textContent}`)
          err++;
        }
      }
    }
    console.log(`Há ${err} números errados!`);
    console.log(solution);
  }
});