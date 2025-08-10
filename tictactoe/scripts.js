document.addEventListener('DOMContentLoaded', () => {
  tictactoe();
});



const tictactoe = () => {
  let hasListener = [true, true, true, true, true, true, true, true, true];
  const boards = document.querySelectorAll('td');
  const btn_reset = document.querySelector('button[name="reset"]');
  const showStats = document.querySelector('button[name="showStats"');
  
  const showStatics = () => {
    const st = document.querySelector('.stats');
    st.classList.toggle('hidde');
  }
  showStats.addEventListener('click', showStatics);
  const players = ['X', 'O'];
  let currentPlayer = players[0];
  let play = 0;

  const addBoardsClick = () => {
    boards.forEach(board => {
      board.addEventListener('click', game);
    });
    hasListener.forEach(item => {
      item = true;
    })
  }

  const init = () => {
    addBoardsClick();
    // console.info(`${btn_reset.target}`)
    btn_reset.addEventListener('click', () => {
      clean();
      init();
      play = 0;
      currentPlayer = players[0];
    });
  }

  const clean = () => {
    boards.forEach(board => {
      board.textContent = '';
      board.classList.remove('winner');
      board.classList.remove('text-red');
      board.classList.remove('text-blue');
    })
  }


  const select = (element) => {
    element.textContent = currentPlayer;
    if(currentPlayer === players[0]) {
      element.classList.add('text-blue');
    } else {
      element.classList.add('text-red');
    }
  }

  const changePlayer = () => {
    play++;
    currentPlayer = players[play%2];
  }

  function game(event) { 
    select(event.target);
    disable(event);
    if(play >= 4 && winner()) {
      console.info(`Jogo finalizado vitória de ${play%2 + 1}`);
      disableAll();
    }
    if(play >= 8 && !winner()){
      console.info("EMPATE!");
    }
    changePlayer();
  };
  function disable(event) {
    event.target.removeEventListener('click', game);
    hasListener[event.target.id-1] = false;
  }

  const disableAll = () => {
    for(i = 0; i < hasListener.length; i++){
      if(hasListener[i]){
        boards[i].removeEventListener('click', game);
      }
    }
  }

  const winner = () => {
    // console.info(`Checado na jogada ${play+1}!`);
    // verificando linhas
    if(boards[0].textContent !== '' && boards[0].textContent === boards[1].textContent && boards[0].textContent === boards[2].textContent){
      paint(0, 1, 2);
      return true;
    }
    if(boards[3].textContent !== '' && boards[3].textContent === boards[4].textContent && boards[3].textContent === boards[5].textContent){
      paint(3, 4, 5);
      return true;
    }
    if(boards[6].textContent !== '' && boards[6].textContent === boards[7].textContent && boards[6].textContent === boards[8].textContent){
      paint(6, 7, 8);
      return true;
    }
    // verificando colunas
    if(boards[0].textContent !== '' && boards[0].textContent === boards[3].textContent && boards[0].textContent === boards[6].textContent){
      paint(0, 3, 6);
      return true;
    }
    if(boards[1].textContent !== '' && boards[1].textContent === boards[4].textContent && boards[1].textContent === boards[7].textContent){
      paint(1, 4, 7);
      return true;
    }
    if(boards[2].textContent !== '' && boards[2].textContent === boards[5].textContent && boards[2].textContent === boards[8].textContent){
      paint(2, 5, 8);
      return true;
    }
    // verificando diagonais
    if(boards[0].textContent !== '' && boards[0].textContent === boards[4].textContent && boards[0].textContent === boards[8].textContent){
      paint(0, 4, 8);
      return true;
    }
    if(boards[2].textContent !== '' && boards[2].textContent === boards[4].textContent && boards[2].textContent === boards[6].textContent){
      paint(2, 4, 6);
      return true;
    }
    return false;
  }

  const paint = (a, b, c) => {
    boards[a].classList.add('winner');
    boards[b].classList.add('winner');
    boards[c].classList.add('winner');
  }

  init();
}

