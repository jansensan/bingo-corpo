// constants
const FR = 'fr';
const EN = 'en';

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
let lang = '';
let terms = [];
let rows = []; // contains buttons


// dom elements
let bingoCard;

let corpoCB;
let marketingCB;
let designCB;
let techCB;
let restartGameLink;

let veil;
let bingoDialog;
let winningLabels;
let restartGameButton;


// auto init
initBingo();


// methods definition
function initBingo() {
  lang = document.documentElement.lang;
  getDOMElements();
  terms = parseData();
  addButtons(terms);
  addOptionsListeners();
}

function getDOMElements() {
  bingoCard = document.getElementById('bingoCard');

  bingoDialog = document.getElementById('bingoDialog');
  veil = document.getElementById('veil');

  corpoCB = document.getElementById('corpoCB');
  marketingCB = document.getElementById('marketingCB');
  designCB = document.getElementById('designCB');
  techCB = document.getElementById('techCB');
  restartGameLink = document.getElementById('restartGameLink');

  winningLabels = document.getElementById('winningLabels');
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

function getGameScope() {
  const currentUrl = new URL(window.location.href);
  const searchParams = new URLSearchParams(currentUrl.searchParams);

  let scope;
  if (lang === FR) {
    const scopeFR = searchParams.get('sujets');
    if (scopeFR) {
      scope = scopeFR.split(',');
    }

  } else if (lang === EN) {
    const scopeEN = searchParams.get('scope');
    if (scopeEN) {
      scope = scopeEN.split(',');
    }
  }

  return scope;
}

function copyData() {
  const scope = getGameScope();

  let copy = [];

  if (
    (scope && scope.includes('corpo'))
    || scope === undefined
  ) {
    const corpo = BINGO_DATA.fr.corpo.slice();
    copy.push(...corpo.slice());
    corpoCB.checked = 'checked';
  }

  if (scope && scope.includes('marketing')) {
    const marketing = BINGO_DATA.fr.marketing.slice();
    marketing.forEach(element => {
      if (!copy.includes(element)) {
        copy.push(element);
      }
    });
    marketingCB.checked = 'checked';
  }

  if (scope && scope.includes('design')) {
    const design = BINGO_DATA.fr.design.slice();
    design.forEach(element => {
      if (!copy.includes(element)) {
        copy.push(element);
      }
    });
    designCB.checked = 'checked';
  }

  // tech
  if (scope && scope.includes('tech')) {
    const tech = BINGO_DATA.fr.tech.slice();
    tech.forEach(element => {
      if (!copy.includes(element)) {
        copy.push(element);
      }
    });
    techCB.checked = 'checked';
  }

  return copy;
}


// game options management
function addOptionsListeners() {
  corpoCB.addEventListener('change', onOptionChanged);
  marketingCB.addEventListener('change', onOptionChanged);
  designCB.addEventListener('change', onOptionChanged);
  techCB.addEventListener('change', onOptionChanged);
}

function onOptionChanged() {
  let scope = [];

  // check options
  // TODO: check if necessary?
  if (corpoCB.checked) {
    scope.push('corpo');
  }
  if (marketingCB.checked) {
    scope.push('marketing');
  }
  if (designCB.checked) {
    scope.push('design');
  }
  if (techCB.checked) {
    scope.push('tech');
  }

  let searchParamsValue = scope.join(',');
  if (!scope.length) {
    searchParamsValue = 'corpo';
  }

  const newURL = new URL(window.location.href);
  newURL.search = `?sujets=${ searchParamsValue }`;

  restartGameLink.setAttribute('href', newURL.href);
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
    showGameComplete(response.labels);
  }
}


// game flow
function checkForBingo() {
  const numTiles = 5;

  const colsLabels = [[], [], [], [], []];
  const colsValues = [[], [], [], [], []];

  let response = {
    bingo: false,
    type: null,
  };

  // go through rows
  let rowIndex = 0;
  rows.forEach(row => {
    const rowLabels = [];
    const rowValues = [];
    const tiles = row.getElementsByClassName('bingo-tile');
    for (let i = 0; i < numTiles; i++) {
      const tile = tiles[i];

      // save tile value in array for row
      rowValues.push(isTileElementStamped(tile));
      rowLabels.push(tile.innerText);

      // save tile value in array for column, to check later
      colsValues[i][rowIndex] = isTileElementStamped(tile);
      colsLabels[i][rowIndex] = tile.innerText;
    }

    // check for bingo at row
    if (rowValues.every(isItemTrue)) {
      response.bingo = true;
      response.type = BingoTypes.ROW;
      response.labels = rowLabels;
    }

    rowIndex++;
  });

  if (response.bingo) {
    return response;
  }


  // go through columns
  colsValues.forEach((values, colIndex) => {
    // check for bingo at col
    if (values.every(isItemTrue)) {
      response.bingo = true;
      response.type = BingoTypes.COLUMN;
      response.labels = colsLabels[colIndex];
    }
  });

  if (response.bingo) {
    return response;
  }


  // check diagonals - top-left → bottom right
  const diag1Values = [];
  const diag1Labels = [];
  rowIndex = 0;
  rows.forEach(row => {
    const tiles = row.getElementsByClassName('bingo-tile');
    const tile = tiles[rowIndex];
    diag1Values.push(isTileElementStamped(tile));
    diag1Labels.push(tile.innerText);
    rowIndex++;
  });

  if (diag1Values.every(isItemTrue)) {
    response.bingo = true;
    response.type = BingoTypes.DIAGONAL;
    response.labels = diag1Labels;
  }

  if (response.bingo) {
    return response;
  }


  // check diagonals - top-right → bottom left
  const diag2Values = [];
  const diag2Labels = [];
  rowIndex = 0;
  rows.forEach(row => {
    const tiles = row.getElementsByClassName('bingo-tile');
    const tileIndex = numTiles - rowIndex - 1;
    const tile = tiles[tileIndex];
    diag2Values.push(isTileElementStamped(tile));
    diag2Labels.push(tile.innerText);
    rowIndex++;
  });

  if (diag2Values.every(isItemTrue)) {
    response.bingo = true;
    response.type = BingoTypes.DIAGONAL;
    response.labels = diag2Labels;
  }

  if (response.bingo) {
    return response;
  }


  // no bingo...
  return response;
}

function showGameComplete(labels) {
  winningLabels.innerText = '';
  labels.forEach(label => {
    const li = document.createElement('li');
    li.innerText = label;
    winningLabels.appendChild(li);
  });

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
