// constants
const NUM_COLS = 5;
const NUM_ROWS = 5;
const NUM_CELLS = NUM_COLS * NUM_ROWS;

const DISABLED = 'disabled';
const SELECTED = 'aria-selected';

const BingoTypes = {
  ROW: 'row',
  COLUMN: 'column',
  DIAGONAL: 'diagonal',
};

// variables
let terms = [];
let rows = []; // contains buttons


// dom elements
let bingoCard;

let bingoDialog;
let veil;
let restartGameButton;


// auto init
initBingo();


// methods definition
function initBingo() {
  terms = parseData();
  getDOMElements();
  addButtons(terms);
}

function getDOMElements() {
  bingoCard = document.getElementById('bingoCard');
  bingoDialog = document.getElementById('bingoDialog');
  veil = document.getElementById('veil');
  restartGameButton = document.getElementById('restartGameButton');
}


// data management
function parseData() {
  const selectedTerms = []

  let urn = copyData();
  for (let i = 0; i < NUM_CELLS; i++) {
    const numItemsUrn = urn.length;
    const indexToPluck = Math.floor(Math.random() * numItemsUrn);
    const pluckedItem = urn[indexToPluck];
    selectedTerms.push(pluckedItem);
    urn.splice(indexToPluck, 1);
  }

  return selectedTerms;
}

function copyData() {
  const design = BINGO_DATA.fr.design.slice();
  const marketing = BINGO_DATA.fr.marketing.slice();

  let copy = design.slice();
  marketing.forEach(element => {
    if (!copy.includes(element)) {
      copy.push(element);
    }
  });

  return copy;
}


// card creation
function addButtons(terms) {
  let index = 0;
  let rowId = -1;

  terms.forEach(term => {
    // manage row
    const newRowId = Math.floor(index / NUM_COLS);
    if (newRowId !== rowId) {
      rowId = newRowId;

      const row = document.createElement('div');
      row.classList.add('tile-row');
      row.dataset.rowId = rowId;

      rows.push(row);
    }

    const tile = createTile({ index, term });
    tile.addEventListener('click', onTileClicked);
    rows[rowId].appendChild(tile);

    index++;
  });

  // add rows

  rows.forEach(row => {
    bingoCard.appendChild(row);
  });
}

function createTile(options) {
  const { index, term } = options;

  const tile = document.createElement('button');
  tile.type = 'button';
  tile.innerText = term;
  tile.classList.add('bingo-tile');

  const colId = index % NUM_COLS;
  const rowId = Math.floor(index / NUM_COLS);
  tile.dataset.col = colId;
  tile.dataset.row = rowId;
  tile.setAttribute(SELECTED, false);

  const isEven = index % 2 === 0;
  if (isEven) {
    tile.classList.add('even');
  } else {
    tile.classList.add('odd');
  }

  return tile;
}

function onTileClicked(event) {
  const tile = event.target;

  const isTileSelected = isTrue(tile.getAttribute(SELECTED));
  const newValue = !isTileSelected;
  tile.setAttribute(SELECTED, newValue);

  const response = checkForBingo();
  if (response.bingo) {
    showGameComplete();
  }
}


// game flow
function checkForBingo() {
  const numTiles = 5;
  const colsValues = [[], [], [], [], []];

  let response = {
    bingo: false,
    type: null,
  };

  // go through rows
  let rowIndex = 0;
  rows.forEach(row => {
    const rowValues = [];
    const tiles = row.getElementsByClassName('bingo-tile');
    for (let i = 0; i < numTiles; i++) {
      // save tile value in array for row
      const tile = tiles[i];
      rowValues.push(isTileElementStamped(tile));

      // save tile value in array for column, to check later
      colsValues[i][rowIndex] = isTileElementStamped(tile);
    }

    // check for bingo at row
    if (rowValues.every(isItemTrue)) {
      response.bingo = true;
      response.type = BingoTypes.ROW;
    }

    rowIndex++;
  });

  if (response.bingo) {
    return response;
  }


  // go through columns
  colsValues.forEach(values => {
    // check for bingo at col
    if (values.every(isItemTrue)) {
      response.bingo = true;
      response.type = BingoTypes.COLUMN;
    }
  });

  if (response.bingo) {
    return response;
  }


  // check diagonals - top-left → bottom right
  const diagonal1 = [];
  rowIndex = 0;
  rows.forEach(row => {
    const tiles = row.getElementsByClassName('bingo-tile');
    diagonal1.push(isTileElementStamped(tiles[rowIndex]));
    rowIndex++;
  });

  if (diagonal1.every(isItemTrue)) {
    response.bingo = true;
    response.type = BingoTypes.DIAGONAL;
  }

  if (response.bingo) {
    return response;
  }


  // check diagonals - top-right → bottom left
  const diagonal2 = [];
  rowIndex = 0;
  rows.forEach(row => {
    const tiles = row.getElementsByClassName('bingo-tile');
    const tileIndex = numTiles - rowIndex - 1;
    diagonal2.push(isTileElementStamped(tiles[tileIndex]));
    rowIndex++;
  });

  if (diagonal2.every(isItemTrue)) {
    response.bingo = true;
    response.type = BingoTypes.DIAGONAL;
  }

  if (response.bingo) {
    return response;
  }


  // no bingo...
  return response;
}

function showGameComplete() {
  veil.classList.remove('hidden');
  bingoDialog.showModal();

  veil.addEventListener('click', onDismissDialog);
  restartGameButton.addEventListener('click', onDismissDialog);
}

function onDismissDialog() {
  restartGame();
}

function restartGame() {
  location.reload();
}


// utils
function isTileElementStamped(tile) {
  if (!tile) {
    return false;
  }
  return isTrue(tile.getAttribute(SELECTED));
}

function isItemTrue(value) {
  return value === true;
}

function isTrue(value) {
  const valueType = typeof value;

  if (valueType === 'string') {
    return value.toLowerCase() === 'true';
  } else if (valueType === 'boolean') {
    return value === true;
  } else {
    false;
  }
}