/*
var origBoard;
var huPlayer, aiPlayer;
const winCombos = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [6, 4, 2]
];

function chooseSymbol(symbol) {
    huPlayer = symbol;
    aiPlayer = symbol == 'X' ? 'O' : 'X';
    document.querySelector('.choose').style.display = 'none';
    document.querySelector('.game').style.display = 'block';
    document.querySelector('.buttonReplay').style.display = 'block';    
}

const cells = document.querySelectorAll('.cell');
startGame();

function startGame() {
    document.querySelector('.endgame').style.display = 'none';
    origBoard = Array.from(Array(9).keys());
    for (var i = 0; i < cells.length; i++) {
        cells[i].innerText = '';
        cells[i].style.removeProperty('background-color');
        cells[i].addEventListener('click', turnClick, false);
    }
}

function turnClick(square) {
    if (typeof origBoard[square.target.id] == 'number') {
        turn(square.target.id, huPlayer);
        if (!checkWin(origBoard, huPlayer) && !checkTie()) turn(bestSpot(), aiPlayer);
    }
}

function turn(squareId, player) {
    origBoard[squareId] = player;
    document.getElementById(squareId).innerText = player;
    let gameWon = checkWin(origBoard, player);
    if (gameWon) gameOver(gameWon);
}

function checkWin(board, player) {
    let plays = board.reduce((a, e, i) =>
        (e === player) ? a.concat(i) : a, []);
    let gameWon = null;
    for (let [index, win] of winCombos.entries()) {
        if (win.every(elem => plays.indexOf(elem) > -1)) {
            gameWon = { index: index, player: player };
            break;
        }
    }
    return gameWon;
}

function gameOver(gameWon) {
    for (let index of winCombos[gameWon.index]) {
        document.getElementById(index).style.backgroundColor =
            gameWon.player == huPlayer ? 'blue' : 'red';
    }
    for (var i = 0; i < cells.length; i++) {
        cells[i].removeEventListener('click', turnClick, false);
    }
    declareWinner(gameWon.player == huPlayer ? 'You win!' : 'You lose.');
}

function declareWinner(who) {
    document.querySelector('.endgame').style.display = 'block';
    document.querySelector('.endgame .text').innerText = who;
}

function emptySquares() {
    return origBoard.filter(s => typeof s == 'number');
}

function bestSpot() {
    return minimax(origBoard, aiPlayer).index;
}

function checkTie() {
    if (emptySquares().length == 0) {
        for (var i = 0; i < cells.length; i++) {
            cells[i].style.backgroundColor = 'green';
            cells[i].removeEventListener('click', turnClick, false);
        }
        declareWinner('Tie Game!');
        return true;
    }
    return false;
}

function minimax(newBoard, player) {
    var availSpots = emptySquares(newBoard);

    if (checkWin(newBoard, huPlayer)) {
        return { score: -10 };
    } else if (checkWin(newBoard, aiPlayer)) {
        return { score: 10 };
    } else if (availSpots.length === 0) {
        return { score: 0 };
    }
    var moves = [];
    for (var i = 0; i < availSpots.length; i++) {
        var move = {};
        move.index = newBoard[availSpots[i]];
        newBoard[availSpots[i]] = player;

        if (player == aiPlayer) {
            var result = minimax(newBoard, huPlayer);
            move.score = result.score;
        } else {
            var result = minimax(newBoard, aiPlayer);
            move.score = result.score;
        }

        newBoard[availSpots[i]] = move.index;

        moves.push(move);
    }

    var bestMove;
    if (player === aiPlayer) {
        var bestScore = -10000;
        for (var i = 0; i < moves.length; i++) {
            if (moves[i].score > bestScore) {
                bestScore = moves[i].score;
                bestMove = i;
            }
        }
    } else {
        var bestScore = 10000;
        for (var i = 0; i < moves.length; i++) {
            if (moves[i].score < bestScore) {
                bestScore = moves[i].score;
                bestMove = i;
            }
        }
    }

    return moves[bestMove];
}


*/