const fs = require('fs');

const UTF8 = 'utf-8';
const NL = '\n'; // new line
const CR = '\r'; // carriage return

const CSV_PATH = 'data/data.csv';
const FR_COL = 0;
const EN_COL = 1;
const DESIGN_COL = 2;
const MARKETING_COL = 3;


// auto init
readCSV();


// methods definitions
function readCSV() {
  fs.readFile(
    CSV_PATH,
    UTF8,
    (error, data) => {
      if (error) {
        console.log(`Error loading "${ CSV_PATH }": ${ error }`);
      } else {
        parseCSV(data);
      };
    }
  );
}

function parseCSV(data) {
  const fr = {
    design: [],
    marketing: [],
  };
  const en = {
    design: [],
    marketing: [],
  };

  const lines = data.split(NL);
  let index = 0;
  lines.forEach(l => {
    const line = l.replace(CR, '');
    const array = line.split(',');

    if (index > 0) {
      // design
      if (isTrue(array[DESIGN_COL])) {
        fr.design.push(array[FR_COL]);
        en.design.push(array[EN_COL]);
      }

      // marketing
      if (isTrue(array[MARKETING_COL])) {
        fr.marketing.push(array[FR_COL]);
        en.marketing.push(array[EN_COL]);
      }
    }

    index++;
  });

  const parsed = { fr, en };

  writeJSON(parsed);
}

function writeJSON(data) {
  const jsonPath = 'src/data/data.json';
  fs.writeFile(
    jsonPath,
    JSON.stringify(data, null, 2),
    UTF8,
    (error) => {
      if (error) {
        console.log(`Error saving "${ jsonPath }": ${ error }`);
      } else {
        console.log('json saved');
      };
    }
  );
}

function isTrue(value) {
  if (!value) {
    return false;
  }

  const typeValue = typeof value;
  if (typeValue === 'string' || typeValue === 'boolean') {
    return value.toLowerCase() === 'true';
  } else {
    return false;
  }
}
