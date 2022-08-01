/** Connect Four
 *
 * Player 1 and 2 alternate turns. On each turn, a piece is dropped down a
 * column until a player gets four-in-a-row (horiz, vert, or diag) or until
 * board fills (tie)
 */

const WIDTH = 7;
const HEIGHT = 6;

let currPlayer = "Mint"; // active player: 1 or 2
const board = []; // array of rows, each row is array of cells  (board[y][x])

/** makeBoard: create in-JS board structure:
 *    board = array of rows, each row is array of cells  (board[y][x])
 */

const makeBoard = () => {
  for (let j = 0; j < HEIGHT; j ++){
    newArr = []
    for (let i = 0; i < WIDTH; i ++){
      newArr[i] = null 
    }
    board[j] = newArr
  }
  return board
}

/** makeHtmlBoard: make HTML table and row of column tops. */

function makeHtmlBoard() {
  const htmlBoard = document.getElementById("board");
  // Create the first row of the board and its event listener
  const top = document.createElement("tr");
  top.setAttribute("id", "column-top");
  top.addEventListener("click", handleClick);

  //Fill the row with cells
  for (let x = 0; x < WIDTH; x++) {
    const headCell = document.createElement("td");
    headCell.setAttribute("id", x);
    top.append(headCell);
  }
  htmlBoard.append(top);

  // Set rows and columns according to HEIGHT and WIDTH
  for (let y = 0; y < HEIGHT; y++) {
    const row = document.createElement("tr");
    for (let x = 0; x < WIDTH; x++) {
      const cell = document.createElement("td");
      cell.setAttribute("id", `${y}-${x}`);
      row.append(cell);
    }
    htmlBoard.append(row);
  }
}

const togglePlayer = () => {
  return currPlayer === "Mint" ? currPlayer = "Strawberry" : currPlayer === "Strawberry" ?
  currPlayer = "Mint" : currPlayer = "Strawberry";
}

//The counter array keeps track of all y coordinates and helps to determine if there are any remaining moves in the game
const makeCounterArr = () => {
  counterArr = [...board[HEIGHT-1]]
  for (let i = 0; i < counterArr.length; i ++ ){
    counterArr[i] = WIDTH-1
    }
  return counterArr
}
/** findSpotForCol: given column x, return top empty y (null if filled) */
const findSpotForCol = (x) => {
  if (counterArr[x] === 0){
    return null
  }
  else if (counterArr[x] >= 0){ //This keeps the array entries at 0 for counterArr.reduce
    counterArr[x] -= 1
    return counterArr[x]
  }
}



/** placeInTable: update DOM to place piece into HTML table of board */
const placeInTable = (y, x) => { 
  selectedDiv = document.getElementById(y+"-"+x);
  newDiv = document.createElement("div");
  newDiv.classList.add("piece", currPlayer);
  newDiv.setAttribute("id", y+"-"+x);
  selectedDiv.append(newDiv);
  board[y][x] = currPlayer; //Reflect those coordinates in the array
}
/** endGame: announce game end */
const endGame = (msg) =>{
  topRow = document.getElementById("column-top")
  topRow.removeEventListener("click", handleClick)
  setTimeout(function(){
    alert(msg)
  }, 200);
}

/** handleClick: handle click of column top to play piece */

function handleClick(evt) {
  // get x from ID of clicked cell
  
  const x = +evt.target.id;   
 const y = findSpotForCol(x);

   // get next spot in column (if none, ignore click) 
   if (y === null) {
      return;
    }
  togglePlayer(); 

  // place piece in board and add to HTML table
  // TODO: add line to update in-memory board
  placeInTable(y, x);

  // check for win
  if (checkForWin()) {
    return endGame(`${currPlayer} player won!`);
  }

  else if(checkForTie()){
    return endGame("The game is tied!");
  }
}

const checkForTie = () => {
  return counterArr.every(function(i){ 
    return i === 0
  })
}

function checkForWin() {
  function _win(cells) {
    // Check four cells to see if they're all color of current player
    //  - cells: list of four (y, x) cells
    //  - returns true if all are legal coordinates & all match currPlayer

    return cells.every(
      ([y, x]) =>
        y >= 0 &&
        y < HEIGHT &&
        x >= 0 &&
        x < WIDTH &&
        board[y][x] === currPlayer
    );
  }



  // TODO: read and understand this code. Add comments to help you.

  for (let y = 0; y < HEIGHT; y++) {
    for (let x = 0; x < WIDTH; x++) {
      let horiz = [[y, x], [y, x + 1], [y, x + 2], [y, x + 3]];
      let vert = [[y, x], [y + 1, x], [y + 2, x], [y + 3, x]];
      let diagDR = [[y, x], [y + 1, x + 1], [y + 2, x + 2], [y + 3, x + 3]];
      let diagDL = [[y, x], [y + 1, x - 1], [y + 2, x - 2], [y + 3, x - 3]];

      if (_win(horiz) || _win(vert) || _win(diagDR) || _win(diagDL)) {
        return true;
      }
    }
  }
}

makeBoard();
makeHtmlBoard();
makeCounterArr();

checkForTie();