// constants
const NUM_COLS = 5;
const NUM_ROWS = 5;
const NUM_CELLS = NUM_COLS * NUM_ROWS;


// variables
let terms = [];


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
  terms.forEach(term => {
    // if (index % NUM_COLS === 0) {
      // console.log('create new row');
    // }

    const isEven = index % 2 === 0;

    const b = document.createElement('button');
    b.type = 'button';
    b.innerText = term;
    b.classList.add('bingo-button');
    if (isEven) {
      b.classList.add('even');
    } else {
      b.classList.add('odd');
    }
    bingoCard.appendChild(b);

    index++;
  });
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