// constants
const NUM_COLS = 5;
const NUM_ROWS = 5;
const NUM_CELLS = NUM_COLS * NUM_ROWS;


// variables
let terms = [];
let rows = []; // contains buttons


// dom elements
let bingoCard;


// auto init
initBingo();


// methods definition
function initBingo() {
  terms = parseData();

  getDOMElements();
  addButtons(terms);
}

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

function getDOMElements() {
  bingoCard = document.getElementById('bingoCard');
}

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

  const isEven = index % 2 === 0;
  if (isEven) {
    tile.classList.add('even');
  } else {
    tile.classList.add('odd');
  }

  return tile;
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